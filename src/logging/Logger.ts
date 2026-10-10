import type { LogLevel } from "../config/Config.js";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

/**
 * Yapılandırılmış (JSON) logger. Çıktı **stderr**'e yazılır;
 * çünkü stdio transport'unda **stdout** MCP protokolüne aittir.
 */
export class Logger {
  constructor(private readonly level: LogLevel) {}

  debug(message: string, meta?: Record<string, unknown>): void {
    this.write("debug", message, meta);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.write("info", message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.write("warn", message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.write("error", message, meta);
  }

  private write(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[this.level]) {
      return;
    }
    const entry: Record<string, unknown> = {
      ts: new Date().toISOString(),
      level,
      msg: message,
    };
    if (meta !== undefined) {
      entry.meta = meta;
    }
    process.stderr.write(`${JSON.stringify(entry)}\n`);
  }
}
