import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`px-6 py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  heading,
  intro,
  className = "",
}: {
  heading?: string | null;
  intro?: string | null;
  className?: string;
}) {
  if (!heading && !intro) return null;

  return (
    <div className={`mb-12 max-w-2xl ${className}`}>
      {heading ? (
        <h2 className="font-serif text-3xl tracking-tight text-inherit md:text-4xl">
          {heading}
        </h2>
      ) : null}
      {intro ? (
        <p className="mt-4 text-lg leading-relaxed opacity-70">{intro}</p>
      ) : null}
    </div>
  );
}
