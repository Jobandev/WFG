import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';
const whsms = resolve(process.env.WHSMS_ROOT || '../whsms-website-host');
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: true, workers: 2,
  use: { baseURL: 'http://127.0.0.1:8088', trace: 'retain-on-failure' },
  projects: [ { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } }, { name: 'tablet', use: { viewport: { width: 820, height: 1180 }, hasTouch: true } }, { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } } ],
  webServer: [
    { command: 'node backend/src/server.js', cwd: whsms, url: 'http://127.0.0.1:3301/api/health', env: { PORT: '3301', HOST: '127.0.0.1', NODE_ENV: 'development', N8N_WEBHOOK_ENABLED: 'false', SUBMISSIONS_DB_PATH: 'work/website-e2e.sqlite' } },
    { command: 'npm --prefix frontend run dev -- --port 5179', cwd: whsms, url: 'http://127.0.0.1:5179/assessment-app/', env: { WHSMS_APP_BASE: '/assessment-app/', WHSMS_API_PROXY_TARGET: 'http://127.0.0.1:3301', VITE_API_BASE_URL: '/api', VITE_WEBSITE_ORIGIN: 'http://127.0.0.1:8088' } },
    { command: 'node tools/preview.mjs', url: 'http://127.0.0.1:8088/' }
  ]
});
