import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Logger } from "../logging/Logger.js";

/** stdio transport'u ile MCP sunucusunu başlatır (yerel istemciler). */
export class StdioRunner {
  constructor(private readonly logger: Logger) {}

  async run(server: McpServer): Promise<void> {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    this.logger.info("opencode-mcp listening on stdio");
  }
}
