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

/** Model referansı. */
export interface ModelRef {
  readonly providerID: string;
  readonly id: string;
  readonly variant?: string;
}

/** Bir OpenCode oturumu. */
export interface Session {
  readonly id: string;
  readonly title?: string | null;
  readonly projectID?: string;
  readonly agent?: string | null;
  readonly model?: ModelRef | null;
  readonly cost?: number;
  readonly time?: { readonly created?: number; readonly updated?: number };
  readonly location?: { readonly directory?: string };
}

/** Asistan mesajındaki içerik parçası (metin, tool, reasoning…). */
export interface MessageContentPart {
  readonly type: string;
  readonly text?: string;
}

/** Bir oturum mesajı (kullanıcı, asistan, idle…). */
export interface SessionMessage {
  readonly id: string;
  readonly type: string;
  readonly time?: { readonly created?: number };
  readonly text?: string;
  readonly outcome?: string;
  readonly content?: readonly MessageContentPart[];
}

export interface SessionResponse {
  readonly data: Session;
}

export interface SessionListResponse {
  readonly data: readonly Session[];
}

export interface MessageListResponse {
  readonly data: readonly SessionMessage[];
}

export interface MessageResponse {
  readonly data: SessionMessage;
}

export interface PromptResponse {
  readonly data: { readonly id: string; readonly sessionID: string };
}

export interface CreateSessionInput {
  readonly title?: string;
  readonly agent?: string;
  readonly model?: ModelRef;
  readonly directory?: string;
}

export interface ListSessionsQuery {
  readonly limit?: number;
  readonly order?: "asc" | "desc";
  readonly search?: string;
}

export interface ListMessagesQuery {
  readonly limit?: number;
  readonly order?: "asc" | "desc";
  readonly type?: string;
}
