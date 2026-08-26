import type { ReactNode } from "react";
import { Section } from "@/components/blocks/Section";
import type { StrapiBlockNode } from "@/types/strapi";
import type { RichTextBlock } from "@/types/blocks";

function renderNodes(nodes: StrapiBlockNode[], keyPrefix = ""): ReactNode {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}${index}`;
    if (node.text !== undefined) {
      return <span key={key}>{node.text}</span>;
    }

    const children = node.children ? renderNodes(node.children, `${key}-`) : null;

    switch (node.type) {
      case "heading":
        return (
          <h2 key={key} className="font-serif text-3xl text-ink">
            {children}
          </h2>
        );
      case "paragraph":
        return (
          <p key={key} className="leading-relaxed text-ink/80">
            {children}
          </p>
        );
      case "list":
        return (
          <ul key={key} className="list-disc space-y-2 pl-5">
            {children}
          </ul>
        );
      case "list-item":
        return <li key={key}>{children}</li>;
      default:
        return <div key={key}>{children}</div>;
    }
  });
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    if (bold) {
      return <strong key={index}>{bold[1]}</strong>;
    }
    return part;
  });
}

function MarkdownBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n{2,}/);

  return blocks.map((block, index) => {
    const heading = /^(#{1,3})\s+(.+)/.exec(block);
    if (heading) {
      const level = heading[1].length;
      const Tag = `h${level}` as "h1" | "h2" | "h3";
      return (
        <Tag key={index} className="font-serif text-3xl text-ink">
          {renderInline(heading[2])}
        </Tag>
      );
    }

    return (
      <p key={index} className="leading-relaxed text-ink/80">
        {renderInline(block.replace(/\n/g, " "))}
      </p>
    );
  });
}

function looksLikeHtml(value: string) {
  return /^\s*</.test(value);
}

export function RichText({ body }: RichTextBlock) {
  return (
    <Section className="bg-sand">
      <div className="prose-travel mx-auto max-w-3xl space-y-5">
        {typeof body === "string" ? (
          looksLikeHtml(body) ? (
            <div dangerouslySetInnerHTML={{ __html: body }} />
          ) : (
            <MarkdownBody body={body} />
          )
        ) : (
          renderNodes(body)
        )}
      </div>
    </Section>
  );
}
