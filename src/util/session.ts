/**
 * OpenCode oturum kimlikleri `ses...` ile başlamak zorundadır; aksi halde API 400 döner.
 * LLM'lerden veya dış kaynaklardan gelen serbest kimlikleri güvenli bir `ses...` id'sine çevirir.
 */
export function normalizeSessionId(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("ses")) {
    return trimmed;
  }
  const clean = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
  return `ses_${clean.length > 0 ? clean : "default"}`;
}
