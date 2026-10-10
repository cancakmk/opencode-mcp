# opencode-mcp — İlerleme

## Özet
- Amaç: OpenCode V2 HTTP API'sini MCP araçları/kaynakları olarak sunan,
  paylaşılabilir MCP sunucusu (her MCP istemcisi + n8n AI Agent).
- Stack: Node.js 24 + TypeScript (strict, ESM) · @modelcontextprotocol/sdk ·
  Zod · Vitest · Docker.
- Çalıştırma: `npm run build && node dist/index.js` (stdio) / Faz 2'de HTTP.
- Test komutu: npm test

## Fazlar
- [x] Faz 1 — İskelet + Config + V2 istemci + stdio + `oc_health` (dosyalar: package.json,
      tsconfig.json, src/{index,version}.ts, src/config/Config.ts, src/logging/Logger.ts,
      src/opencode/{OpenCodeClient,types}.ts, src/tools/{BaseTool,HealthTool,ToolRegistry}.ts,
      src/server/OpenCodeMcpServer.ts, src/transport/StdioRunner.ts, tests/**)
- [x] Faz 2 — HTTP transport + Bearer + konteyner (n8n_default) (dosyalar:
      src/transport/{HttpRunner,BearerAuth}.ts, docker/Dockerfile, docker-compose.yml,
      tests/transport/BearerAuth.test.ts; index.ts http desteği)
- [x] Faz 3 — Session & message araçları + `oc_ask` (prompt & wait) (dosyalar:
      src/opencode/{OpenCodeClient,SessionWaiter,message,types}.ts, src/util/{args,sleep}.ts,
      src/tools/session/*, src/tools/message/*, src/tools/prompt/*, tests/opencode/*)
- [x] Faz 4 — Permission, file, vcs, model/agent araçları (dosyalar:
      src/tools/permission/*, src/tools/file/*, src/tools/vcs/*, src/tools/model/*,
      src/tools/agent/*, src/tools/session/SessionDiffTool.ts; OpenCodeClient metodları)
- [x] Faz 5 — Gözlemlenebilirlik (aktivite özeti, yapısal log, log/diff resources)
      (dosyalar: src/opencode/activity.ts, src/server/ResourceRegistry.ts,
      SessionWaiter aktivite, OpenCodeMcpServer süre logu, tests/opencode/activity.test.ts)
- [x] Faz 6 — `oc_api` backstop + profiller + resources/prompts (dosyalar:
      src/tools/api/ApiTool.ts, src/server/PromptRegistry.ts, ToolRegistry/Server güncellemeleri)
- [x] Faz 7 — n8n uçtan uca (MCP Client Tool + AI Agent) (n8n workflow ID `4tWn6voXvHjMn51a`;
      README n8n bölümü; Standalone MCP Client ile `oc_ask` → "OK")
- [x] Faz 8 — Doküman + yayına hazırlık (README tam sürüm: araç/kaynak/prompt tabloları,
      güvenlik, n8n; package.json repository/homepage/bugs/author). npm yayını onay bekliyor.

TÜM FAZLAR TAMAMLANDI

## Şu Anki Durum
- Aktif faz: yok — Faz 1–8 tamamlandı.
- Doğrulama özeti: typecheck temiz; `npm test` (unit); `npm audit` 0 açık; build başarılı;
  uçtan uca: n8n workflow `4tWn6voXvHjMn51a` → Standalone MCP Client → `oc_ask` → **"OK"**.
- Yayın durumu: private repo `github.com/cancakmk/opencode-mcp`; etiketler `faz-1..faz-8`.
  npm'e public yayın kullanıcı onayı bekliyor.
- Bilinen notlar: `essential` profilde 28 araç (bağlam yükü); gerekirse portmanteau/progressive
  disclosure (PROGRESS notu). n8n e2e workflow'u n8n içinde yaşar (repo dışı).
- Son güncelleme: 2026-10-10T11:35:00Z
- Oturum: (bkz. opencode oturum kimliği)
