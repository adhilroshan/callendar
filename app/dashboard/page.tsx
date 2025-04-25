import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Header from "@/components/header";
import PhoneForm from "@/components/phone-form";
import CalendarEvents from "@/components/calendar-events";
import { db, UserData } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();

  // If user is not logged in, redirect to sign in page
  if (!session?.user) {
    redirect("/signin");
  }

  // Get or create user in our database
  let user = await db.getUserByEmail(session.user.email!);
  
  if (!user) {
    console.log("Creating new user in database for:", session.user.email);
    // Create the user with their email, name and tokens from the session
    const newUserData: UserData = {
      email: session.user.email!,
      name: session.user.name || "User",
      accessToken: session.accessToken || "",
      refreshToken: "",
    };
    
    user = await db.createUser(newUserData);
    
    // If user creation failed, handle the error
    if (!user) {
      console.error("Failed to create user in database");
      return (
        <div className="min-h-screen bg-gray-50">
          <Header session={session} />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Error</h1>
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-700">
                  There was an error setting up your account. Please try signing out and in again.
                </p>
              </div>
            </div>
          </main>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header session={session} />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Callendar Dashboard
              </span>
            </h1>
            <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">
                    Phone Call Alerts
                  </h2>
                  <p className="mt-1 text-sm text-indigo-100">
                    Set up your phone number to receive call alerts
                  </p>
                </div>
                <div className="px-6 py-6">
                  <PhoneForm userId={user.id} currentPhone={user.phoneNumber || ""} />
                </div>

                <div className="px-6 py-4 bg-indigo-50 border-t border-indigo-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-xs text-indigo-700">
                      Calls will be made 5 minutes before each event starts
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">
                    Upcoming Calendar Events
                  </h2>
                  <p className="mt-1 text-sm text-indigo-100">
                    Your upcoming events from Google Calendar
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  <CalendarEvents accessToken={session.accessToken!} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-gray-500">
            <p>&copy; 2024 Callendar. All calls are made 5 minutes before events start.</p>
          </div>
        </div>
      </main>
    </div>
  );
} 