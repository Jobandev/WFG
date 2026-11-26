// Loopback-only development adapter. Not a production server or deployment recipe.
import { createServer, request } from 'node:http';
import { request as secureRequest } from 'node:https';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.WFG_PREVIEW_PORT || 8088);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid preview port');
function target(value) {
  const url = new URL(value);
  if (url.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Preview proxies must be loopback HTTP origins');
  return url;
}
const appTarget = target(process.env.WFG_ASSESSMENT_PROXY_TARGET || 'http://127.0.0.1:5179');
const apiTarget = target(process.env.WFG_API_PROXY_TARGET || 'http://127.0.0.1:3301');
const questionnaireTarget = new URL('https://wfg-questionnaire.vercel.app');
const questionnaireEmail = process.env.WFG_PREVIEW_EMAIL === '1';
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
function proxy(req, res, origin, path, email = false) {
  const send = email ? secureRequest : request;
  const headers = email
    ? { origin: origin.origin, 'content-type': req.headers['content-type'] || '' }
    : { ...req.headers, host: origin.host };
  const upstream = send(new URL(path, origin), { method: req.method, headers }, response => {
    res.writeHead(response.statusCode, response.headers); response.pipe(res);
  });
  upstream.setTimeout(15000, () => upstream.destroy());
  upstream.on('error', () => {
    if (!res.headersSent) { res.writeHead(502, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify({ success: false, message: email ? 'The email service is unavailable.' : 'Local assessment service unavailable. Retry from this page using the same session.' })); }
    else res.destroy();
  });
  req.on('aborted', () => upstream.destroy()); req.pipe(upstream);
}
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (questionnaireEmail && /^\/(?:WFG\/)?api\/questionnaire$/.test(url.pathname)) {
      if (req.method !== 'POST') return res.writeHead(405).end();
      const allowedHosts = [`127.0.0.1:${port}`, `localhost:${port}`];
      if (!allowedHosts.includes(req.headers.host) || req.headers.origin !== `http://${req.headers.host}`) {
        return res.writeHead(403, { 'Content-Type': 'application/json' }).end('{}');
      }
      return proxy(req, res, questionnaireTarget, '/api/questionnaire', true);
    }
    if (url.pathname.startsWith('/api/')) return proxy(req, res, apiTarget, req.url);
    if (url.pathname.startsWith('/assessment-app/')) return proxy(req, res, appTarget, req.url);
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Cache-Control', 'no-store');
    if (url.pathname === '/site-config.js' || /^\/WFG\/site-config\.js$/.test(url.pathname)) {
      const original = await readFile(resolve(root, 'site-config.js'), 'utf8');
      res.writeHead(200, { 'Content-Type': mime['.js'] });
      const emailConfig = questionnaireEmail ? '\nwindow.WFG_CONFIG.questionnaireSubmitUrl = "/api/questionnaire";\n' : '';
      res.end(original + '\nObject.assign(window.WFG_CONFIG, { assessmentAppUrl: "/assessment-app/", assessmentDevelopmentPreview: true, assessmentPathways: { sponsor: true, "cyber-resilience": true, "business-systems": true } });\n' + emailConfig); return;
    }
    const pathname = decodeURIComponent(url.pathname).replace(/^\/WFG(?=\/)/, '');
    if (pathname.split('/').some(part => part.startsWith('.') || /^client_secret_.*\.json$/i.test(part) || ['node_modules', 'tools', 'tests', 'work'].includes(part))) { res.writeHead(404).end(); return; }
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(404).end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    file = await realpath(file);
    if (!file.startsWith(root + sep) || !mime[extname(file)]) { res.writeHead(404).end(); return; }
    const content = await readFile(file); res.writeHead(200, { 'Content-Type': mime[extname(file)] }); res.end(req.method === 'HEAD' ? undefined : content);
  } catch { res.writeHead(404).end(); }
});
server.listen(port, '127.0.0.1', () => console.log(`Local WFG preview: http://127.0.0.1:${port}/`));
const stop = () => { server.closeAllConnections(); server.close(); };
process.once('SIGINT', stop); process.once('SIGTERM', stop);
