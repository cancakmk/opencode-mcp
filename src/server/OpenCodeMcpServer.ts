import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { APP_NAME, APP_VERSION } from "../version.js";
import type { Config } from "../config/Config.js";
import type { OpenCodeClient } from "../opencode/OpenCodeClient.js";
import type { Logger } from "../logging/Logger.js";
import { ToolRegistry } from "../tools/ToolRegistry.js";
import { SessionWaiter } from "../opencode/SessionWaiter.js";
import { ResourceRegistry } from "./ResourceRegistry.js";
import type { BaseTool } from "../tools/BaseTool.js";

/**
 * MCP sunucusunu kurar; profile uygun araçları ve kaynakları kaydeder.
 * Araç yürütme hataları, protokolü bozmadan metin sonucuna dönüştürülür;
 * her çağrı süresiyle birlikte loglanır.
 */
export class OpenCodeMcpServer {
  private readonly registry: ToolRegistry;

  constructor(
    private readonly config: Config,
    private readonly client: OpenCodeClient,
    private readonly logger: Logger,
  ) {
    this.registry = new ToolRegistry(
      { client, waiter: new SessionWaiter(client, logger), logger },
      config.toolProfile,
    );
  }

  build(): McpServer {
    const server = new McpServer({ name: APP_NAME, version: APP_VERSION });
    const tools = this.registry.list();
    for (const tool of tools) {
      this.registerTool(server, tool);
    }
    new ResourceRegistry(this.client, this.logger).register(server);
    this.logger.info("tools registered", {
      count: tools.length,
      profile: this.config.toolProfile,
      names: tools.map((tool) => tool.name),
    });
    return server;
  }

  private registerTool(server: McpServer, tool: BaseTool): void {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.parameters,
      },
      async (args) => {
        const startedAt = Date.now();
        try {
          const result = await tool.execute((args ?? {}) as Record<string, unknown>);
          this.logger.info("tool ok", { tool: tool.name, durationMs: Date.now() - startedAt });
          const content = result.content.map((part) => ({ type: "text" as const, text: part.text }));
          return result.isError === true ? { content, isError: true } : { content };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          this.logger.error("tool failed", { tool: tool.name, durationMs: Date.now() - startedAt, error: message });
          return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
        }
      },
    );
  }
}
