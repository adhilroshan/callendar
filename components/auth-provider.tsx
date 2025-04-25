"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ 
  children,
  refetchInterval,
}: { 
  children: React.ReactNode;
  refetchInterval?: number;
}) {
  return (
    <SessionProvider 
      // Refresh the session every 5 minutes to keep it active
      refetchInterval={refetchInterval || 5 * 60} 
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
} 