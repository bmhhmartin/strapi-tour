import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RichText } from "./RichText";

describe("RichText", () => {
  it("renders markdown headings and bold text from a string body", () => {
    render(
      <RichText
        __component="shared.rich-text"
        id={11}
        body={"## Dedit imago\n\nLorem markdownum **rerum**, est limine."}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Dedit imago" }),
    ).toBeInTheDocument();
    expect(screen.getByText("rerum")).toBeInTheDocument();
    expect(screen.getByText("rerum").tagName).toBe("STRONG");
  });
});
