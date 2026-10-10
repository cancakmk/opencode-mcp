import { describe, expect, it } from "vitest";
import { normalizeSessionId } from "../../src/util/session.js";

describe("normalizeSessionId", () => {
  it("keeps valid ids unchanged", () => {
    expect(normalizeSessionId("ses_abc123")).toBe("ses_abc123");
  });

  it("prefixes and sanitizes free-form ids", () => {
    expect(normalizeSessionId("A4C2EC02-be06-4107")).toBe("ses_a4c2ec02be064107");
  });

  it("falls back to a default for empty input", () => {
    expect(normalizeSessionId("---")).toBe("ses_default");
  });
});
