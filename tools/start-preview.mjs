import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const whsms = resolve(root, process.env.WHSMS_ROOT || '../whsms-website-host');
await access(resolve(whsms, 'frontend/node_modules/vite/bin/vite.js'));
await access(resolve(whsms, 'backend/node_modules/express/package.json'));
// Refuse to attach to someone else's process or change its configuration.
for (const url of ['http://127.0.0.1:3301/api/health', 'http://127.0.0.1:5179/assessment-app/', 'http://127.0.0.1:8088/']) {
  try { await fetch(url, { signal: AbortSignal.timeout(500) }); throw new Error(`Preview address already in use: ${url}`); }
  catch (error) { if (error.message.startsWith('Preview address')) throw error; }
}
const children = [];
let stopping = false;
function stop() { if (stopping) return; stopping = true; for (const child of children) child.kill('SIGTERM'); }
function start(args, cwd, env) {
  const child = spawn(process.execPath, args, { cwd, env: { ...process.env, ...env }, stdio: 'inherit', windowsHide: true });
  children.push(child);
  child.on('error', () => { console.error('Local preview process could not start'); process.exitCode = 1; stop(); });
  child.on('exit', code => { if (!stopping) { process.exitCode = code || 1; stop(); } });
}
start(['backend/src/server.js'], whsms, { PORT: '3301', HOST: '127.0.0.1', NODE_ENV: 'development', N8N_WEBHOOK_ENABLED: 'false', SUBMISSIONS_DB_PATH: 'work/website-preview.sqlite' });
start(['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5179'], resolve(whsms, 'frontend'), { WHSMS_APP_BASE: '/assessment-app/', WHSMS_API_PROXY_TARGET: 'http://127.0.0.1:3301' });
start(['tools/preview.mjs'], root, { WFG_PREVIEW_PORT: '8088', WFG_ASSESSMENT_PROXY_TARGET: 'http://127.0.0.1:5179', WFG_API_PROXY_TARGET: 'http://127.0.0.1:3301' });
process.once('SIGINT', stop); process.once('SIGTERM', stop);
console.log('Synthetic local preview only. Open http://127.0.0.1:8088/digital/');
