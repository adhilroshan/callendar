'use client';

import { useState } from 'react';

export function TestCallButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    details?: string;
  } | null>(null);
  
  const makeTestCall = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      
      const response = await fetch('/api/test-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello, this is your Callendar reminder service. This is a test call confirming your reminders are working correctly. You will receive similar calls before your scheduled events.',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setResult({
          success: false,
          error: data.error || 'An error occurred',
          details: data.details || response.statusText,
        });
      } else {
        setResult({
          success: true,
          message: data.message || 'Test call initiated successfully',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to send test call request',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mt-4 space-y-4">
      <button
        onClick={makeTestCall}
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Initiating call...
          </>
        ) : (
          'Test Phone Call'
        )}
      </button>
      
      {result && (
        <div className={`p-4 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
          {result.success ? (
            <p className="text-green-700 text-sm">{result.message}</p>
          ) : (
            <div className="text-sm text-red-700">
              <p className="font-medium">{result.error}</p>
              {result.details && <p className="mt-1 text-xs">{result.details}</p>}
            </div>
          )}
        </div>
      )}
      
      <div className="bg-amber-50 p-3 rounded-md text-xs text-amber-700">
        <p className="font-medium">Testing Notes:</p>
        <ul className="mt-1 list-disc list-inside space-y-1">
          <li>Make sure your phone number is correctly set up in your profile</li>
          <li>This will make a real call to your phone number</li>
          <li>Standard Twilio charges may apply to your account</li>
          <li>For production testing, consider creating a calendar event instead</li>
        </ul>
      </div>
    </div>
  );
} 