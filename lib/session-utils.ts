/**
 * Utility functions for handling session-related operations
 */

import { Session } from "next-auth";
import { redirect } from "next/navigation";

/**
 * Checks if the session exists and is valid
 * @param session The Next.js Auth session object
 * @returns True if the session exists and contains a user
 */
export function isSessionValid(session: Session | null): boolean {
  return !!session?.user;
}

/**
 * Redirects to sign-in page if the session is invalid
 * @param session The Next.js Auth session object
 * @param redirectPath Optional custom redirect path. Defaults to "/sign-in"
 */
export function requireSession(session: Session | null, redirectPath: string = "/sign-in"): void {
  if (!isSessionValid(session)) {
    redirect(redirectPath);
  }
}

/**
 * Check if a 404 error is due to an expired session
 * @param status HTTP status code 
 * @param errorMessage Error message from the API
 * @returns True if the error is related to an expired session
 */
export function isSessionExpiredError(status: number, errorMessage: string): boolean {
  return (
    status === 404 && 
    (errorMessage.includes("User not found") || errorMessage.includes("session has expired"))
  );
}

/**
 * Get a user-friendly message for session expiration
 * @returns Standard session expiration message
 */
export function getSessionExpiredMessage(): string {
  return "Your session has expired. Please refresh the page to reconnect your account.";
} 