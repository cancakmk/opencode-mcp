/**
 * OpenCode V2 HTTP API tipleri.
 *
 * Kaynak: çalışan sunucudan alınan OpenAPI şeması (`/openapi.json`).
 * Kapsam büyüdükçe bu dosya genişletilir; şema kaynağı tek doğruluk noktasıdır.
 */

/** `GET /api/info` yanıtı. */
export interface ServerInfo {
  readonly version: string;
  readonly pid?: number;
  readonly urls?: readonly string[];
  readonly paths?: Readonly<Record<string, string>>;
  readonly capabilities?: Readonly<Record<string, unknown>>;
}

/** Bir OpenCode oturumu (özet). */
export interface SessionSummary {
  readonly id: string;
  readonly title?: string | null;
  readonly projectID?: string;
  readonly agent?: string | null;
  readonly model?: { readonly providerID: string; readonly id: string } | null;
  readonly cost?: number;
  readonly time?: { readonly created?: number; readonly updated?: number };
  readonly location?: { readonly directory?: string };
}
