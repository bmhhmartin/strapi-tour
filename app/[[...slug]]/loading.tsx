export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="h-3 w-24 animate-pulse rounded bg-ink/10" />
      <div className="mt-6 h-12 w-2/3 animate-pulse rounded bg-ink/10" />
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-3xl bg-ink/10"
          />
        ))}
      </div>
    </div>
  );
}
