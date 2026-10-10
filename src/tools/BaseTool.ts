import { z } from "zod";
import type { OpenCodeClient } from "../opencode/OpenCodeClient.js";
import type { SessionWaiter } from "../opencode/SessionWaiter.js";
import type { Logger } from "../logging/Logger.js";
import type { ToolProfile } from "../config/Config.js";

/** MCP araç sonucu içindeki metin parçası. */
export interface ToolTextContent {
  readonly type: "text";
  readonly text: string;
}

/** MCP `tools/call` sonucu. */
export interface ToolResult {
  readonly content: readonly ToolTextContent[];
  readonly isError?: boolean;
}

/** Araçların paylaştığı bağımlılıklar (bağımlılık enjeksiyonu). */
export interface ToolDependencies {
  readonly client: OpenCodeClient;
  readonly waiter: SessionWaiter;
  readonly logger: Logger;
}

/**
 * Tüm MCP araçlarının ortak davranışını tanımlayan soyut temel sınıf.
 * Alt sınıflar yalnızca kimliği (ad/açıklama/şema) ve `execute` mantığını verir.
 */
export abstract class BaseTool {
  abstract readonly name: string;
  abstract readonly title: string;
  abstract readonly description: string;
  /** Zod ham şeması (MCP `inputSchema`). */
  abstract readonly parameters: z.ZodRawShape;
  /** Bu aracın hangi profilde açığa çıkacağı. Varsayılan: essential. */
  readonly profile: ToolProfile = "essential";

  constructor(protected readonly deps: ToolDependencies) {}

  abstract execute(args: Record<string, unknown>): Promise<ToolResult>;

  protected text(value: unknown): ToolResult {
    const body =
      typeof value === "string"
        ? value
        : value === undefined
          ? "ok"
          : (JSON.stringify(value, null, 2) ?? "ok");
    return { content: [{ type: "text", text: body }] };
  }

  protected failure(value: string): ToolResult {
    return { content: [{ type: "text", text: value }], isError: true };
  }
}
