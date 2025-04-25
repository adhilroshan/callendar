"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionExpired } from "./session-expired";
import { isSessionExpiredError, getSessionExpiredMessage } from "@/lib/session-utils";
import { ErrorBoundary, DefaultErrorFallback } from "./error-boundary";

interface PhoneFormProps {
  userId: string;
  currentPhone?: string;
}

export default function PhoneForm({ userId, currentPhone }: PhoneFormProps) {
  return (
    <ErrorBoundary fallback={(error, reset) => <DefaultErrorFallback error={error} reset={reset} />}>
      <PhoneFormContent userId={userId} currentPhone={currentPhone} />
    </ErrorBoundary>
  );
}

function PhoneFormContent({ userId, currentPhone }: PhoneFormProps) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState(currentPhone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setDebug("");
    setSuccess("");

    try {
      // Add debug info
      setDebug(`Attempting to update phone for user ID: ${userId}`);
      
      // Basic validation
      if (!phoneNumber || phoneNumber.trim() === "") {
        throw new Error("Phone number is required");
      }

      // Simple regex for phone number validation
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error(
          "Please enter a valid phone number with country code (e.g., +12345678901)"
        );
      }

      // Save the phone number
      const response = await fetch("/api/update-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          phoneNumber,
        }),
      });

      // Get the response data
      const data = await response.json();
      
      // Add response status to debug
      setDebug(prev => `${prev}\nResponse status: ${response.status}`);

      if (!response.ok) {
        // Special handling for session expiration
        if (isSessionExpiredError(response.status, data.error || "")) {
          throw new Error(getSessionExpiredMessage());
        }
        throw new Error(data.error || "Failed to update phone number");
      }

      setSuccess("Phone number updated successfully!");
      router.refresh(); // Refresh the page to show updated data
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error updating phone number:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <div className="mt-1">
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="block w-full rounded-md text-black px-2 py-1 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Enter your phone number with country code (e.g., +12345678901)
        </p>
      </div>

      {error && !error.includes("session has expired") && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      {error && error.includes("session has expired") && (
        <SessionExpired />
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        </div>
      )}

      {process.env.NODE_ENV === "development" && debug && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="text-xs font-mono text-blue-700 whitespace-pre-line">{debug}</div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Phone Number"}
        </button>
      </div>
    </form>
  );
} 