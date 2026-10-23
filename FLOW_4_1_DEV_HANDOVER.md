# FLOW 4.1 — Diagram Library and Expiring Client Snapshots
Date: 23 October 2026 · Status: DEV PREVIEW / NOT LIVE RELEASED

## Delivered
- /library: browser-local multi-industry diagrams, starter templates, node editor, process links, cross-diagram links, drag/pan/zoom.
- Revision checkpoints with restore, JSON import/export and browser persistence.
- /share: standalone read-only client viewer; link is a fixed diagram snapshot, not the live editable diagram.
- /api/flow-share: encrypted Brotli-compressed AES-256-GCM snapshot token with server-side expiry (15 minutes–30 days), no-store response.
- Vercel preview-branch-only FLOW_SHARE_SECRET configured (secret not in GitHub source).
- Existing /studio, /architecture, Business Structure, /c/:code and /admin preserved.
- Studio navigation includes Diagram Library link.

## Important limitations
- Browser-local diagram drafts do NOT synchronize across devices. The database and owner authentication required for reliable central storage are not present in the Flow project.
- Link expiration is enforced by the server on each access; early revocation, view limits and password access are NOT supported.
- Share-creation API has no user-authenticated ownership. Keep production disabled until a proper authenticated owner model and abuse controls are in place.
- Preview may require Vercel SSO. Do not share customer-private data or assume client-only view means authenticated privacy.
- DO NOT bind to existing Super Control LIVE/TEST databases or add source secrets.

## Evidence and release
- GitHub JS syntax PASS, required HTML IDs source checks PASS, Vercel preview build READY, encrypted secret presence confirmed (preview only).
- Actual browser end-to-end share issue/open/expire/tamper tests and mobile touch QA are NOT RUN in this environment.
- LIVE is unchanged. PR #3 is draft, targeting Flow Studio v4 feature branch. The release gate is NO-GO for LIVE until owner authentication/storage/security and E2E acceptance are complete.

## Test contract
1. Create independent diagram, add nodes/decisions/connections, save revision. Refresh and confirm persisted in that same browser.
2. Link a node in another diagram; open the linked diagram without losing the original.
3. Create share with 15-minute expiry; open link within period and ensure readonly snapshot.
4. Force expiry and verify GET returns HTTP 410; altered token must fail.
5. Test iPhone 15 Pro Max Chrome: library cards, glass drawer, drag/zoom, client view.
6. Test existing Business Studio and Architecture Atlas regressions.
