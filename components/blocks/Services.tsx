import type { ReactNode } from "react";
import { Section, SectionHeading } from "@/components/blocks/Section";
import type { ServicesBlock } from "@/types/blocks";

const icons: Record<string, ReactNode> = {
  compass: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14.5 9.5 10 14.5 9.5 10.5 14.5 9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-5v-5H10v5H5a1 1 0 0 1-1-1v-7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="m8 6-4 2v12l4-2 8 2 4-2V4l-4 2-8-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 6v12M16 8v12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

function ServiceIcon({ name }: { name?: string | null }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-foam text-ocean">
      {icons[name ?? ""] ?? icons.compass}
    </span>
  );
}

export function Services({ heading, intro, items }: ServicesBlock) {
  return (
    <Section className="bg-sand">
      <SectionHeading heading={heading} intro={intro} />
      <ul className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border border-ink/10 bg-white/70 p-8 shadow-[0_20px_50px_-32px_rgba(20,34,28,0.45)]"
          >
            <ServiceIcon name={item.icon} />
            <h3 className="mt-6 font-serif text-2xl text-ink">{item.title}</h3>
            <p className="mt-3 leading-relaxed text-ink/70">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
