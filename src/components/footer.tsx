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
            <div>Copyright &copy; 2025 Octopod</div>
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
      <p className="inset-x-0 whitespace-nowrap bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text px-4 text-center text-3xl font-bold text-transparent dark:from-neutral-100 dark:to-neutral-400 md:text-5xl lg:text-[18rem]">
        OCTOPOD
      </p>
    </div>
  );
};
