import { describe, expect, it } from "vitest";
import { extractAssistantText } from "../../src/opencode/message.js";

describe("extractAssistantText", () => {
  it("joins text parts and trims", () => {
    const text = extractAssistantText({
      id: "m",
      type: "assistant",
      content: [
        { type: "reasoning", text: "thinking" },
        { type: "text", text: "Hello" },
        { type: "text", text: "world" },
      ],
    });
    expect(text).toBe("Hello\nworld");
  });

  it("returns empty string for undefined or missing content", () => {
    expect(extractAssistantText(undefined)).toBe("");
    expect(extractAssistantText({ id: "m", type: "idle" })).toBe("");
  });
});
