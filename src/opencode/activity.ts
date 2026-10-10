import type { MessageContentPart, SessionMessage } from "./types.js";

const MAX_DETAIL = 120;
const DETAIL_KEYS = ["command", "filePath", "path", "pattern", "query", "url", "description", "name"] as const;

/**
 * Bir oturumun "ne yaptığını" (araç çağrıları) okunabilir satırlara özetler.
 * `sinceTimestamp`'ten sonraki asistan mesajlarındaki `tool` parçaları dikkate alınır.
 */
export class ActivitySummarizer {
  summarize(messages: readonly SessionMessage[], sinceTimestamp: number): string[] {
    const lines: string[] = [];
    for (const message of messages) {
      if ((message.time?.created ?? 0) <= sinceTimestamp) {
        continue;
      }
      if (message.type !== "assistant" || message.content === undefined) {
        continue;
      }
      for (const part of message.content) {
        if (part.type === "tool") {
          lines.push(this.describeTool(part));
        }
      }
    }
    return lines;
  }

  private describeTool(part: MessageContentPart): string {
    const name = part.name ?? "tool";
    const detail = this.describeInput(part.state?.input ?? {});
    return detail.length > 0 ? `${name}: ${detail}` : name;
  }

  private describeInput(input: Readonly<Record<string, unknown>>): string {
    for (const key of DETAIL_KEYS) {
      const value = input[key];
      if (typeof value === "string" && value.length > 0) {
        return this.truncate(value);
      }
    }
    const json = JSON.stringify(input);
    return json.length > 2 ? this.truncate(json) : "";
  }

  private truncate(value: string): string {
    const normalized = value.replace(/\s+/g, " ").trim();
    return normalized.length > MAX_DETAIL ? `${normalized.slice(0, MAX_DETAIL)}…` : normalized;
  }
}
