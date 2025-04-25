import Link from "next/link";
import { auth } from "@/auth";
import Header from "@/components/header";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header session={session} />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          {/* Hero Section */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Never miss an</span>
                <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  important calendar event
                </span>
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl sm:mx-auto lg:mx-0">
                Callendar connects to your Google Calendar and calls you 5 minutes before 
                important events. Stay organized and never be late again.
              </p>
              <div className="mt-8 flex sm:justify-center lg:justify-start space-x-4">
                {session?.user ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/signin"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                )}
                <a
                  href="#how-it-works"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:flex lg:justify-end">
              <div className="relative w-full max-w-lg mx-auto lg:max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-20 blur-lg transform -rotate-3"></div>
                <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                  <div className="px-6 py-8 sm:p-10">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Meeting in 5 minutes!
                        </h3>
                        <p className="text-sm text-gray-500">
                          You have a call with the Design Team
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            Get notified on time
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            No more being late to meetings
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="mt-24">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                How Callendar Works
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                Three simple steps to never miss an important meeting again
              </p>
            </div>
            
            <div className="mt-12">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                <div className="bg-white rounded-lg shadow-md p-8 transform transition-all duration-200 hover:scale-105">
                  <div className="-mt-16 flex justify-center">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-full shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">
                    1. Sign in with Google
                  </h3>
                  <p className="mt-4 text-base text-gray-600 text-center">
                    Connect your Google account and authorize access to your calendar events.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 transform transition-all duration-200 hover:scale-105">
                  <div className="-mt-16 flex justify-center">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-full shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">
                    2. Add your phone number
                  </h3>
                  <p className="mt-4 text-base text-gray-600 text-center">
                    Enter the phone number where you want to receive call reminders.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 transform transition-all duration-200 hover:scale-105">
                  <div className="-mt-16 flex justify-center">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-full shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">
                    3. Get call reminders
                  </h3>
                  <p className="mt-4 text-base text-gray-600 text-center">
                    Receive automated calls 5 minutes before your events start.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlight */}
          <div className="mt-24">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Never miss another important event
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  With Callendar, you&apos;ll receive a personal phone call 5 minutes before each 
                  important meeting. Our system checks your calendar every 5 minutes to 
                  ensure you&apos;re always notified on time.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-600">
                      Smart timing - calls arrive exactly when you need them
                    </p>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-600">
                      Only one call per event - no annoying duplicates
                    </p>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-600">
                      Works with your existing Google Calendar - no extra setup
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-10 lg:mt-0 order-1 lg:order-2">
                <div className="relative mx-auto">
                  <svg
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 z-0 opacity-25 text-indigo-500"
                    width="784" height="404" fill="none" viewBox="0 0 784 404"
                    aria-hidden="true"
                  >
                    <defs>
                      <pattern
                        id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect width="784" height="404" fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
                  </svg>
                  <div className="relative bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-indigo-600 px-6 py-3">
                      <h3 className="text-lg font-medium text-white">Calendar</h3>
                    </div>
                    <ul className="divide-y divide-gray-200 p-6">
                      <li className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Weekly Team Meeting
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              Today at 2:00 PM · 1 hour
                            </p>
                          </div>
                        </div>
                      </li>
                      <li className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center text-purple-600">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 01-.375.65 2.249 2.249 0 000 3.898.75.75 0 01.375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 17.625v-3.026a.75.75 0 01.374-.65 2.249 2.249 0 000-3.898.75.75 0 01-.374-.65V6.375zm15-1.125a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm-.75 3a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zM6 12a.75.75 0 01.75-.75H12a.75.75 0 010 1.5H6.75A.75.75 0 016 12zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Client Presentation
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              Tomorrow at 10:30 AM · 2 hours
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; 2024 Callendar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
