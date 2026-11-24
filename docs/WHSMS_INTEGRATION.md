# WFG → WHSMS website integration

## Final integration update — 24 November 2026

Collaborator push access is now verified. The current website branch is
feature/whsms-integration in Jobandev/WFG; the earlier fork PR remains preserved.
GitHub Pages was inspected: legacy publishing from main:/, HTTPS enforced. No main
push or deployment occurred. Current companion: integration/website-backend-n8n,
combining #34, #35 dark/gold theme and #36 host integration. The completed dark/gold
theme is preserved; the earlier optional ivory override has been removed.

Website E2E now goes beyond receipt persistence: it runs the actual queued event
through a local mock of the generated n8n Code contract, durable acceptance gateway
and fake staff notification. All three services are tested on desktop/mobile;
Sponsor creates one mock notification, assessment-only Cyber/Business create none.
Business production acceptance and notification routing remain disabled.

After submitting synthetic forms, run the safe bounded workflow preview from WFG:

```powershell
$env:LOCAL_WORKFLOW_RUN = 'synthetic-only'
$env:SUBMISSIONS_DB_PATH = (Resolve-Path '../whsms-website-host/work/website-preview.sqlite').Path
npm --prefix ../whsms-website-host/backend run workflow:preview -- --limit 10
```

This uses only ephemeral loopback mock services; it does not activate n8n or send
email. The corrected inactive n8n JSON, 25-node audit, compatibility matrix, credential
setup and production gates live only in the private WHSMS repository. See its
FINAL_INTEGRATION_HANDOVER.md and docs/architecture/n8n-workflow-compatibility.md.
Actual n8n import/SMTP/gateway hosting still require approved staging access.

The historical fork/baseline notes below explain the earlier review stage; use the
new direct website branch and final companion integration branch for release review.

## Architecture and repository boundaries

Website baseline: Jobandev/WFG main ee4f02c. Application baseline: WHSMS PR #34,
1f1dce0 (codex/phase2-autonomous-release), inspected 24 November 2026.
PR #34 combines #29/#30 and hardened #31; production readiness is still gated.

WFG remains static HTML/CSS/JavaScript. Its new assessments/ page uses the existing
header, footer, navigation, logo, stylesheets, service-card/button classes and
WhatsApp configuration. Original WhatsApp anchors/messages are preserved verbatim.
The new Sponsor link explicitly identifies the Sponsor pathway: it does not replace
the existing individual Free Visibility Assessment WhatsApp service.

The separately maintained WHSMS React app is embedded in a titled, sandboxed iframe.
Questionnaire logic, canonical IDs, contact/consent rules and persistence stay in
WHSMS. No backend or copied questionnaire is added to WFG. Public config selects the
application URL and explicitly approved pathways; the application owns its API base.
This avoids two implementations drifting apart and avoids coupling Joban's static
pages to React tooling. A separate-page link is always available if embedding is
blocked. Answers and receipt IDs are not passed to the parent website.

Recommended hosting: WFG + /assessment-app/ static WHSMS build + same-origin /api
reverse proxy to the existing backend. For GitHub Pages, keep WFG static and embed a
separately hosted HTTPS app that has its own same-origin /api proxy. GitHub Pages
cannot run Express/SQLite or proxy /api itself. No such hosting was deployed here.

## Working local preview

Default sibling layout:

```text
outputs/WFG/                  website integration branch
outputs/whsms-website-host/   PR #34-based app integration branch
```

Node 22.12+ is required by the repositories; validation used Node 22.20.0 on Windows.
From WFG, after cloning/checking out the companion branch:

```powershell
npm ci
npm --prefix ../whsms-website-host/backend ci
npm --prefix ../whsms-website-host/frontend ci
$env:WHSMS_ROOT = '../whsms-website-host' # optional when using default sibling name
npm run preview:full
```

Open http://127.0.0.1:8088/digital/ or
http://127.0.0.1:8088/assessments/. Use only synthetic data. The supervisor starts
the API on 3301, Vite on 5179 and WFG on 8088, bound to loopback, with webhook
delivery explicitly false. It refuses to attach to an already responding service.
Stop with Ctrl+C. Do not start tests on those same ports while this preview runs.

The preview server overrides site-config.js only in its HTTP response. The committed
file remains disabled. Requests for assessment assets and /api are proxied to local
services. Proxies accept loopback HTTP origins only. This is a development adapter,
not a production reverse proxy. It never adds credentials or sends webhooks.
Synthetic preview submissions are stored in WHSMS work/website-preview.sqlite;
E2E uses work/website-e2e.sqlite. These files are ignored, not release artifacts.

## Public configuration and production gates

WFG site-config.js:

- assessmentAppUrl: null by default. After approval, the deployed HTTPS app base,
  including a trailing slash, without query, fragment, credentials or tokens.
- assessmentPathways: explicit per-pathway booleans, all false by default.
- assessmentDevelopmentPreview: false in source; effective only on loopback.
- whatsappUrl/contactUrl/workshopsUrl retain the existing values and behavior.

App build settings, set in the WHSMS frontend build environment:

- WHSMS_APP_BASE: public asset prefix, e.g. /assessment-app/ for shared hosting,
  otherwise / for a separate app origin. Must match deployed static routing.
- VITE_API_BASE_URL: defaults to /api. May be an approved HTTPS public API prefix
  or root-relative proxy prefix. URLs containing credentials/query/fragment and
  insecure remote HTTP are rejected. This value is public, never a secret.
- VITE_WEBSITE_ORIGIN: exact parent origin for height-only messaging. Defaults to
  the app's own origin for shared hosting. For cross-origin GitHub Pages embedding,
  configure the reviewed site origin (scheme + host + port, no path).
- WHSMS_API_PROXY_TARGET: development-only Vite proxy target; default backend 3001.
  WFG preview overrides it to local 3301.

Cross-origin browser APIs additionally require an approved exact-origin CORS policy
on the deployed gateway. No permissive CORS was added to the backend. Prefer the
app's same-origin proxy; cookies are omitted by this unauthenticated submission client.
No endpoint is taken from a visitor's query string or iframe messages.

Height messaging carries only {type:'whsms:height',height}; host verifies origin,
active iframe window, integer and 500..20000 bounds. No contact data, answers or
receipt crosses this channel. The frame has no top-navigation or popup permission;
referrerpolicy=no-referrer minimizes parent URL disclosure. Configure reviewed CSP
frame-src on WFG and frame-ancestors on the assessment host. Existing headers that
forbid embedding must be changed only by the deployment/security owner after review.

Setting website booleans does not override the app/backend release gates. PR #34
still disables Cyber/Business public journeys; the backend refuses draft Business
POSTs in production. This integration does not add an alternative production bypass.
Business IDs, consent, recommendations/not-ready routing and Cyber results remain
pending. Their existing development notices and question wording remain unchanged.

## Tests and evidence

```powershell
npm test
npm run test:e2e
```

Playwright automatically starts isolated API/app/site servers, with n8n disabled.
It exercises real website navigation → embedded app → validation → HTTP 201 → SQLite
→ pending outbox. It also checks consent, assessment-only completion, error/retry
session identity, mobile navigation, GitHub Pages-style subpaths, disabled source
configuration, hostile pathway values and source-checked frame resize messages.

WFG preservation tests: 3 passed / 0 failed. Final desktop/mobile Chromium counts
are recorded in TEST_EVIDENCE.md. WHSMS frontend: 87 passed / 0 failed; build passed.
WFG npm audit: zero reported vulnerabilities. Screenshots are in docs/previews/.

Known pre-existing Windows baseline issue: WHSMS backend initially ran 203 tests,
201 passed / 2 failed in database-maintenance.test.js (POSIX chmod expectations and
Windows cleanup locking). No backend code was changed here and no tests were skipped.
Linux PR #34 CI was green; the new companion PR runs its full suite on Linux again.

WHSMS is private; its source is not copied to this public website repository. Public
website CI runs preservation/configuration tests only. Full cross-repository E2E
runs inside WHSMS's private CI, which checks out the reviewed public website SHA.
No additional token, cross-repository secret, visibility or permission change is
needed. Fork PR Actions may require Joban to approve execution; no repository setting
was changed to bypass it. Review both branches together before updating pinned refs.

## Review, submission and deployment requirements

WFG account access was pull-only, so integration is pushed to the authorized fork
M-Moiz-Farooq/WFG. No upstream main branch, GitHub Pages deployment or permissions
were changed. Branch: feat/whsms-assessment-integration. Companion WHSMS branch:
feat/website-assessment-host, based on #34. Both should remain draft pending review.

To submit again if needed:

```powershell
git push fork feat/whsms-assessment-integration
gh pr create --repo Jobandev/WFG --base main --head M-Moiz-Farooq:feat/whsms-assessment-integration --draft --title "Integrate WHSMS pathways alongside existing WhatsApp" --body-file docs/PR_DESCRIPTION.md
```

Required before production: Joban's UI/navigation approval; Moiz's pathway/contract
and deployment approval; approved Cyber results and Business content/consent/IDs;
actual app/API domain, TLS, routing/CSP/CORS and operational storage controls; receiver
auth/replay/dedupe/notification acceptance if automation is later enabled; and final
staging accessibility/browser tests. No live n8n, customer notification or production
data was used. Exactly-once notification delivery is not claimed.
