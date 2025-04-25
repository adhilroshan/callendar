"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Server action to sign out (will be imported but not executed on the client)
import { signOut } from "@/auth";

// Define proper Session type
type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type Session = {
  user?: SessionUser | null;
};

function SignOutButton() {
  return (
    <form
      action={async () => {
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white rounded-md hover:bg-indigo-50 transition-colors duration-200"
      >
        Sign out
      </button>
    </form>
  );
}

export default function Header({ session }: { session: Session | null }) {
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect - client-side only
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
              <div className="relative w-8 h-8 text-indigo-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Callendar
              </span>
            </Link>
          </div>

          {session?.user ? (
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user.image ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-100">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-700 font-medium text-sm">
                        {session.user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
                    {session.user.name}
                  </span>
                </div>
                <SignOutButton />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm transition-colors duration-200"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 