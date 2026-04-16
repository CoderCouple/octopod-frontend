import Link from "next/link";

import Logo from "@/components/logo";

export const Footer = () => {
  const links = [
    {
      name: "Features",
      href: "/#features",
    },
    {
      name: "Pricing",
      href: "/pricing",
    },
    {
      name: "Blog",
      href: "/blog",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];
  const legal = [
    {
      name: "Privacy Policy",
      href: "#",
    },
    {
      name: "Terms of Service",
      href: "#",
    },
    {
      name: "Refund Policy",
      href: "#",
    },
  ];
  const socials = [
    {
      name: "Twitter",
      href: "#",
    },
    {
      name: "LinkedIn",
      href: "#",
    },
    {
      name: "GitHub",
      href: "#",
    },
  ];
  return (
    <div className="relative">
      <div className="relative border-t border-neutral-100 bg-white px-8 pb-32 pt-20 dark:border-neutral-800 dark:bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm text-neutral-500 dark:text-neutral-400 sm:flex-row">
          <div>
            <div className="mb-4 mr-4 md:flex">
              <Logo />
            </div>
            <div>Copyright &copy; 2025 Octopod AI</div>
            <div className="mt-2">All rights reserved</div>
          </div>
          <div className="mt-10 grid grid-cols-3 items-start gap-10 md:mt-0">
            <div className="mt-4 flex flex-col justify-center space-y-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  className="text-xs text-neutral-600 transition-colors hover:text-black dark:text-neutral-300 dark:hover:text-neutral-100 sm:text-sm"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-col justify-center space-y-4">
              {legal.map((link) => (
                <Link
                  key={link.name}
                  className="text-xs text-neutral-600 transition-colors hover:text-black dark:text-neutral-300 dark:hover:text-neutral-100 sm:text-sm"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-col justify-center space-y-4">
              {socials.map((link) => (
                <Link
                  key={link.name}
                  className="text-xs text-neutral-600 transition-colors hover:text-black dark:text-neutral-300 dark:hover:text-neutral-100 sm:text-sm"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 px-4 py-4 text-3xl font-black md:gap-4 md:text-5xl lg:gap-6 lg:text-[10rem] xl:text-[14rem] 2xl:text-[18rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo_svg/octopus_happy_light.svg"
          alt="Octopod"
          className="h-8 w-8 dark:hidden md:h-14 md:w-14 lg:h-40 lg:w-40 xl:h-52 xl:w-52 2xl:h-64 2xl:w-64"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo_svg/octopus_happy_dark.svg"
          alt="Octopod"
          className="hidden h-8 w-8 dark:block md:h-14 md:w-14 lg:h-40 lg:w-40 xl:h-52 xl:w-52 2xl:h-64 2xl:w-64"
        />
        <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          Octo
        </span>
        <span className="-ml-2 text-neutral-200 dark:text-neutral-700 md:-ml-4 lg:-ml-6">
          pod
        </span>
        <span className="-ml-2 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent md:-ml-4 lg:-ml-6">
          AI
        </span>
      </div>
    </div>
  );
};
