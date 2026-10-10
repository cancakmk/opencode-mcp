import type { SessionMessage } from "./types.js";

/** Asistan mesajındaki metin parçalarını birleştirir. */
export function extractAssistantText(message: SessionMessage | undefined): string {
  if (message?.content === undefined) {
    return "";
  }
  return message.content
    .filter((part) => part.type === "text" && typeof part.text === "string")
    .map((part) => part.text ?? "")
    .join("\n")
    .trim();
}
