import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asString } from "../../util/args.js";

/** Tek bir mesajı döndürür. */
export class MessageGetTool extends BaseTool {
  readonly name = "oc_message_get";
  readonly title = "Get Message";
  readonly description = "Get a single message by id.";
  readonly parameters = {
    sessionId: z.string().min(1).describe("Session id (ses_...)"),
    messageId: z.string().min(1).describe("Message id (msg_...)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const message = await this.deps.client.getMessage(asString(args.sessionId), asString(args.messageId));
    return this.text(JSON.stringify(message.data, null, 2));
  }
}
