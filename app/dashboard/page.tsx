import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Header from "@/components/header";
import PhoneForm from "@/components/phone-form";
import CalendarEvents from "@/components/calendar-events";
import { db, UserData } from "@/lib/db";
import { TestCallSection } from "@/components/test-call-section";
import { RefreshButton } from "@/components/refresh-button";

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
          <Header />
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

  const userName = user.name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{userName}</span>
                  </h1>
                  <p className="mt-2 text-gray-500">Manage your call notifications and upcoming events</p>
                </div>
                <div className="flex items-center space-x-2 bg-indigo-50 rounded-lg px-4 py-2 text-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
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
              
              {/* Test Call Section */}
              <TestCallSection />
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-md h-full">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upcoming Calendar Events
                    </h2>
                    <p className="mt-1 text-sm text-indigo-100">
                      Your upcoming events within the next 7 days
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <RefreshButton />
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  <CalendarEvents accessToken={session.accessToken!} />
                </div>
                <div className="p-4 border-t border-gray-200 md:hidden">
                  <RefreshButton />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="text-sm text-gray-500">
                  &copy; 2024 Callendar. Never miss an important event with our automated call reminders.
                </p>
              </div>
              <div>
                <a href="/dashboard" className="inline-flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-700">
                  Reload Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 