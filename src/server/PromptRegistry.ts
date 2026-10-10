import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Logger } from "../logging/Logger.js";

/**
 * MCP **prompt** şablonlarını kaydeder. İstemciler bunları komut gibi çağırır.
 */
export class PromptRegistry {
  constructor(private readonly logger: Logger) {}

  register(server: McpServer): void {
    server.registerPrompt(
      "delegate_to_opencode",
      {
        title: "Delegate To OpenCode",
        description: "Ask OpenCode to perform a coding task and report the result.",
        argsSchema: {
          task: z.string().min(1).describe("The task for OpenCode, in plain language"),
        },
      },
      (args) => ({
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Delegate the following task to OpenCode using the oc_ask tool, then summarize the outcome and any files changed.\n\nTask: ${String(args.task)}`,
            },
          },
        ],
      }),
    );

    this.logger.info("prompts registered", { count: 1, names: ["delegate_to_opencode"] });
  }
}
