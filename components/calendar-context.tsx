'use client';

import React, { createContext, useContext, useState } from 'react';

interface CalendarContextType {
  refreshCalendar: () => void;
  refreshTrigger: number;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshCalendar = () => {
    // Increment the counter to trigger a refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <CalendarContext.Provider value={{ refreshCalendar, refreshTrigger }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
} 