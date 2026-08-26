import { describe, expect, it } from "vitest";
import { slugFromParams } from "./slug";

describe("slugFromParams", () => {
  it("maps a missing catch-all to home", () => {
    expect(slugFromParams(undefined)).toBe("home");
  });

  it("maps an empty array to home", () => {
    expect(slugFromParams([])).toBe("home");
  });

  it("joins nested segments with slashes", () => {
    expect(slugFromParams(["destinations", "bali"])).toBe("destinations/bali");
  });
});
