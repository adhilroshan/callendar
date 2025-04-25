import { NextResponse } from "next/server";
import { auth } from "@/auth";
import twilio from "twilio";

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check admin rights (optional - you might want to restrict this)
    // This is a simple email check - replace with proper role-based check if needed
    // const isAdmin = session.user.email === "admin@example.com";
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { error: "Admin permissions required" },
    //     { status: 403 }
    //   );
    // }

    // Check Twilio environment variables
    const twilioStatus = {
      accountSid: !!process.env.TWILIO_ACCOUNT_SID,
      authToken: !!process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: !!process.env.TWILIO_PHONE_NUMBER,
      isFullyConfigured: !!(
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER
      ),
    };

    // Only try to validate the credentials if all variables are present
    let twilioClientValid = false;
    let twilioErrorMessage = null;

    if (twilioStatus.isFullyConfigured) {
      try {
        // Attempt to initialize the Twilio client and make a simple API call
        const twilioClient = twilio(
          process.env.TWILIO_ACCOUNT_SID!,
          process.env.TWILIO_AUTH_TOKEN!
        );
        
        // Check if the account is valid by fetching account info
        // This will throw an error if credentials are invalid
        await twilioClient.api.accounts(process.env.TWILIO_ACCOUNT_SID!).fetch();
        twilioClientValid = true;
      } catch (error) {
        twilioClientValid = false;
        twilioErrorMessage = error instanceof Error ? error.message : "Unknown error validating Twilio credentials";
      }
    }

    return NextResponse.json({
      twilioStatus: {
        ...twilioStatus,
        clientValid: twilioClientValid,
        errorMessage: twilioErrorMessage,
      },
    });
  } catch (error) {
    console.error("Error checking Twilio status:", error);
    return NextResponse.json(
      { error: "Failed to check Twilio status" },
      { status: 500 }
    );
  }
} 