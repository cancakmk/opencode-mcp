import { Config } from "./config/Config.js";
import { Logger } from "./logging/Logger.js";
import { OpenCodeClient } from "./opencode/OpenCodeClient.js";
import { OpenCodeMcpServer } from "./server/OpenCodeMcpServer.js";
import { StdioRunner } from "./transport/StdioRunner.js";

async function main(): Promise<void> {
  const config = Config.fromEnv();
  const logger = new Logger(config.logLevel);

  const client = new OpenCodeClient({
    baseUrl: config.opencode.baseUrl,
    username: config.opencode.username,
    password: config.opencode.password,
    logger,
  });

  const server = new OpenCodeMcpServer(config, client, logger).build();

  if (config.transport === "stdio" || config.transport === "both") {
    await new StdioRunner(logger).run(server);
  }

  if (config.transport === "http" || config.transport === "both") {
    logger.warn("http transport is not implemented yet (planned for phase 2)");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`fatal: ${message}\n`);
  process.exit(1);
});
