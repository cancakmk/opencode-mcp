import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asOptionalNumber, asOptionalString, asString } from "../../util/args.js";

/** Bir oturumun mesajlarını listeler. */
export class MessageListTool extends BaseTool {
  readonly name = "oc_message_list";
  readonly title = "List Messages";
  readonly description = "List messages of an OpenCode session, newest first by default.";
  readonly parameters = {
    sessionId: z.string().min(1).describe("Session id (ses_...)"),
    limit: z.number().int().positive().max(200).optional().describe("Maximum number of messages"),
    order: z.enum(["asc", "desc"]).optional().describe("Order by creation time"),
    type: z.string().optional().describe("Filter by message type (e.g. assistant)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const order = args.order === "asc" || args.order === "desc" ? args.order : undefined;
    const result = await this.deps.client.listMessages(asString(args.sessionId), {
      limit: asOptionalNumber(args.limit),
      order,
      type: asOptionalString(args.type),
    });
    return this.text(JSON.stringify(result.data, null, 2));
  }
}
