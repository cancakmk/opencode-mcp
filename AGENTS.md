# opencode-mcp — Projeye Özel Kurallar

Genel kurallar için `~/.config/opencode/AGENTS.md` geçerlidir. Bu dosya yalnızca
bu projeye özel eklemeleri içerir.

## Amaç
OpenCode **V2** HTTP API'sini MCP araçları/kaynakları olarak sunan, paylaşılabilir
bir MCP sunucusu. Hazır MCP'ler V1'e göre yazıldığı için V2'ye göre kendimiz yazıyoruz.

## Çalışma komutları
- Kurulum: `npm install`
- Tip kontrolü: `npm run typecheck`
- Test: `npm test`
- Derleme: `npm run build`
- Yerel çalıştırma: `node dist/index.js`

## Mimari ve kod kuralları
- **OOP + clean code:** sorumluluk ayrımı, küçük sınıflar, bağımlılık enjeksiyonu,
  SOLID. Tanrı sınıf yok.
- OpenCode'u çağıran **tek yer** `src/opencode/OpenCodeClient.ts` olmalı; diğer
  modüller HTTP ayrıntılarını bilmez.
- Araçlar `BaseTool`'dan türer; kimlik (ad/başlık/açıklama/zod şeması) + `execute`.
- Tipler `src/opencode/types.ts` içinde; şema kaynağı: çalışan sunucunun `/openapi.json`.
- **`@opencode/client` KULLANILMAZ** (private/dahili; paylaşılabilir pakete uygun değil).
- ESM + NodeNext; relative importlar `.js` uzantılı. Type-only importlar `import type`.
- strict TS (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`).

## Gözlemlenebilirlik
- Logger **stderr**'e JSON yazar (stdout stdio MCP kanalıdır).
- Araç sonuçları, yapılanları (tool çağrıları/diff) özetleyecek şekilde tasarlanır.

## Sırlar / güvenlik
- Sırlar `.env` üzerinden; koda/repoya yazılmaz, commit edilmez.
- `essential` profil riskli araçları kapatır; `full` opt-in.

## Yasaklar
- Faz testleri geçmeden commit/tag/push yapma.
- `dist/`, `node_modules/`, `.env` commit edilmez.
