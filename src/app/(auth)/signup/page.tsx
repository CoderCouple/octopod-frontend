"use client";

import { AuthHeroCards } from "@/components/auth-hero-cards";
import { SignupForm } from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-green-100/50 to-green-200 p-6 dark:from-green-950 dark:via-green-900/50 dark:to-green-800 md:p-10">
        <div className="w-full max-w-lg">
          <SignupForm />
        </div>
      </div>
      <div className="relative hidden bg-white dark:bg-neutral-950 lg:block">
        <AuthHeroCards />
      </div>
    </div>
  );
}
