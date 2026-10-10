import { timingSafeEqual } from "node:crypto";

/**
 * Gelen HTTP isteklerini Bearer token ile doğrular.
 * Karşılaştırma sabit zamanlıdır (timing attack'a kapalı).
 */
export class BearerAuth {
  constructor(private readonly expectedToken: string | undefined) {}

  isConfigured(): boolean {
    return typeof this.expectedToken === "string" && this.expectedToken.length > 0;
  }

  isAuthorized(header: string | string[] | undefined): boolean {
    if (!this.isConfigured()) {
      return false;
    }
    const value = Array.isArray(header) ? header[0] : header;
    if (value === undefined) {
      return false;
    }
    const separator = value.indexOf(" ");
    if (separator === -1) {
      return false;
    }
    const scheme = value.slice(0, separator);
    const token = value.slice(separator + 1);
    return scheme.toLowerCase() === "bearer" && this.safeEqual(token, this.expectedToken as string);
  }

  private safeEqual(a: string, b: string): boolean {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
    if (bufferA.length !== bufferB.length) {
      return false;
    }
    return timingSafeEqual(bufferA, bufferB);
  }
}
