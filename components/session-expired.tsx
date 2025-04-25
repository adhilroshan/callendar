'use client'

import { useRouter } from "next/navigation"

interface SessionExpiredProps {
  message?: string
  buttonText?: string
}

export function SessionExpired({
  message = "Your session has expired. Please refresh the page to reconnect your account.",
  buttonText = "Refresh Session"
}: SessionExpiredProps) {
  const router = useRouter()

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex flex-col">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-sm font-medium text-red-800">Session Expired</span>
        </div>
        <p className="text-sm text-red-700 mt-1">{message}</p>
        <button 
          onClick={() => router.refresh()} 
          className="mt-3 self-start inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
} 