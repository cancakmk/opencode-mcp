import type { Logger } from "../logging/Logger.js";
import type { OpenCodeClient } from "./OpenCodeClient.js";
import { extractAssistantText } from "./message.js";
import { ActivitySummarizer } from "./activity.js";
import { sleep } from "../util/sleep.js";

export type SettleOutcome = "succeeded" | "failed" | "timeout";

export interface SettleResult {
  readonly outcome: SettleOutcome;
  /** En güncel asistan metni (varsa). */
  readonly text: string;
  /** Yapılan işin özeti (araç çağrıları). */
  readonly activity: readonly string[];
}

/**
 * Bir oturumun "durulmasını" (idle) bekler.
 * Verilen zaman damgasından sonra gelen `idle` mesajına göre başarı/başarısızlık belirler.
 */
export class SessionWaiter {
  constructor(
    private readonly client: OpenCodeClient,
    private readonly logger: Logger,
    private readonly pollIntervalMs: number = 1500,
    private readonly summarizer: ActivitySummarizer = new ActivitySummarizer(),
  ) {}

  async waitForSettled(sessionId: string, sinceTimestamp: number, timeoutMs: number): Promise<SettleResult> {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const { data } = await this.client.listMessages(sessionId, { order: "desc", limit: 50 });
      const idle = data.find((message) => message.type === "idle" && (message.time?.created ?? 0) > sinceTimestamp);
      if (idle !== undefined) {
        const assistant = data.find(
          (message) => message.type === "assistant" && (message.time?.created ?? 0) > sinceTimestamp,
        );
        return {
          outcome: idle.outcome === "failed" ? "failed" : "succeeded",
          text: extractAssistantText(assistant),
          activity: this.summarizer.summarize(data, sinceTimestamp),
        };
      }
      if (Date.now() >= deadline) {
        this.logger.warn("wait timed out", { sessionId, timeoutMs });
        return { outcome: "timeout", text: "", activity: this.summarizer.summarize(data, sinceTimestamp) };
      }
      await sleep(this.pollIntervalMs);
    }
  }
}
