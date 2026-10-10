import { z } from "zod";

export const TransportModeSchema = z.enum(["stdio", "http", "both"]);
export type TransportMode = z.infer<typeof TransportModeSchema>;

export const ToolProfileSchema = z.enum(["essential", "full"]);
export type ToolProfile = z.infer<typeof ToolProfileSchema>;

export const LogLevelSchema = z.enum(["debug", "info", "warn", "error"]);
export type LogLevel = z.infer<typeof LogLevelSchema>;

const EnvSchema = z.object({
  OPENCODE_BASE_URL: z.string().min(1).default("http://127.0.0.1:4096"),
  OPENCODE_SERVER_USERNAME: z.string().min(1).default("opencode"),
  OPENCODE_SERVER_PASSWORD: z.string().min(1).optional(),
  MCP_TRANSPORT: TransportModeSchema.default("stdio"),
  MCP_HTTP_HOST: z.string().min(1).default("127.0.0.1"),
  MCP_HTTP_PORT: z.coerce.number().int().positive().max(65535).default(8790),
  MCP_AUTH_TOKEN: z.string().min(1).optional(),
  MCP_TOOL_PROFILE: ToolProfileSchema.default("essential"),
  MCP_LOG_LEVEL: LogLevelSchema.default("info"),
});

export interface OpenCodeConnectionConfig {
  readonly baseUrl: string;
  readonly username: string;
  readonly password: string | undefined;
}

export interface HttpServerConfig {
  readonly host: string;
  readonly port: number;
  readonly authToken: string | undefined;
}

export interface AppConfig {
  readonly opencode: OpenCodeConnectionConfig;
  readonly transport: TransportMode;
  readonly http: HttpServerConfig;
  readonly toolProfile: ToolProfile;
  readonly logLevel: LogLevel;
}

/**
 * Uygulama yapılandırması. Ortam değişkenlerinden doğrulanarak üretilir.
 */
export class Config {
  private constructor(private readonly config: AppConfig) {}

  /** Ortam değişkenlerini doğrulayıp bir Config üretir. Geçersizse hata atar. */
  static fromEnv(env: NodeJS.ProcessEnv = process.env): Config {
    const parsed = EnvSchema.safeParse(env);
    if (!parsed.success) {
      throw new Error(`Geçersiz ortam değişkenleri: ${parsed.error.message}`);
    }
    const e = parsed.data;
    return new Config({
      opencode: {
        baseUrl: e.OPENCODE_BASE_URL,
        username: e.OPENCODE_SERVER_USERNAME,
        password: e.OPENCODE_SERVER_PASSWORD,
      },
      transport: e.MCP_TRANSPORT,
      http: {
        host: e.MCP_HTTP_HOST,
        port: e.MCP_HTTP_PORT,
        authToken: e.MCP_AUTH_TOKEN,
      },
      toolProfile: e.MCP_TOOL_PROFILE,
      logLevel: e.MCP_LOG_LEVEL,
    });
  }

  get opencode(): OpenCodeConnectionConfig {
    return this.config.opencode;
  }

  get transport(): TransportMode {
    return this.config.transport;
  }

  get http(): HttpServerConfig {
    return this.config.http;
  }

  get toolProfile(): ToolProfile {
    return this.config.toolProfile;
  }

  get logLevel(): LogLevel {
    return this.config.logLevel;
  }
}
