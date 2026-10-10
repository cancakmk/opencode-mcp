import { z } from "zod";
import { BaseTool, type ToolResult } from "../BaseTool.js";
import { asString } from "../../util/args.js";

/** Çalışan bir oturumun yürütmesini durdurur. */
export class InterruptTool extends BaseTool {
  readonly name = "oc_interrupt";
  readonly title = "Interrupt Session";
  readonly description = "Interrupt a running OpenCode session.";
  readonly parameters = {
    sessionId: z.string().min(1).describe("Session id (ses_...)"),
  };

  override async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const sessionId = asString(args.sessionId);
    await this.deps.client.interruptSession(sessionId);
    return this.text(`Interrupted session ${sessionId}.`);
  }
}
