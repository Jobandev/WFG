# Website integration test evidence — 24 November 2026

Final integration update: the backend combines #35's dark/gold theme and portable
Windows tests. The old Windows backup failures below are historical, not current.
The final full local suites pass: backend 229, frontend 87, assessment browser 38.
Website browser tests remain 14 and now also dispatch each actual persisted job
through generated n8n validation Code, a real local durable gateway and fake staff
notification. Accepted counts remain one across replay; assessment-only Cyber and
Business produce zero mock notifications. These are local mocks, not an n8n engine.

A Linux CI retry test initially failed while awaiting the UI after resubmission.
The test now first awaits and verifies the real HTTP 201 receipt/body, then checks
completion and same-session reuse. Final local website run: 14 passed, 0 failed.
The private cross-repository Linux job also passed all 14 strengthened tests. No
application validation, security check or expected status was weakened.

An initial public-fork CI run failed before tests because WHSMS is private and the
public repository token cannot check it out. Remediation keeps only preservation
tests in public CI and runs full E2E in WHSMS private CI against a pinned website
revision. No credentials or repository visibility/permissions were changed.

Windows, Node 22.20.0, Chromium, two concurrent Playwright workers. Synthetic data.

| Executed command | Result |
| --- | --- |
| WFG: npm test | 3 passed, 0 failed, 0 skipped |
| WFG: npm run test:e2e | 14 passed, 0 failed, desktop/mobile |
| WFG: npm audit | 0 known vulnerabilities |
| WHSMS: npm --prefix frontend test | 87 passed, 0 failed |
| WHSMS: npm run build | passed, Vite 8.3.5, 39 modules |
| Both: git diff --check | passed |

The website E2E uses the actual PR #34-based React app, Express validation and
SQLite. Tests query canonical submissionId/receivedAt and the pending outbox after
each pathway receives HTTP 201. They cover Sponsor consent, Cyber/Business no-contact
completion, a controlled HTTP 503 with same-session retry, original WhatsApp anchors,
mobile menu/navigation, /WFG/ subdirectory routes, default production settings,
untrusted pathway selection, automatic frame sizing and wrong-source message rejection.
Resize messages contain no answers, contact details or receipt IDs.

No live webhook, notification, customer data, production gateway or external API was
used. No real WhatsApp message was sent. Local API ports and database paths are
isolated from existing servers. All original WhatsApp anchor HTML/messages are also
compared byte-for-byte with origin/main by the preservation test.

Baseline before modifications: WHSMS backend 203 executed, 201 passed and 2 failed.
database-maintenance.test.js assumes POSIX owner-mode bits and has a Windows locked
file cleanup failure after those assertions. These are pre-existing platform issues;
backend code and tests were not changed. The root npm test stops after backend
failure, so frontend was run independently rather than claimed as part of that run.
PR #34's final Linux CI was inspected and green; companion PR CI checks the changed
app on Linux. No tests were skipped or weakened to conceal the Windows failures.

An initial E2E invocation could not start because existing port 3001 was occupied;
isolated ports 3301/5179/8088 resolved it. A later E2E invocation correctly refused
the running task-owned preview; only that preview was paused before the final pass.
Existing unrelated servers were not stopped.

Remaining manual checks: Joban design/navigation sign-off, physical mobile devices,
Safari/Firefox, screen-reader review, approved public pathway content, actual hosting
TLS/routing/CSP/frame-ancestors and exact-origin CORS if required. Production flags
and Business POST refusal remain those of PR #34. No production readiness claim.
