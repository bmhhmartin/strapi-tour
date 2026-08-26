import Link from "next/link";

export function SiteFooter({
  siteName,
  siteDescription,
}: {
  siteName: string;
  siteDescription: string;
}) {
  return (
    <footer className="bg-ink px-6 py-12 text-sand/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-2xl text-sand">{siteName}</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed">
            {siteDescription}
          </p>
        </div>
        <nav className="flex gap-5 text-sm">
          <Link href="/" className="hover:text-sand">
            Home
          </Link>
          <Link href="/about" className="hover:text-sand">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
