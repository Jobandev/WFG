Adds a branded static assessment hub and additive links beside the existing WhatsApp
services. All original WhatsApp anchors/messages, navigation, shared branding/styles
and existing assets are preserved. Sponsor is explicitly distinguished from the
individual Visibility Assessment.

The iframe runs the separately maintained WHSMS app; no backend/questionnaire code
is copied into WFG. Public endpoints are configurable; height-only messages are
source/origin checked. Production config remains disabled and app/backend gates
from WHSMS #34 remain intact. Includes loopback-only local preview, reproducible
website/app/API/SQLite tests, screenshots and deployment/approval guidance.

See docs/WHSMS_INTEGRATION.md and docs/TEST_EVIDENCE.md for commands, actual results,
companion dependency, pre-existing Windows limitations and remaining approvals.
No deployment, upstream main push, GitHub merge, live webhook or notification.
