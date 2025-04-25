'use client';

import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export function AuthTest() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  
  const handleSignOut = async () => {
    try {
      setError(null);
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during sign out');
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Auth Status</h2>
      <p>Status: <span className="font-medium">{status}</span></p>
      {session && (
        <div className="mt-2">
          <p>Signed in as: {session.user?.email}</p>
          <button
            onClick={handleSignOut}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
          >
            Test Sign Out
          </button>
        </div>
      )}
      {error && (
        <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 