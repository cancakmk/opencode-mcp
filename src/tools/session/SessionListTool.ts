import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asOptionalNumber, asOptionalString } from "../../util/args.js";

/** OpenCode oturumlarını listeler. */
export class SessionListTool extends BaseTool {
  readonly name = "oc_session_list";
  readonly title = "List Sessions";
  readonly description = "List OpenCode sessions, newest first by default.";
  readonly parameters = {
    limit: z.number().int().positive().max(200).optional().describe("Maximum number of sessions"),
    order: z.enum(["asc", "desc"]).optional().describe("Order by creation time"),
    search: z.string().optional().describe("Filter by title"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const order = args.order === "asc" || args.order === "desc" ? args.order : undefined;
    const result = await this.deps.client.listSessions({
      limit: asOptionalNumber(args.limit),
      order,
      search: asOptionalString(args.search),
    });
    return this.text(JSON.stringify(result.data, null, 2));
  }
}
