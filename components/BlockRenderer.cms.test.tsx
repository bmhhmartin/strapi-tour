import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlockRenderer } from "./BlockRenderer";
import type { MediaBlock, QuoteBlock, SliderBlock } from "@/types/blocks";

const media = {
  id: 1,
  documentId: "m1",
  url: "/uploads/coffee.jpeg",
  alternativeText: "Coffee art",
  width: 1200,
  height: 671,
  mime: "image/jpeg",
};

describe("BlockRenderer CMS blocks", () => {
  it("renders a quote block title and body", () => {
    const quote: QuoteBlock = {
      __component: "shared.quote",
      id: 6,
      title: "Thelonius Monk",
      body: "You've got to dig it to dig it, you dig?",
    };

    render(<BlockRenderer blocks={[quote]} />);

    expect(screen.getByText("Thelonius Monk")).toBeInTheDocument();
    expect(
      screen.getByText("You've got to dig it to dig it, you dig?"),
    ).toBeInTheDocument();
  });

  it("renders a media block image", () => {
    const block: MediaBlock = {
      __component: "shared.media",
      id: 6,
      file: media,
    };

    render(<BlockRenderer blocks={[block]} />);

    expect(screen.getByRole("img", { name: "Coffee art" })).toHaveAttribute(
      "src",
      expect.stringContaining("/uploads/coffee.jpeg"),
    );
  });

  it("renders a slider from files[]", () => {
    const block: SliderBlock = {
      __component: "shared.slider",
      id: 1,
      files: [media],
    };

    render(<BlockRenderer blocks={[block]} />);

    expect(
      screen.getByRole("img", { name: "Coffee art" }),
    ).toBeInTheDocument();
  });
});
