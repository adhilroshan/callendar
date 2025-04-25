"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

export default function CalendarEvents({ accessToken }: { accessToken: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check for refresh token errors from the session
    if (session?.error === "RefreshAccessTokenError") {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }

    const fetchCalendarEvents = async () => {
      try {
        if (!accessToken) {
          setError("No access token available. Please sign in again.");
          setLoading(false);
          router.push("/");
          return;
        }

        // Get current time and 24 hours from now
        const now = new Date();
        const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // Create the API endpoint URL with query parameters
        const apiUrl = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
        apiUrl.searchParams.append("timeMin", now.toISOString());
        apiUrl.searchParams.append("timeMax", oneDayFromNow.toISOString());
        apiUrl.searchParams.append("singleEvents", "true");
        apiUrl.searchParams.append("orderBy", "startTime");

        // Fetch calendar events
        const response = await fetch(apiUrl.toString(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401) {
          // Token expired - need to reauthenticate
          setError("Your session has expired. Please sign in again.");
          setTimeout(() => {
            signIn("google");
          }, 3000);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error?.message || "Failed to fetch calendar events"
          );
        }

        const data = await response.json();
        setEvents(data.items || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error fetching calendar events:", err);
        setError(err.message || "Failed to fetch calendar events");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEvents();
  }, [accessToken, session, router]);

  // Format date and time
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleSignInAgain = () => {
    signIn("google");
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-indigo-500 border-r-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="text-sm text-red-700">{error}</div>
          </div>
          {error.includes("session has expired") && (
            <div className="mt-3">
              <button
                onClick={handleSignInAgain}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-gray-500">No upcoming events in the next 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {events.map((event) => (
          <li key={event.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {event.summary || "Untitled Event"}
                </h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <svg
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>
                    {event.start?.dateTime && formatDateTime(event.start.dateTime)}
                    {" - "}
                    {event.end?.dateTime && formatDateTime(event.end.dateTime)}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 