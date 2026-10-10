import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Logger } from "../logging/Logger.js";
import type { HttpServerConfig } from "../config/Config.js";
import { BearerAuth } from "./BearerAuth.js";

/** Yeni bir MCP oturumu (her oturum kendi sunucu+transport örneğini alır). */
export type ServerFactory = () => McpServer;

const SESSION_HEADER = "mcp-session-id";

/**
 * Streamable HTTP transport'u ile MCP sunucusunu sunar (n8n ve uzak istemciler).
 * Durum bilgili (stateful) çalışır: oturumlar `Mcp-Session-Id` başlığıyla yönetilir.
 */
export class HttpRunner {
  private readonly auth: BearerAuth;
  private readonly sessions = new Map<string, StreamableHTTPServerTransport>();

  constructor(
    private readonly config: HttpServerConfig,
    private readonly logger: Logger,
  ) {
    this.auth = new BearerAuth(config.authToken);
  }

  async run(factory: ServerFactory): Promise<void> {
    if (!this.auth.isConfigured()) {
      throw new Error("MCP_AUTH_TOKEN is required when the http transport is enabled");
    }
    const server = createServer((req, res) => {
      void this.handle(req, res, factory);
    });
    await new Promise<void>((resolve) => {
      server.listen(this.config.port, this.config.host, resolve);
    });
    this.logger.info("opencode-mcp listening on http", {
      host: this.config.host,
      port: this.config.port,
      path: "/mcp",
    });
  }

  private async handle(req: IncomingMessage, res: ServerResponse, factory: ServerFactory): Promise<void> {
    const path = (req.url ?? "/").split("?")[0];
    if (path !== "/mcp") {
      res.writeHead(404, { "content-type": "application/json" }).end(JSON.stringify({ error: "not_found" }));
      return;
    }
    if (!this.auth.isAuthorized(req.headers["authorization"])) {
      this.logger.warn("rejected unauthorized request", { method: req.method });
      res.writeHead(401, { "content-type": "application/json" }).end(JSON.stringify({ error: "unauthorized" }));
      return;
    }

    try {
      const sessionId = this.readSessionId(req);
      let transport = sessionId !== undefined ? this.sessions.get(sessionId) : undefined;

      if (transport === undefined) {
        if (req.method !== "POST") {
          res.writeHead(400, { "content-type": "application/json" }).end(JSON.stringify({ error: "missing_session" }));
          return;
        }
        const created = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          enableJsonResponse: true,
          onsessioninitialized: (sid: string): void => {
            this.sessions.set(sid, created);
            this.logger.debug("mcp session initialized", { sessionId: sid });
          },
        });
        created.onclose = (): void => {
          if (created.sessionId !== undefined) {
            this.sessions.delete(created.sessionId);
          }
        };
        await factory().connect(created);
        transport = created;
      }

      const body = req.method === "POST" ? await this.readJsonBody(req) : undefined;
      await transport.handleRequest(req, res, body);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error("http request failed", { error: message });
      if (!res.headersSent) {
        res.writeHead(500, { "content-type": "application/json" }).end(JSON.stringify({ error: "internal_error" }));
      }
    }
  }

  private readSessionId(req: IncomingMessage): string | undefined {
    const header = req.headers[SESSION_HEADER];
    if (header === undefined) {
      return undefined;
    }
    const value = Array.isArray(header) ? header[0] : header;
    return value !== undefined && value.length > 0 ? value : undefined;
  }

  private readJsonBody(req: IncomingMessage): Promise<unknown> {
    return new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk: Buffer) => {
        data += chunk.toString();
      });
      req.on("end", () => {
        if (data.length === 0) {
          resolve(undefined);
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
      req.on("error", reject);
    });
  }
}
