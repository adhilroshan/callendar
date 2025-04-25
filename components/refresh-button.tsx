'use client';

import { useState } from 'react';
import { useCalendarContext } from './calendar-context';

export function RefreshButton() {
  const { refreshCalendar } = useCalendarContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshCalendar();
    
    // Visual feedback for the refresh action
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <button 
      onClick={handleRefresh}
      className={`inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background bg-indigo-600 text-white hover:bg-indigo-700 h-9 rounded-md px-4 ${isRefreshing ? 'opacity-80' : ''}`}
      disabled={isRefreshing}
    >
      {isRefreshing ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Refreshing...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Calendar
        </>
      )}
    </button>
  );
} 