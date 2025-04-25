'use client'

import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

interface ConnectionErrorProps {
  title?: string
  description?: string
  retryAction?: () => void
}

export function ConnectionError({
  title = "Connection Error",
  description = "We couldn't connect to our services. This could be due to a network issue or a server problem.",
  retryAction
}: ConnectionErrorProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <CardTitle className="text-center">{title}</CardTitle>
        <CardDescription className="text-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-amber-50 p-4 rounded-md">
          <p className="text-sm text-amber-700">
            If this problem persists, please contact support or try again later.
          </p>
        </div>
      </CardContent>
      {retryAction && (
        <CardFooter className="flex justify-center">
          <Button 
            variant="default" 
            onClick={retryAction}
            className="w-full"
          >
            Retry Connection
          </Button>
        </CardFooter>
      )}
    </Card>
  )
} 