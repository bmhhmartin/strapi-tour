import { Section, SectionHeading } from "@/components/blocks/Section";
import type { TestimonialsBlock } from "@/types/blocks";

export function Testimonials({ heading, quotes }: TestimonialsBlock) {
  return (
    <Section className="bg-ink text-sand">
      <SectionHeading heading={heading} />
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quotes.map((quote) => (
          <li
            key={quote.id}
            className="rounded-2xl border border-sand/10 bg-sand/5 p-8"
          >
            <p className="font-serif text-2xl leading-snug text-sand">
              “{quote.body}”
            </p>
            {quote.attribution ? (
              <p className="mt-6 text-sm font-medium text-sand/80">
                {quote.attribution}
                {quote.role ? (
                  <span className="block font-normal text-sand/55">
                    {quote.role}
                  </span>
                ) : null}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
