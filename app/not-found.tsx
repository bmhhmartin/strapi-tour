import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-6 py-32">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-terracotta">
        404
      </p>
      <h1 className="mt-4 font-serif text-4xl text-ink">This trail ends here</h1>
      <p className="mt-4 text-lg text-ink/70">
        We could not find that page. It may have been unpublished, or the slug
        does not match a Strapi entry.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex w-fit rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-sand"
      >
        Back to home
      </Link>
    </div>
  );
}
