export function AuthHeroCards() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="mb-6 max-w-md text-center">
        <h2 className="whitespace-nowrap text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          How Octopod AI builds a profile
        </h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Data from GitHub, LinkedIn, and Hugging Face flows through our AI
          engine to create scored, unified candidate profiles.
        </p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/auth-hero.png"
        alt="Octopod AI — unified developer profiles"
        className="max-h-[70vh] w-full object-contain dark:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/auth-hero-dark.png"
        alt="Octopod AI — unified developer profiles"
        className="hidden max-h-[70vh] w-full object-contain dark:block"
      />
    </div>
  );
}
