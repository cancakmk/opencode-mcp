import { Config } from "./config/Config.js";
import { Logger } from "./logging/Logger.js";
import { OpenCodeClient } from "./opencode/OpenCodeClient.js";
import { OpenCodeMcpServer } from "./server/OpenCodeMcpServer.js";
import { StdioRunner } from "./transport/StdioRunner.js";
import { HttpRunner } from "./transport/HttpRunner.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

async function main(): Promise<void> {
  const config = Config.fromEnv();
  const logger = new Logger(config.logLevel);

  const client = new OpenCodeClient({
    baseUrl: config.opencode.baseUrl,
    username: config.opencode.username,
    password: config.opencode.password,
    logger,
  });

  const serverFactory = (): McpServer => new OpenCodeMcpServer(config, client, logger).build();

  if (config.transport === "stdio" || config.transport === "both") {
    await new StdioRunner(logger).run(serverFactory());
  }

  if (config.transport === "http" || config.transport === "both") {
    await new HttpRunner(config.http, logger).run(serverFactory);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`fatal: ${message}\n`);
  process.exit(1);
});
