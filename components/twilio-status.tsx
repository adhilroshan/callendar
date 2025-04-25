'use client';

import { useState, useEffect } from 'react';

type TwilioStatusData = {
  accountSid: boolean;
  authToken: boolean;
  phoneNumber: boolean;
  isFullyConfigured: boolean;
  clientValid?: boolean;
  errorMessage?: string | null;
};

export function TwilioStatus() {
  const [status, setStatus] = useState<TwilioStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkTwilioStatus() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/twilio-status');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setStatus(data.twilioStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred checking Twilio status');
        console.error('Error checking Twilio status:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkTwilioStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-md">
        <div className="flex items-center">
          <svg className="animate-spin h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-gray-600">Checking Twilio configuration...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <p className="text-sm font-medium text-red-700">Failed to check Twilio status</p>
        <p className="text-sm text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <p className="text-sm font-medium text-red-700">No status information available</p>
      </div>
    );
  }

  const getStatusBadge = (isConfigured: boolean) => {
    if (isConfigured) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          Configured
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" />
        </svg>
        Missing
      </span>
    );
  };

  return (
    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Twilio Configuration Status</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Account SID:</span>
          {getStatusBadge(status.accountSid)}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Auth Token:</span>
          {getStatusBadge(status.authToken)}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Phone Number:</span>
          {getStatusBadge(status.phoneNumber)}
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-700">Overall Status:</span>
            {status.isFullyConfigured ? (
              status.clientValid ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ready
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Invalid Credentials
                </span>
              )
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Incomplete
              </span>
            )}
          </div>
        </div>
      </div>
      
      {status.errorMessage && (
        <div className="mt-3 p-2 bg-red-50 rounded-md">
          <p className="text-xs text-red-700">{status.errorMessage}</p>
        </div>
      )}
      
      {!status.isFullyConfigured && (
        <div className="mt-3 p-2 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-700">
            Configure your Twilio credentials in the .env.local file to enable call functionality.
          </p>
        </div>
      )}
    </div>
  );
} 