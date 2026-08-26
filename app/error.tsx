"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-6 py-32">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-terracotta">
        Something went wrong
      </p>
      <h1 className="mt-4 font-serif text-4xl text-ink">
        The map is temporarily blank
      </h1>
      <p className="mt-4 text-lg text-ink/70">
        We could not load this page from Strapi. Try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex w-fit rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-sand"
      >
        Try again
      </button>
    </div>
  );
}
