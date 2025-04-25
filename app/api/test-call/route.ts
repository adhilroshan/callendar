import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
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

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to make a test call" },
        { status: 401 }
      );
    }

    // Check if Twilio is configured
    if (!isTwilioConfigured) {
      return NextResponse.json({
        success: false,
        message: "Twilio is not properly configured. Please set up your environment variables.",
      }, { status: 500 });
    }

    // Get the user from database
    const user = await db.getUserByEmail(session.user.email!);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found in database",
      }, { status: 404 });
    }

    // Check if user has a phone number
    if (!user.phoneNumber) {
      return NextResponse.json({
        success: false,
        message: "Please add a phone number in your dashboard before testing calls",
      }, { status: 400 });
    }

    // Parse request body for custom message
    let customMessage = "Hello, this is your Callendar reminder service. This is a test call confirming your reminders are working correctly.";
    try {
      const body = await req.json();
      if (body.message) {
        customMessage = body.message.slice(0, 150); // Increase message length limit
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Use default message if no body or parsing fails
    }

    // Make the Twilio call
    const call = await twilioClient.calls.create({
      twiml: `<Response>
        <Say voice="alice" language="en-US">
          ${customMessage}
          <Break time="1"/>
          Thank you for using Callendar.
        </Say>
      </Response>`,
      to: user.phoneNumber,
      from: twilioPhoneNumber,
    });

    return NextResponse.json({
      success: true,
      message: "Test call initiated successfully",
      callSid: call.sid,
    });
  } catch (error) {
    console.error("Error making test call:", error);
    return NextResponse.json(
      { 
        error: "Failed to make test call",
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
} 