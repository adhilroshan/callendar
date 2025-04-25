'use client';

import { CalendarProvider } from "@/components/calendar-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CalendarProvider>
      {children}
    </CalendarProvider>
  );
} 