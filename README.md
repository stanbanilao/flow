# Thynkverse Flow — Architecture Explorer

Version: **1.0.0** · Design update: **21 October 2026** · Last referenced Control Room checkpoint: **29 September 2026**

This repository contains two intentionally separate interactive experiences.

| URL | Purpose |
|---|---|
| `/` or `/architecture` | Seven-domain master system architecture explorer |
| `/business-flow` or `/business-flow.html` | Original Cytoscape business operating flow, retained unmodified |
| `/c/:code` | Existing client flow, still embedding the original business map |
| `/admin` | Existing company-creator setup preview (not a secure production admin login) |

## The seven connected domains

1. **F01 Product & Governance** — product portfolio, Super Control authority, decisions and protected contracts.
2. **F02 Business & Client Lifecycle** — agent authentication, sales intake, duplicate prevention, fulfilment and management.
3. **F03 Logic & Authorization** — Microsoft/Supabase identities, company/domain policy, entitlement and session checks.
4. **F04 Code, Records & Integrations** — private repositories, Vercel, Supabase, SharePoint lists, Microsoft and iDocs.
5. **F05 Worker & Automation** — queued AutomationJobs, exact routing, iThynk execution, write-back and frozen worker gates.
6. **F06 Release Environments** — DEV, TEST, DEMO, explicit LIVE approval, LIVE deployment, audit and rollback.
7. **F07 Operational History & Roadmap** — accepted historical checkpoints, outstanding auth verification and roadmap.

The explorer presently contains **62 main stages** and **208 inner checkpoints**, including deeper decision details, plus **11 system-to-system links**.

## Interaction guide

- Click one of the seven colour-coded system cards to open its process.
- Click a process stage to reveal its internal checkpoints.
- Click an internal checkpoint to reveal deeper details when available.
- From a stage's details panel, choose **Next** to follow the main workflow or a linked process.
- The side panel provides **cross-system links**, for example F03 ↔ F05 or F04 ↔ F06.
- Drag the canvas to pan, use the mouse wheel or zoom controls to zoom, and use **Fit** for a whole-map view.
- Search across all 270 nested/process checkpoints with **Ctrl/Cmd + K**.
- Share a selected stage with its deep link (for example `/#F06.8`).
- Download the complete documented structure with **Export JSON**.

The **Release path** shortcut demonstrates:

`Explicit LIVE approval (F06.8) → LIVE deployment (F06.9) → Audit, rollback & monitoring (F06.10)`.

These are explanatory process nodes only. This site **never triggers deployment, licensing, authentication or customer data writes**.

## Source layout

```
index.html              Architecture Explorer entry point
architecture.css        Responsive controls, cards and canvas styling
architecture-app.js     Navigation, graph, pan/zoom, drill-down, search
architecture-data.js    Structured seven-flow reference data
business-flow.html      Original business diagram, preserved byte-for-byte
client.html             Existing client experience, referencing business-flow.html
admin.html              Existing setup preview, retained
vercel.json             Routes for all views
```

## Status and release policy

Statuses such as *Verified baseline* or *Frozen checkpoint* describe historical acceptance reports, not real-time system state. The referenced 29 September 2026 handover reported accepted CRM and iThynk TEST/DEMO baselines, with the **new email/password authentication enhancement still awaiting controlled end-to-end verification**. Recheck fresh Control Room evidence before changing this status.

Universal Thynkverse progression remains:

`DEV/BUILD → TEST → VERIFY → DEMO/PILOT → VERIFY → LIVE`

Separate authorization is required before DEMO and LIVE. A cosmetic UI change may qualify for a controlled fast-track only after verification and approval. No deployment occurs by merely browsing this atlas.

## Local preview

Serve the directory with a simple static web server (for example `python -m http.server 8080`) and open `http://localhost:8080/`. A static Vercel deployment works without any database keys or environment variables.

## Architecture extension

Edit `architecture-data.js` to add or revise a `flows[].stages[]` node. Nested `children` become expandable inner checkpoints. Use stable flow IDs `F01` through `F07`. IDs for steps are automatically assigned by position (for example `F06.8`). Keep the owner, current status and evidence caveat accurate; do not expose secret keys, personal client data or real production tokens in this public repository.

## Safety during migration

The prior homepage was moved intact to `business-flow.html`. The only necessary change to the client page was changing the iframe source from `/` to `/business-flow.html`, so client-specific flow interactions continue to use the historical Cytoscape engine. `admin.html` was not modified. Review/test the branch and client route before merging into the deployed default branch.
