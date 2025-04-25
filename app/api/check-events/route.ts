import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function to check for upcoming events
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessToken, phoneNumber } = body;

    if (!accessToken || !phoneNumber) {
      return NextResponse.json(
        { error: 'Access token and phone number are required' },
        { status: 400 }
      );
    }

    // Create OAuth2 client for Google APIs
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    // Initialize Google Calendar API
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get current time and 5 minutes from now
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);

    // Query for events in the next 5 minutes
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: fiveMinutesFromNow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];

    if (events.length > 0) {
      // There are upcoming events, make a Twilio call
      for (const event of events) {
        await twilioClient.calls.create({
          twiml: `<Response><Say>Reminder: You have an event "${event.summary}" starting soon.</Say></Response>`,
          to: phoneNumber,
          from: process.env.TWILIO_PHONE_NUMBER || '',
        });
      }

      return NextResponse.json({
        success: true,
        message: `Made ${events.length} call(s) for upcoming events.`,
        events,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'No upcoming events in the next 5 minutes.',
      events: [],
    });
  } catch (error) {
    console.error('Error checking calendar events:', error);
    return NextResponse.json(
      { error: 'Failed to check calendar events' },
      { status: 500 }
    );
  }
} 