import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { userId, phoneNumber } = body;

    if (!userId || !phoneNumber) {
      return NextResponse.json(
        { error: "User ID and phone number are required" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await db.getUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify that the authenticated user is updating their own record
    const authUser = await db.getUserByEmail(session.user.email!);
    if (!authUser || authUser.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update phone number
    await db.updateUser(userId, { phoneNumber });

    return NextResponse.json({
      success: true,
      message: "Phone number updated successfully",
    });
  } catch (error) {
    console.error("Error updating phone number:", error);
    return NextResponse.json(
      { error: "Failed to update phone number" },
      { status: 500 }
    );
  }
} 