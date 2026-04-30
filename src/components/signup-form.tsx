"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await signUp(email, password);
      router.push("/dashboard");
    } catch {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn("flex flex-col items-center gap-6", className)}
      {...props}
    >
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo_svg/octopus_happy_light.svg"
                    alt="Octopod AI"
                    className="size-8"
                  />
                  <span className="text-xl font-bold tracking-tight">
                    <span className="text-green-600 dark:text-green-500">
                      Octo
                    </span>
                    pod{" "}
                    <span className="text-green-600 dark:text-green-500">
                      AI
                    </span>
                  </span>
                </div>
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-balance text-muted-foreground">
                  Get Started with Octopod AI
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 size-4"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  disabled={isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 23 23"
                    className="mr-2 size-4"
                  >
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  Microsoft
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 dark:bg-green-900/30">
          <Lock className="size-3.5 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-400">
            Secured by 256-bit AES and 256-bit SSL/TLS encryption
          </span>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          By signing up, I agree to Octopod&apos;s{" "}
          <Link
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>
          ,{" "}
          <Link
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          , and{" "}
          <Link
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Data Processing Agreement
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
