import type { Logger } from "../logging/Logger.js";
import type { ServerInfo } from "./types.js";

export interface OpenCodeClientOptions {
  readonly baseUrl: string;
  readonly username: string;
  readonly password: string | undefined;
  readonly logger: Logger;
  /** Test enjeksiyonu için; verilmezse global fetch kullanılır. */
  readonly fetchImpl?: typeof fetch;
}

export interface RequestOptions {
  readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
  readonly body?: unknown;
}

/** OpenCode API 2xx dışı bir yanıt döndürdüğünde atılan hata. */
export class OpenCodeApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    readonly bodyText: string,
  ) {
    super(`OpenCode API ${status} on ${path}: ${bodyText.slice(0, 300)}`);
    this.name = "OpenCodeApiError";
  }
}

/**
 * OpenCode V2 HTTP API'sine ince bir istemci.
 * Kimlik doğrulama (HTTP Basic) ve JSON kod çözme burada kapsüllenir;
 * üst katmanlar HTTP ayrıntılarını bilmez.
 */
export class OpenCodeClient {
  private readonly normalizedBaseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly options: OpenCodeClientOptions) {
    this.normalizedBaseUrl = options.baseUrl.replace(/\/+$/, "");
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  get baseUrl(): string {
    return this.normalizedBaseUrl;
  }

  /** Sunucu sağlığı ve sürüm bilgisi. */
  async info(): Promise<ServerInfo> {
    return this.request<ServerInfo>("GET", "/api/info");
  }

  /** Genel amaçlı istek; tüm kaynak/operasyonlar bunu kullanır. */
  async request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(`${this.normalizedBaseUrl}${path}`);
    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = { accept: "application/json" };
    if (this.options.password !== undefined) {
      const token = Buffer.from(`${this.options.username}:${this.options.password}`).toString("base64");
      headers["authorization"] = `Basic ${token}`;
    }

    let body: string | undefined;
    if (options.body !== undefined) {
      headers["content-type"] = "application/json";
      body = JSON.stringify(options.body);
    }

    this.options.logger.debug("opencode request", { method, path });
    const response = await this.fetchImpl(url, { method, headers, ...(body !== undefined ? { body } : {}) });
    const text = await response.text();

    if (!response.ok) {
      throw new OpenCodeApiError(response.status, path, text);
    }
    if (text.length === 0) {
      return undefined as T;
    }
    return JSON.parse(text) as T;
  }
}
