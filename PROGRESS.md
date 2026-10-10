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
- [x] Faz 9 — Tam kapsamlı araç testi + düzeltmeler (dosyalar: src/tools/BaseTool.ts
      [text boş gövdeyi "ok" yapar], src/opencode/OpenCodeClient.ts [fs.read text modu,
      responseType], src/server/OpenCodeMcpServer.ts [metin kuvvetlendirme])

TÜM FAZLAR TAMAMLANDI

## Tam Kapsamlı Araç Testi (Faz 9)
`essential` **27/27**, `full` **31/31** PASS (gerçek izole motora karşı, n8n konteynerinden):
session create/list/get/active/diff/delete, prompt, ask, wait, interrupt, message list/get,
permission list, saved permission list, file read/list/find/write, vcs info/status/diff/branch,
model list/default/switch, agent list/switch, provider list, health, oc_api.
Bulunan ve düzeltilen 2 hata: (1) boş gövde dönen uçlar (`switch_model/agent`) `text: undefined`
üretiyordu → protokol hatası; (2) `fs.read` JSON değil düz metin döndürüyordu → JSON.parse hatası.
Canlı doğrulanamayanlar (ortam ön koşulu): `oc_permission_reply` ve `oc_saved_permission_remove`
(izole motor izinleri **otomatik onaylıyor** → bekleyen/kayıtlı izin oluşmuyor → 404);
`oc_vcs_init` (sunucu bu konteynerde **503 VCS initialization failed** döndürüyor; araç uç noktayı
doğru çağırıyor, hata sunucudan geliyor).

## Şu Anki Durum
- Aktif faz: yok — Faz 1–9 tamamlandı.
- Doğrulama: typecheck temiz; `npm test` 15/15; `npm audit` 0; build başarılı; araçlar 27/27 (essential)
  ve 31/31 (full); n8n e2e workflow `4tWn6voXvHjMn51a` → `oc_ask` → "OK".
- Yayın durumu: private repo `github.com/cancakmk/opencode-mcp`; etiketler `faz-1..faz-9`.
  npm public yayın kullanıcı onayı bekliyor.
- Son güncelleme: 2026-10-10T11:40:00Z
- Oturum: (bkz. opencode oturum kimliği)
