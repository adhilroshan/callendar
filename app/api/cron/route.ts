import { NextResponse } from "next/server";
import { google } from "googleapis";
import twilio from "twilio";
import { db } from "@/lib/db";

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Validate Twilio credentials
const isTwilioConfigured = 
  process.env.TWILIO_ACCOUNT_SID && 
  process.env.TWILIO_AUTH_TOKEN && 
  process.env.TWILIO_PHONE_NUMBER;

// Get the Twilio phone number with a default value
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || "";

export async function GET() {
  try {
    // Check if Twilio is configured
    if (!isTwilioConfigured) {
      console.warn("Twilio is not properly configured. Skipping call alerts.");
      return NextResponse.json({
        success: false,
        message: "Twilio is not properly configured",
      });
    }

    // Get all users with phone numbers
    const users = await db.getUsers();
    let callsMade = 0;
    const errors: Array<{ userId: string; eventId?: string; error: string }> = [];

    // Process each user
    for (const user of users) {
      if (!user || !user.phoneNumber || !user.accessToken) {
        continue;
      }

      try {
        // Create OAuth2 client for Google APIs
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ 
          access_token: user.accessToken,
          refresh_token: user.refreshToken
        });

        // Initialize Google Calendar API
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        // Get current time and 5 minutes from now
        const now = new Date();
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);

        // Query for events in the next 5 minutes
        const response = await calendar.events.list({
          calendarId: "primary",
          timeMin: now.toISOString(),
          timeMax: fiveMinutesFromNow.toISOString(),
          singleEvents: true,
          orderBy: "startTime",
        });

        const events = response.data.items || [];

        // Make call if there are events
        if (events.length > 0) {
          for (const event of events) {
            try {
              // Check if we haven't already alerted for this event
              const eventId = event.id || "unknown-event";
              const alreadyAlerted = await db.checkEventAlert(user.id, eventId);
              
              if (!alreadyAlerted) {
                // Make the Twilio call
                await twilioClient.calls.create({
                  twiml: `<Response><Say>Reminder: You have an event "${event.summary || 'Untitled'}" starting soon.</Say></Response>`,
                  to: user.phoneNumber,
                  from: twilioPhoneNumber,
                });
                
                // Mark this event as alerted
                await db.markEventAlerted(user.id, eventId);
                callsMade++;
              }
            } catch (error) {
              const eventError = error as Error;
              console.error(`Error making call for event ${event.id || "unknown"}:`, eventError);
              errors.push({
                userId: user.id,
                eventId: event.id || "unknown-event",
                error: eventError.message || "Unknown error making call"
              });
            }
          }
        }
      } catch (error) {
        const userError = error as Error;
        console.error(`Error processing user ${user.id}:`, userError);
        errors.push({
          userId: user.id,
          error: userError.message || "Unknown error processing user"
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cron job completed. Made ${callsMade} calls.`,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    const serverError = error as Error;
    console.error("Cron job error:", serverError);
    return NextResponse.json(
      { error: "Failed to run cron job", details: serverError.message || "Unknown error" },
      { status: 500 }
    );
  }
} 