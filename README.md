# Twins Pickleball Club

Сайт twinspickleball.com: статические страницы на русском (`/`) и английском (`/en/`).

- Тексты, цены, расписание, локации и ссылки: `src/content.mjs`
- Стили и скрипты: `src/style.css`, `src/app.js`
- Фото, шрифты, иконка: `public/`
- Сборка: `node build.mjs` → папка `dist/`

Публикация: Cloudflare Workers собирает сайт из ветки `main` (`npm run build`, затем `npx wrangler deploy`; настройки в `wrangler.jsonc`).
