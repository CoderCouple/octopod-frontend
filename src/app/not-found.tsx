import Link from "next/link";

import { ArrowLeft } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo_svg/octopus_dead_white_color.svg"
          alt="Octopod"
          className="mx-auto mb-8 h-48 w-48"
        />
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 max-w-lg text-muted-foreground">
          Don&apos;t worry, even the best data sometimes gets lost in the
          internet.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        If you believe this is an error, please contact our support team.
      </footer>
    </div>
  );
}

export default NotFoundPage;
