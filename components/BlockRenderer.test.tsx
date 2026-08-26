import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlockRenderer } from "./BlockRenderer";

describe("BlockRenderer", () => {
  it("renders UnknownBlock for an unhandled __component", () => {
    const unknown = {
      __component: "shared.does-not-exist",
      id: 99,
    };

    render(<BlockRenderer blocks={[unknown as never]} />);

    expect(screen.getByTestId("unknown-block")).toHaveAttribute(
      "data-component",
      "shared.does-not-exist",
    );
  });
});
