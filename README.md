# THYNKVERSE FLOW 2.0 — Interactive Architecture Atlas

**Version:** 2.0.0  
**Updated:** 22 October 2026 (SAST)  
**Status:** development branch / Vercel preview. **Not a LIVE approval.**  
**Source of truth:** Control Room handovers, product contracts and the preserved original Flow. The diagram is documentation, not live monitoring.

## Why v2 exists

The prior v1 architecture explorer moved and re-centred the *entire master canvas* whenever a process was clicked. It also displayed many subprocesses as explanation text rather than diagram nodes.

**Flow 2.0 fixes this interaction contract:**

1. The master map displays seven fixed, visually connected architecture regions, each previewing a sample of its processes.
2. Click a system or any previewed process. A **fixed, connected subflow window** opens over the master canvas. The master map remains exactly where it was.
3. Inside the window, **every main process** is represented as a stage node, connected by directional arrows. Stage nodes contain recursively expandable nested diagrams; no software depth limit is hard-coded.
4. Click a stage to reveal its actual child nodes and connectors **at that stage**, without moving the master map or changing zoom. Continue into nested decisions or child steps.
5. A decision may branch into **YES** and **NO** outcomes, both real clickable nodes leading to another applicable process.
6. Cross-system links move the focus to the linked process **inside the fixed subflow window**, never by re-centring the master canvas.
7. Pan or zoom the **master canvas only when you drag, scroll or select the explicit zoom controls**. A deep link can scroll *inside the fixed subflow pane* to reveal a requested stage, without moving the outer diagram.

## Current coverage

- **7** architecture domains
- **73** main process stages
- **254** nested subprocesses
- **29** specifically linked cross-system process relationships
- **7** decision gates with branching outcomes
- Existing master-level connections across all seven domains

The seven domains:

| ID | System |
|---|---|
| F01 | Product & Governance |
| F02 | Business & Client Lifecycle |
| F03 | Logic & Authorization |
| F04 | Code, Records & Integrations |
| F05 | Worker & Automation |
| F06 | Release Environments |
| F07 | Operational History & Roadmap |

Detailed nodes cover sales intake, SharePoint, CompanyID, Super Control policy, email/password and Microsoft authentication, iDocs write-back, Chatto WhatsApp requests, Thynkly / Dialog Connect, Main Focus Supervisor reporting, and controlled environments.

### Example: LIVE authorization

Open process \`F06.8\` — **Explicit LIVE approval**:

- Expand the **Go / no-go decision** (\`F06.8.2\`) to see **YES / APPROVED → LIVE deployment** and **NO / REJECTED → STOP, correct and retest**.
- Expand \`F06.9\` — LIVE deployment — to see exact product, release metadata, environment and smoke-check process, with post-deploy health branches.
- Expand \`F06.10\` — Audit, rollback & monitoring — to see its own nested plan and recovery steps.

This three-stage illustration is **not the limit of the architecture**. Every one of the seven domains has its own set of full-length process sequences and nested checkpoints.

## Key files

| File | Purpose |
|---|---|
| \`index.html\` | Flow 2.0 entry / canvas shell |
| \`flow-v2.css\` | Canvas, swimlanes, connectors, recursive nodes, decision styling, mobile layout |
| \`flow-v2.js\` | Master graph, expandable stages, cross-link navigation, pan/zoom, search and deep links |
| \`architecture-data.js\` | Preserved, documented v1 seven-domain baseline data |
| \`architecture-expansion.js\` | Additive CRM 9.0 + Chatto + Thynkly + decision / cross-link reference layers |
| \`business-flow.html\` | Preserved original Cytoscape business diagram |
| \`client.html\` | Existing client page, still embedding the original business diagram |
| \`admin.html\` | Existing setup preview (not secure production authentication) |
| \`vercel.json\` | Existing and new static routes |

## Existing Flow preservation

The original v1 business map remains byte-for-byte preserved in \`business-flow.html\`. The client iframe points to it, not the newly rebuilt \`/\` architecture. \`admin.html\` is unchanged. No CRM, Super Control, Supabase or SharePoint data and no private repository were modified in this work.

Routes:
- \`/\` or \`/architecture\` — Flow 2.0 explorer
- \`/business-flow\` or \`/business-flow.html\` — original business map
- \`/c/:code\` — original client view
- \`/admin\` — original setup-preview view

## How to navigate

- **Click a domain** to open all its process stages as a connected flow diagram.
- **Click a stage** to reveal internal nodes; click a child node to continue.
- **Expand all / Collapse all** affects only the open subflow; it does not move the master camera.
- **Cross-link chips** identify relationships to another numbered system/process.
- **Search** (Ctrl/Cmd+K) finds stages and subprocesses in all seven domains.
- **Share** copies a URL fragment such as \`/#F06.8.2\`.
- **Export** downloads the complete reference JSON for diagram or AI import.
- **Drag blank canvas** to pan; scroll on blank master canvas to zoom. The subflow pane scrolls independently.
- **Fit** re-centres **only when explicitly clicked**.

## Release safety

Universal release sequence:

\`DEV/BUILD → TEST → VERIFY → DEMO/PILOT → VERIFY → LIVE\`

Passing a stage does not authorize the next stage; do not change LIVE without owner approval. This architecture viewer is static, **read-only** and does not perform deployment, licensing, CRM writes or authentication.

"Historical PASS" and "Frozen" describe documented handover checkpoints only. They **do not verify the current LIVE state**. Where the 21 October CRM 9.0 handover calls for read-only verification before Supervisor changes, the atlas marks those additions as proposed or requiring verification.

## Verification results / release checklist

**Automated checks performed using the connected GitHub sources:**
- Valid JS syntax for the new client runtime and extension.
- All 73 main stages + 254 nested subprocesses uniquely indexed across seven domains.
- All 29 explicit cross-process links and seven decision gate targets resolve.
- Simulated interactions: opening, expanding, YES/NO branching, cross-system link, search, collapse and close.
- **Master camera remains unchanged across all the above click operations.**
- Vercel's linked preview build reports READY.

**Still required before merge or LIVE:**
- Desktop/mobile visual browser acceptance on the preview URL, with horizontal scrolling and long expanded branches.
- Test the preserved \`/business-flow.html\`, \`/c/:code\`, and \`/admin\` routes.
- Confirm accessibility, keyboard paths and any desired presentation refinements.
- Explicit authorization for promotion if the root route is public-facing.

This is a versioned, reviewable change on a GitHub feature branch; it should not be merged automatically.
