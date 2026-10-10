import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asString } from "../../util/args.js";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

/**
 * Genel amaçlı "custom API" aracı: herhangi bir OpenCode `/api/*` uç noktasını çağırır.
 * Tam kapsama için backstop; riskli olduğundan yalnızca `full` profilde açılır.
 */
export class ApiTool extends BaseTool {
  readonly name = "oc_api";
  readonly title = "Custom API Call";
  readonly description =
    "Call any OpenCode /api/* endpoint directly (method, path, query, body). Advanced; only available in the full profile.";
  override readonly profile = "full" as const;
  readonly parameters = {
    method: z.enum(METHODS).describe("HTTP method"),
    path: z.string().min(1).describe("API path, must start with /api/ (e.g. /api/session)"),
    query: z.record(z.string(), z.string()).optional().describe("Query parameters"),
    body: z.record(z.string(), z.unknown()).optional().describe("JSON request body"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const path = asString(args.path);
    if (!path.startsWith("/api/")) {
      return this.failure("path must start with /api/");
    }
    const method = METHODS.includes(args.method as (typeof METHODS)[number])
      ? (args.method as (typeof METHODS)[number])
      : "GET";
    const query = (args.query ?? {}) as Record<string, string>;
    const body = args.body;

    const params: { query?: Record<string, string>; body?: unknown } = { query };
    if (body !== undefined) {
      params.body = body;
    }
    const data = await this.deps.client.request<unknown>(method, path, params);
    return this.text(JSON.stringify(data, null, 2));
  }
}
