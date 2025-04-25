import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignInForm from "@/components/signin-form";

export default async function SignInPage() {
  const session = await auth();

  // If the user is already logged in, redirect them to the dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Get phone call reminders for your Google Calendar events
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
} 