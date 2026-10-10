import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { OpenCodeClient } from "../opencode/OpenCodeClient.js";
import type { Logger } from "../logging/Logger.js";

interface ResourceContents {
  readonly uri: string;
  readonly mimeType: string;
  readonly text: string;
}

/**
 * Salt-okunur verileri (sağlık, sağlayıcılar, ajanlar, oturum transcript/diff)
 * MCP **kaynakları** olarak sunar; böylece araç listesini şişirmezler.
 */
export class ResourceRegistry {
  constructor(
    private readonly client: OpenCodeClient,
    private readonly logger: Logger,
  ) {}

  register(server: McpServer): void {
    const json = (uri: string, value: unknown): { contents: ResourceContents[] } => ({
      contents: [{ uri, mimeType: "application/json", text: JSON.stringify(value, null, 2) }],
    });

    server.registerResource(
      "opencode-health",
      "oc://health",
      { title: "OpenCode Health", description: "Server health and version", mimeType: "application/json" },
      async (uri): Promise<{ contents: ResourceContents[] }> => json(uri.href, await this.client.info()),
    );

    server.registerResource(
      "opencode-providers",
      "oc://providers",
      { title: "OpenCode Providers", description: "Configured providers", mimeType: "application/json" },
      async (uri): Promise<{ contents: ResourceContents[] }> => json(uri.href, await this.client.listProviders()),
    );

    server.registerResource(
      "opencode-agents",
      "oc://agents",
      { title: "OpenCode Agents", description: "Available agents", mimeType: "application/json" },
      async (uri): Promise<{ contents: ResourceContents[] }> => json(uri.href, await this.client.listAgents()),
    );

    const transcriptTemplate = new ResourceTemplate("oc://session/{sessionId}/transcript", { list: undefined });
    server.registerResource(
      "opencode-transcript",
      transcriptTemplate,
      { title: "Session Transcript", description: "Full transcript of an OpenCode session", mimeType: "application/json" },
      async (uri, variables): Promise<{ contents: ResourceContents[] }> => {
        const sessionId = firstValue(variables.sessionId);
        const messages = await this.client.listMessages(sessionId, { order: "asc", limit: 200 });
        return json(uri.href, messages.data);
      },
    );

    const diffTemplate = new ResourceTemplate("oc://session/{sessionId}/diff", { list: undefined });
    server.registerResource(
      "opencode-session-diff",
      diffTemplate,
      { title: "Session Diff", description: "Diff of an OpenCode session", mimeType: "application/json" },
      async (uri, variables): Promise<{ contents: ResourceContents[] }> => {
        const sessionId = firstValue(variables.sessionId);
        return json(uri.href, await this.client.sessionDiff(sessionId));
      },
    );

    this.logger.info("resources registered", {
      count: 5,
      uris: ["oc://health", "oc://providers", "oc://agents", "oc://session/{id}/transcript", "oc://session/{id}/diff"],
    });
  }
}

function firstValue(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw ?? "";
}
