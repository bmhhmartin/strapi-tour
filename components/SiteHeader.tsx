import Link from "next/link";

export function SiteHeader({ siteName }: { siteName: string }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="bg-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-sand md:text-xl"
        >
          {siteName}
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-sand/85">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-sand"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
