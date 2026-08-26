import { Section } from "@/components/blocks/Section";
import type { QuoteBlock } from "@/types/blocks";

export function Quote({ title, body }: QuoteBlock) {
  return (
    <Section className="bg-foam">
      <blockquote className="mx-auto max-w-3xl">
        {title ? (
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-terracotta">
            {title}
          </p>
        ) : null}
        <p className="mt-4 font-serif text-3xl leading-snug text-ink md:text-4xl">
          {body}
        </p>
      </blockquote>
    </Section>
  );
}
