'use client'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
        <h2 className="text-xl font-medium text-slate-700">Loading...</h2>
        <p className="text-sm text-slate-500">Please wait while we prepare your content</p>
      </div>
    </div>
  )
} 