import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // Get the authenticated session
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user || !session.accessToken) {
      return NextResponse.json(
        { error: "You must be logged in with a valid access token" },
        { status: 401 }
      );
    }

    // Get user ID from the database
    const userEmail = session.user.email as string;
    const dbUser = await db.getUserByEmail(userEmail);
    
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Update user with tokens from the session
    const updatedUser = await db.updateUser(dbUser.id, {
      accessToken: session.accessToken || "",
      // We don't have refresh token in the session, but at least we'll have access token
    });

    return NextResponse.json({
      success: true,
      message: "User tokens updated successfully",
      hasAccessToken: !!updatedUser?.accessToken,
      userId: dbUser.id,
    });
    
  } catch (error) {
    console.error("Error updating user tokens:", error);
    return NextResponse.json(
      { error: "Failed to update user tokens" },
      { status: 500 }
    );
  }
} 