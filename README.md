# THYNKVERSE FLOW 3.0 — Business Structure + Architecture Atlas

**Checkpoint:** 22 October 2026 (SAST)  
**Status:** Development branch / Vercel Preview. LIVE unchanged.

## Two tabs

The Flow site now has a primary **Business Structure** view and a secondary **Interactive Architecture Atlas** tab. The user can switch between them without altering the preserved legacy client experience.

| Path | Purpose |
|---|---|
| / | Business Structure first/default |
| /business-structure | Standalone Business Structure |
| /architecture | Seven-domain Architecture Atlas second tab |
| /business-structure?client=1 | Client-only Business Structure with no Atlas or owner editing controls |
| /business-structure?client=1&name=Example&d=... | Client-only Business Structure including owner-added process data in the link |
| /business-flow.html | Byte-for-byte original Cytoscape business diagram |
| /c/:code | Original branded client page, with new mobile side filtering |
| /admin | Existing company setup preview (NOT secure production authentication) |

## Mobile floating View / Category controls

The full business diagram occupies the available screen. A narrow tab on the left edge opens the Business View and Show Category controls. The panel disappears when a filter is selected, when tapped outside, when explicitly closed, or after approximately 6.5 seconds of inactivity. It can be reopened without losing the selected filter.

The same mobile side-panel behavior has been added to the preserved /c/:code client page. This avoids leaving category fields in a large persistent overlay.

## Add Process

The owner-facing Add Process dialog creates new boxes with a name, type/category, parent process, description, owner, relevant systems, and requirements. Parent-child connections are rendered in Cytoscape. The owner can remove custom boxes and their custom descendants.

Custom additions are saved using **localStorage in the current browser**. They do not automatically synchronize to another device or a live server. Export and Import JSON is available for longer drafts or backups.

The client share link includes owner-added process details in an encoded URL parameter when the link is small enough for reliable sharing (approximately 3,900 characters maximum). For longer diagrams, export JSON instead; do not silently discard custom work.

## Share Business Structure only

Click **Client link** in the owner Business Structure. Optionally give the client/company name. Then choose:

- Include additions (embedded into the client URL)
- Base structure only (without owner-added boxes)

The resulting standalone client page displays **only Business Structure**, no Atlas tabs, no Add Process button, and no owner Import/Export controls. Clients can still view the diagram and use mobile category filters.

**Privacy/security boundary:** Client-only means a separate, read-only-style UI, NOT authorization. These are public-link static files, not a private authenticated client portal. Do not include private customer data in custom process names/descriptions or shared URLs. A Vercel preview may require SSO sign-in. Public client links should be used only after an approved public release.

## Architecture Atlas

The second tab preserves the Flow 2.0 atlas: seven domains, 73 main stages, 254 nested subprocesses, 29 detailed cross-links, and seven decision gateways. Opening process details does not recenter the master canvas. Release states are documentary, not current live telemetry or approvals.

## Main files

- index.html — Business-first homepage with both tabs.
- business-structure.html, business-structure.css, business-structure.js — client share mode, mobile filter flyout, custom drafts and import/export.
- business-engine.html — separate extension-enabled copy of the original business flow.
- business-bridge.js — operations for adding, linking, selecting and removing custom business process nodes.
- architecture.html — second-tab atlas.
- architecture-data.js, architecture-expansion.js, flow-v2.js, flow-v2.css — architecture data and interactions.
- business-flow.html — unmodified original, retained for legacy clients.
- client.html + client-category-flyout.css + client-category-flyout.js — preserved client page with new mobile side controls.
- admin.html — original setup-preview admin (unchanged).
- vercel.json — isolated routing for all views.

## Checks

Source and simulated behavioral checks completed: JavaScript syntax, required HTML IDs and asset references, Vercel rewrite destinations, preservation of the original business map, nested custom process additions, removal of custom descendants, safe input cleaning, browser-save logic, client-only URL generation, and the mobile panel opening and closing on selection.

Still required before any LIVE promotion: actual desktop/mobile browser testing, including touch events and inactivity behavior; client-link delivery with the deployment's access controls; and a check that the previous /c/:code and /admin pages remain correct. The branch and draft pull request must not be merged automatically.

Release order is DEV/BUILD → TEST → VERIFY → DEMO/PILOT → VERIFY → LIVE, with owner authorization at progression gates.
