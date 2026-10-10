import { describe, expect, it } from "vitest";
import { ActivitySummarizer } from "../../src/opencode/activity.js";
import type { SessionMessage } from "../../src/opencode/types.js";

describe("ActivitySummarizer", () => {
  const summarizer = new ActivitySummarizer();

  it("summarizes tool calls after the baseline timestamp", () => {
    const messages: SessionMessage[] = [
      {
        id: "a1",
        type: "assistant",
        time: { created: 200 },
        content: [
          { type: "text", text: "working" },
          { type: "tool", name: "shell", state: { status: "completed", input: { command: "git clone x y" } } },
          { type: "tool", name: "edit", state: { status: "completed", input: { filePath: "src/index.ts" } } },
        ],
      },
    ];
    const lines = summarizer.summarize(messages, 100);
    expect(lines).toEqual(["shell: git clone x y", "edit: src/index.ts"]);
  });

  it("ignores messages at or before the baseline", () => {
    const messages: SessionMessage[] = [
      { id: "a1", type: "assistant", time: { created: 100 }, content: [{ type: "tool", name: "shell" }] },
    ];
    expect(summarizer.summarize(messages, 100)).toEqual([]);
  });

  it("falls back to the tool name when no input detail exists", () => {
    const messages: SessionMessage[] = [
      { id: "a1", type: "assistant", time: { created: 200 }, content: [{ type: "tool", name: "read" }] },
    ];
    expect(summarizer.summarize(messages, 100)).toEqual(["read"]);
  });
});
