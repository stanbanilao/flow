window.THYNKVERSE_ARCH = {
  "version": "1.0.0",
  "referenceDate": "2026-09-29",
  "builtDate": "2026-10-21",
  "disclaimer": "Historical accepted checkpoints are documented references, not live system monitoring or fresh deployment verification. LIVE remains gated unless explicitly authorized.",
  "flows": [
    {
      "id": "F01",
      "number": "01",
      "title": "Product & Governance",
      "short": "Products, ownership and control",
      "color": "#6478e8",
      "owner": "Master Control Room",
      "summary": "Central architectural authority for the Thynkverse product portfolio, shared contracts, licence controls and change decisions.",
      "links": [
        "F02",
        "F03",
        "F06"
      ],
      "stages": [
        {
          "title": "Product landscape",
          "desc": "Register specialist products and their responsibilities without conflating independent systems.",
          "children": [
            {
              "title": "CRM Workspace",
              "desc": "Sales, Confirmation, Operations, Queries, Collections and management workspaces.",
              "children": []
            },
            {
              "title": "Desktop workers",
              "desc": "iThynk, Chatto, Stride and StatusFlow where applicable.",
              "children": []
            },
            {
              "title": "Shared services",
              "desc": "Super Control, identity, release catalogue and download infrastructure.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F04.1"
          ]
        },
        {
          "title": "Change request intake",
          "desc": "Record why a change is needed, its owner, its impact and its first safe environment.",
          "children": [
            {
              "title": "Business requirement",
              "desc": "Define the user or operational outcome.",
              "children": []
            },
            {
              "title": "Impact statement",
              "desc": "List logic, data, security, integration, UI and release impacts.",
              "children": []
            },
            {
              "title": "Evidence links",
              "desc": "Attach applicable tests, existing architectural decisions and issue references.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F06.1"
          ]
        },
        {
          "title": "Master Control Room decision",
          "desc": "Coordinate standards, sequence, cross-product dependencies and promotion authority.",
          "children": [
            {
              "title": "Preserve accepted work",
              "desc": "Do not rebuild frozen functionality simply to modernize it.",
              "children": []
            },
            {
              "title": "Assign specialist owner",
              "desc": "CRM, Super Control, iThynk or other responsible product.",
              "children": []
            },
            {
              "title": "Define checkpoint",
              "desc": "State PASS, BLOCKED, FROZEN or NOT AUTHORIZED with evidence.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F06.5"
          ]
        },
        {
          "title": "Super Control as authority",
          "desc": "Centralize company isolation, licences, capabilities and device activation in one control plane.",
          "children": [
            {
              "title": "Company identity",
              "desc": "A trusted CompanyID is validated server-side.",
              "children": []
            },
            {
              "title": "Access policy",
              "desc": "Entitlement, product/model, environment and role checks.",
              "children": []
            },
            {
              "title": "Device policy",
              "desc": "Apply where a desktop application requires installation/device activation.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F03.5",
            "F05.3"
          ]
        },
        {
          "title": "Universal contract",
          "desc": "Keep identifiers and release state consistent across services.",
          "children": [
            {
              "title": "Identity contract",
              "desc": "CompanyID + ProductCode + ModelCode.",
              "children": []
            },
            {
              "title": "Environment contract",
              "desc": "TEST, DEMO and LIVE must not silently fall back.",
              "children": []
            },
            {
              "title": "Release contract",
              "desc": "Version, ReleaseChannel, capabilities, licence and download state.",
              "children": []
            },
            {
              "title": "Device context",
              "desc": "DeviceID or InstallationID where relevant.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F03.4",
            "F05.2"
          ]
        },
        {
          "title": "Release authority",
          "desc": "Master Control owns explicit progression between verified environments.",
          "children": [
            {
              "title": "DEV to TEST",
              "desc": "Use controlled isolated deployment.",
              "children": []
            },
            {
              "title": "TEST to DEMO",
              "desc": "Checkpoint and obtain explicit permission.",
              "children": []
            },
            {
              "title": "DEMO to LIVE",
              "desc": "Verify DEMO and request separate LIVE authorization.",
              "children": []
            }
          ],
          "status": "gate",
          "links": [
            "F06.8"
          ]
        },
        {
          "title": "Source and customer delivery",
          "desc": "Protect private source while making approved customer installers available.",
          "children": [
            {
              "title": "Private product repo",
              "desc": "Code and build configuration stay private.",
              "children": []
            },
            {
              "title": "Compiled distribution",
              "desc": "Only approved compiled installers go to the Download repository.",
              "children": []
            },
            {
              "title": "Activation",
              "desc": "Successful usage remains governed by Super Control.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F04.1",
            "F06.2"
          ]
        },
        {
          "title": "Document and hand over",
          "desc": "Make every decision recoverable by the next specialist chat or maintainer.",
          "children": [
            {
              "title": "Time-stamped checkpoint",
              "desc": "Record current state, blockers and owner.",
              "children": []
            },
            {
              "title": "Versioned reference",
              "desc": "Capture branch, commit, deployment, release, SHA-256 and tests where applicable.",
              "children": []
            },
            {
              "title": "Next action",
              "desc": "Exact safe action and protected do-not-change list.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F07.8"
          ]
        }
      ]
    },
    {
      "id": "F02",
      "number": "02",
      "title": "Business & Client Lifecycle",
      "short": "Sale to service and management",
      "color": "#13a58e",
      "owner": "CRM business operations",
      "summary": "The operational lifecycle from authenticated employee through client intake, sale, confirmation, fulfilment, payments and management oversight.",
      "links": [
        "F03",
        "F04",
        "F05"
      ],
      "stages": [
        {
          "title": "Authenticated employee",
          "desc": "A staff member begins work inside permitted company workspaces.",
          "children": [
            {
              "title": "Sign-in route",
              "desc": "Microsoft SSO or approved email/password once verified.",
              "children": []
            },
            {
              "title": "Role & department",
              "desc": "Control plane binds the correct product and workspaces.",
              "children": []
            },
            {
              "title": "Agent identity",
              "desc": "SalesAgent.AgentEmail must equal the authenticated sales actor.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F03.1",
            "F03.6"
          ]
        },
        {
          "title": "Client intake",
          "desc": "Capture client/product details with purpose-specific field checks and clear consent.",
          "children": [
            {
              "title": "Sales agent assignment",
              "desc": "Use the authenticated agent, not a hard-coded default.",
              "children": []
            },
            {
              "title": "Product selection",
              "desc": "Debt Review and other enabled products only.",
              "children": []
            },
            {
              "title": "Input completeness",
              "desc": "Validate needed client data before saving.",
              "children": []
            }
          ],
          "status": "reference",
          "links": [
            "F04.4"
          ]
        },
        {
          "title": "Duplicate protection",
          "desc": "Check unique client and engagement keys before submitting a new sale.",
          "children": [
            {
              "title": "RSAID uniqueness",
              "desc": "Clients.RSAID must satisfy accepted uniqueness constraints.",
              "children": []
            },
            {
              "title": "EngagementKey uniqueness",
              "desc": "SalesTracker.EngagementKey is unique for the intended engagement.",
              "children": []
            },
            {
              "title": "Fail without side effects",
              "desc": "An invalid sale must not write partial records.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F04.4"
          ]
        },
        {
          "title": "Submit controlled sale",
          "desc": "Create one linked client, SalesTracker record and sale identity.",
          "children": [
            {
              "title": "SaleID",
              "desc": "Use one authoritative generated sale identifier.",
              "children": []
            },
            {
              "title": "Linked records",
              "desc": "Preserve the relationship between client and sale.",
              "children": []
            },
            {
              "title": "AutomationJob",
              "desc": "Queue only when the existing job contract allows it.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F05.1",
            "F04.5"
          ]
        },
        {
          "title": "Confirmation workspace",
          "desc": "Validate required documents, signatures and customer responses.",
          "children": [
            {
              "title": "Verification queue",
              "desc": "Identify missing or invalid information.",
              "children": []
            },
            {
              "title": "Signed pack",
              "desc": "Confirm signed-document outcome where integrated.",
              "children": []
            },
            {
              "title": "Exception routing",
              "desc": "Keep rejected or pending work traceable.",
              "children": []
            }
          ],
          "status": "reference",
          "links": [
            "F05.6"
          ]
        },
        {
          "title": "Operations and Queries",
          "desc": "Send the accepted engagement to the team that fulfils it.",
          "children": [
            {
              "title": "Operations",
              "desc": "Process the accepted case against business rules.",
              "children": []
            },
            {
              "title": "Queries",
              "desc": "Resolve defects or missing evidence.",
              "children": []
            },
            {
              "title": "Escalation",
              "desc": "Track owner, due date and resolution evidence.",
              "children": []
            }
          ],
          "status": "reference",
          "links": [
            "F03.6"
          ]
        },
        {
          "title": "Payments and Collections",
          "desc": "Track payment events, expected debits and collections actions without inventing financial movements.",
          "children": [
            {
              "title": "Expected debit",
              "desc": "Calculate or present from the configured authoritative schedule.",
              "children": []
            },
            {
              "title": "Payment status",
              "desc": "Distinguish scheduled, pending, paid and failed.",
              "children": []
            },
            {
              "title": "Reconciliation",
              "desc": "Tie evidence to authorised records.",
              "children": []
            }
          ],
          "status": "reference",
          "links": [
            "F04.4"
          ]
        },
        {
          "title": "Management oversight",
          "desc": "Give supervisors and management an audit-friendly view of work and bottlenecks.",
          "children": [
            {
              "title": "Work queues",
              "desc": "Understand assignments and aging.",
              "children": []
            },
            {
              "title": "Performance",
              "desc": "Summarise production and exception volume.",
              "children": []
            },
            {
              "title": "Audit trail",
              "desc": "Trace actions to the user and record.",
              "children": []
            }
          ],
          "status": "reference",
          "links": [
            "F07.1"
          ]
        },
        {
          "title": "Close or reopen case",
          "desc": "Finish the engagement with records that remain traceable.",
          "children": [
            {
              "title": "Closure reason",
              "desc": "Approved closure state and date.",
              "children": []
            },
            {
              "title": "Retention",
              "desc": "Follow the applicable company and legal policy.",
              "children": []
            },
            {
              "title": "Reopen control",
              "desc": "Require explicit authorization for subsequent change.",
              "children": []
            }
          ],
          "status": "reference",
          "links": [
            "F07.8"
          ]
        }
      ]
    },
    {
      "id": "F03",
      "number": "03",
      "title": "Logic & Authorization",
      "short": "Identity, roles and fail-closed access",
      "color": "#9972dc",
      "owner": "Super Control / CRM security",
      "summary": "Authentication establishes who the user is; Super Control determines which company, products, workspaces, devices and environments are authorized.",
      "links": [
        "F01",
        "F02",
        "F04",
        "F05",
        "F06"
      ],
      "stages": [
        {
          "title": "Authentication entry",
          "desc": "Preserve Microsoft sign-in and introduce email/password only after controlled acceptance.",
          "children": [
            {
              "title": "Microsoft path",
              "desc": "Microsoft identity is verified through the accepted handoff flow.",
              "children": []
            },
            {
              "title": "Password path",
              "desc": "Supabase Auth handles password identity and recovery.",
              "children": []
            },
            {
              "title": "No separate access engine",
              "desc": "Both sign-in paths must converge on existing control sessions.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F02.1"
          ]
        },
        {
          "title": "Verify identity",
          "desc": "Validate the sign-in response before assigning any company authority.",
          "children": [
            {
              "title": "Token validation",
              "desc": "Check provider authenticity, expiry and audience.",
              "children": []
            },
            {
              "title": "Link auth_user_id",
              "desc": "Link the verified Supabase Auth identity to the Control company user.",
              "children": []
            },
            {
              "title": "Reject mismatches",
              "desc": "Unknown identities must not become authorized employees.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F04.3"
          ]
        },
        {
          "title": "Approved company email domain",
          "desc": "Require an approved company domain for the appropriate CompanyID.",
          "children": [
            {
              "title": "Authoritative mapping",
              "desc": "Read control_company_domains rather than trusting browser claims.",
              "children": []
            },
            {
              "title": "Normalized email",
              "desc": "Use the same normalized work email across systems.",
              "children": []
            },
            {
              "title": "Reject unapproved domain",
              "desc": "Fail closed; do not auto-assign a CompanyID.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F01.5"
          ]
        },
        {
          "title": "Company and environment contract",
          "desc": "Bind identity and request to the exact authorised company and release environment.",
          "children": [
            {
              "title": "CompanyID",
              "desc": "Must match an authoritative control record.",
              "children": []
            },
            {
              "title": "Environment",
              "desc": "TEST, DEMO or LIVE is explicit and isolated.",
              "children": []
            },
            {
              "title": "Product/model",
              "desc": "Match the requested entitlement, product and model.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F01.5",
            "F05.2"
          ]
        },
        {
          "title": "Licence and entitlement",
          "desc": "Super Control checks product access and relevant active licence state.",
          "children": [
            {
              "title": "CRM / BASE entitlement",
              "desc": "Required capability for CRM sessions.",
              "children": []
            },
            {
              "title": "Desktop licence",
              "desc": "Version, device and capability checks where needed.",
              "children": []
            },
            {
              "title": "Revocation",
              "desc": "Deny immediately when licence is absent or revoked.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F01.4",
            "F05.3"
          ]
        },
        {
          "title": "Roles and workspace policy",
          "desc": "Enforce department, workspace and product permission using control-plane records.",
          "children": [
            {
              "title": "ACTIVE user only",
              "desc": "INVITED or inactive users have no normal CRM access.",
              "children": []
            },
            {
              "title": "Workspace grants",
              "desc": "Permit only authorized Sales, Collections, HR etc.",
              "children": []
            },
            {
              "title": "Actor identity",
              "desc": "Keep authenticated SalesAgent email matching intact.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F02.1"
          ]
        },
        {
          "title": "Create control session",
          "desc": "After all gates pass, issue or hand off the accepted CRM session.",
          "children": [
            {
              "title": "control_crm_sessions",
              "desc": "Reuse existing session authority.",
              "children": []
            },
            {
              "title": "Handoff token",
              "desc": "Bind to the exact CRM TEST/DEMO/LIVE runtime.",
              "children": []
            },
            {
              "title": "Cookie and callback",
              "desc": "Check browser acceptance and session endpoint after redirect.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F04.2"
          ]
        },
        {
          "title": "Guard each sensitive action",
          "desc": "A visible button is not a permission; verify server-side on every important action.",
          "children": [
            {
              "title": "Customer write gate",
              "desc": "Enforce company-specific writes enabled where applicable.",
              "children": []
            },
            {
              "title": "Actions and API checks",
              "desc": "Never trust browser-supplied CompanyID or role.",
              "children": []
            },
            {
              "title": "Audit decision",
              "desc": "Record denied and approved actions without leaking secrets.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F04.5",
            "F05.2"
          ]
        },
        {
          "title": "Email/password enhancement checkpoint",
          "desc": "Historical handover shows invitation/activation was still being verified; recheck live state before marking PASS.",
          "children": [
            {
              "title": "Invite one TEST employee",
              "desc": "Company Admin -> Control -> Supabase Auth invitation.",
              "children": []
            },
            {
              "title": "Tokenized activation",
              "desc": "Employee sets their own password; transition INVITED -> ACTIVE after validation.",
              "children": []
            },
            {
              "title": "Convergence test",
              "desc": "Ensure both sign-in methods create the existing CRM session.",
              "children": []
            },
            {
              "title": "Reverify freshness",
              "desc": "Do not treat the September checkpoint as October runtime proof.",
              "children": []
            }
          ],
          "status": "pending",
          "links": [
            "F06.4",
            "F07.5"
          ]
        }
      ]
    },
    {
      "id": "F04",
      "number": "04",
      "title": "Code, Records & Integrations",
      "short": "Where code runs and records live",
      "color": "#2488d6",
      "owner": "Product engineering",
      "summary": "Trace private source, web deployments, control-plane data, CRM SharePoint records, APIs and third-party integrations without confusing their responsibilities.",
      "links": [
        "F03",
        "F05",
        "F06",
        "F07"
      ],
      "stages": [
        {
          "title": "Private source repositories",
          "desc": "GitHub holds application source, history, branches, code reviews and build workflows.",
          "children": [
            {
              "title": "Protected source",
              "desc": "Customer installers must not include the source repository.",
              "children": []
            },
            {
              "title": "Accepted SHA",
              "desc": "Record commit and branch in release checkpoints.",
              "children": []
            },
            {
              "title": "Reviewable changes",
              "desc": "Develop on a branch and compare against the accepted baseline.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F06.2"
          ]
        },
        {
          "title": "Web delivery on Vercel",
          "desc": "Serve CRM, Super Control and portal UIs/APIs through isolated Vercel deployments.",
          "children": [
            {
              "title": "TEST alias",
              "desc": "Bind the intended TEST domain to the accepted TEST runtime.",
              "children": []
            },
            {
              "title": "DEMO alias",
              "desc": "Keep separate DEMO configuration, identity and storage.",
              "children": []
            },
            {
              "title": "LIVE alias",
              "desc": "Do not promote automatically when another stage passes.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F06.3",
            "F06.9"
          ]
        },
        {
          "title": "Supabase control storage",
          "desc": "Use the authoritative control backend for company users, auth, licences, devices and release metadata.",
          "children": [
            {
              "title": "Supabase Auth",
              "desc": "Identity, invitation, password and recovery.",
              "children": []
            },
            {
              "title": "Control data",
              "desc": "CompanyID, domains, entitlements, CRM sessions and device state.",
              "children": []
            },
            {
              "title": "Server credentials",
              "desc": "Never embed privileged service keys in a browser or installer.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F03.2"
          ]
        },
        {
          "title": "SharePoint CRM records",
          "desc": "Maintain accepted CRM lists with schema and uniqueness constraints.",
          "children": [
            {
              "title": "Clients",
              "desc": "The client record with accepted RSAID uniqueness.",
              "children": []
            },
            {
              "title": "SalesTracker",
              "desc": "Sale linkage and EngagementKey uniqueness.",
              "children": []
            },
            {
              "title": "AutomationJobs",
              "desc": "JobType, WorkerTarget, ProductCode, ModelCode, Environment and processing state.",
              "children": []
            },
            {
              "title": "Environment isolation",
              "desc": "TESTCRM and DEMOCRM remain distinct and scoped.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F02.3",
            "F05.1"
          ]
        },
        {
          "title": "API contracts and webhooks",
          "desc": "Use explicit, auditable API boundaries between CRM, Control and workers.",
          "children": [
            {
              "title": "CRM -> Super Control",
              "desc": "Identity, entitlement and session verification.",
              "children": []
            },
            {
              "title": "CRM -> SharePoint",
              "desc": "Server-approved client, sale and job operations.",
              "children": []
            },
            {
              "title": "Worker -> source system",
              "desc": "Claims, updates and completion must be idempotent.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F03.8",
            "F05.7"
          ]
        },
        {
          "title": "iDocs profile integration",
          "desc": "Authorized worker obtains external profile data and applies accepted write-back rules.",
          "children": [
            {
              "title": "External response",
              "desc": "Handle signed pack, credit report and applicant status.",
              "children": []
            },
            {
              "title": "Failure path",
              "desc": "Preserve an error rather than declaring success.",
              "children": []
            },
            {
              "title": "Approved job only",
              "desc": "Never process a different environment's job.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F05.5"
          ]
        },
        {
          "title": "Microsoft Graph / identity",
          "desc": "Access Microsoft-hosted data through correctly scoped, authorised integration.",
          "children": [
            {
              "title": "Site-scoped permission",
              "desc": "Avoid unnecessary global access.",
              "children": []
            },
            {
              "title": "Microsoft auth",
              "desc": "Use accepted callback and session contracts.",
              "children": []
            },
            {
              "title": "No secret leakage",
              "desc": "Keep tokens and credentials on trusted servers.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F03.1"
          ]
        },
        {
          "title": "Diagnostics and audit evidence",
          "desc": "Connect technical events to releases, user actions and automation jobs.",
          "children": [
            {
              "title": "Correlation IDs",
              "desc": "Track SaleID, JobID or request identifier as appropriate.",
              "children": []
            },
            {
              "title": "Safe logging",
              "desc": "Exclude passwords, tokens and unnecessary client personal data.",
              "children": []
            },
            {
              "title": "Trace regression",
              "desc": "Distinguish authentication failure from environment-mapping failure.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F07.1"
          ]
        },
        {
          "title": "Data ownership and recovery",
          "desc": "Protect authoritative records, migrations and retention decisions.",
          "children": [
            {
              "title": "Single source of truth",
              "desc": "Avoid multiple independent licence or session stores.",
              "children": []
            },
            {
              "title": "Schema migrations",
              "desc": "Change through controlled TEST/DEMO/LIVE gates.",
              "children": []
            },
            {
              "title": "Recovery",
              "desc": "Plan backup and rollback before schema-affecting operations.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F06.10"
          ]
        }
      ]
    },
    {
      "id": "F05",
      "number": "05",
      "title": "Worker & Automation",
      "short": "From queued job to verified write-back",
      "color": "#d99b3e",
      "owner": "iThynk / worker owner",
      "summary": "Isolate background automation by product, company and environment, process only approved jobs, verify write-back and stop safely at each checkpoint.",
      "links": [
        "F02",
        "F03",
        "F04",
        "F06"
      ],
      "stages": [
        {
          "title": "CRM creates AutomationJob",
          "desc": "An accepted sale queues one job with the correct immutable routing fields.",
          "children": [
            {
              "title": "Job creation",
              "desc": "Use the accepted sale-to-job constructor.",
              "children": []
            },
            {
              "title": "Routing metadata",
              "desc": "Include CompanyID, ProductCode, ModelCode and Environment.",
              "children": []
            },
            {
              "title": "No duplicate transactions",
              "desc": "Do not make a second sale or job to hide the first failure.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F02.4",
            "F04.4"
          ]
        },
        {
          "title": "Exact routing gate",
          "desc": "Reject a job whose routing tuple does not match the worker's authorized contract.",
          "children": [
            {
              "title": "Company & environment",
              "desc": "CompanyID and TEST/DEMO/LIVE must be exact.",
              "children": []
            },
            {
              "title": "Product & model",
              "desc": "Match ITHYNK / CRM where used.",
              "children": []
            },
            {
              "title": "Job selection",
              "desc": "Validate WorkerTarget, JobType and JobStatus.",
              "children": []
            },
            {
              "title": "Fail closed",
              "desc": "No cross-company or cross-environment fallback.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F03.4"
          ]
        },
        {
          "title": "Super Control device activation",
          "desc": "A Windows worker can operate only when its applicable licence and device checks pass.",
          "children": [
            {
              "title": "Device identity",
              "desc": "Register and validate intended device/installation.",
              "children": []
            },
            {
              "title": "Entitlement check",
              "desc": "Check capability and version for the exact environment.",
              "children": []
            },
            {
              "title": "Safe inactive state",
              "desc": "A failed activation must not process jobs.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F03.5"
          ]
        },
        {
          "title": "Controlled job lock",
          "desc": "During controlled acceptance, process only the approved JobID and SaleID.",
          "children": [
            {
              "title": "Approved identifiers",
              "desc": "Use the exact authorized controlled transaction.",
              "children": []
            },
            {
              "title": "WorkerTarget PRIMARY",
              "desc": "Do not claim work for another target.",
              "children": []
            },
            {
              "title": "Other jobs ignored",
              "desc": "Keep unrelated queued work untouched.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F07.4"
          ]
        },
        {
          "title": "External profile sync",
          "desc": "Run the permitted iDocs profile operations only after a valid claim.",
          "children": [
            {
              "title": "Fetch applicant profile",
              "desc": "Record the accepted external result.",
              "children": []
            },
            {
              "title": "Credit and document outcomes",
              "desc": "Check CreditScore, SignedPack and CreditReport as applicable.",
              "children": []
            },
            {
              "title": "Retry policy",
              "desc": "Avoid silent duplicate external work.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F04.6"
          ]
        },
        {
          "title": "CRM write-back",
          "desc": "Write only permitted fields to corresponding Client and SalesTracker records.",
          "children": [
            {
              "title": "Client update",
              "desc": "Write actual profile fields for the matching client.",
              "children": []
            },
            {
              "title": "Sale update",
              "desc": "Update the related sale consistently.",
              "children": []
            },
            {
              "title": "Job update",
              "desc": "Transition the authorized AutomationJob with recorded result.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F02.5"
          ]
        },
        {
          "title": "Verify completion",
          "desc": "Confirm final states and log evidence before calling the controlled test successful.",
          "children": [
            {
              "title": "Read after write",
              "desc": "Confirm client/sale/job changes.",
              "children": []
            },
            {
              "title": "Idempotency",
              "desc": "Re-run must not duplicate effects.",
              "children": []
            },
            {
              "title": "Error handling",
              "desc": "Fail visibly and avoid false Completed status.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F04.8"
          ]
        },
        {
          "title": "Stop worker and disable writes",
          "desc": "After accepted controlled testing, freeze the worker and disallow further writes unless authorized.",
          "children": [
            {
              "title": "Worker stopped",
              "desc": "No unapproved queue polling.",
              "children": []
            },
            {
              "title": "Writes OFF",
              "desc": "Respect environment-specific write gate.",
              "children": []
            },
            {
              "title": "Preserve frozen state",
              "desc": "Do not restart DEMO just to tidy up.",
              "children": []
            }
          ],
          "status": "frozen",
          "links": [
            "F06.7"
          ]
        },
        {
          "title": "Recovery and operational alerting",
          "desc": "Plan safe recovery for incomplete jobs without bypassing routing gates.",
          "children": [
            {
              "title": "Claim timeouts",
              "desc": "Reconcile stuck work based on authoritative state.",
              "children": []
            },
            {
              "title": "Auditable retry",
              "desc": "Record reason and exact attempt.",
              "children": []
            },
            {
              "title": "Notify owner",
              "desc": "Surface errors to the responsible product owner.",
              "children": []
            }
          ],
          "status": "planned",
          "links": [
            "F07.7"
          ]
        }
      ]
    },
    {
      "id": "F06",
      "number": "06",
      "title": "Release Environments",
      "short": "DEV → TEST → DEMO → LIVE",
      "color": "#e47455",
      "owner": "Master Control Room / release owner",
      "summary": "The controlled software delivery pipeline with evidence gates, explicit human approval, exact build fingerprints, rollback readiness and post-release monitoring.",
      "links": [
        "F01",
        "F03",
        "F04",
        "F05",
        "F07"
      ],
      "stages": [
        {
          "title": "Change impact classification",
          "desc": "Assess the actual impact, not just the filename that changed.",
          "children": [
            {
              "title": "Class A / controlled",
              "desc": "Business, logic, security, data, integrations, licensing and automation.",
              "children": []
            },
            {
              "title": "Class B / fast-track",
              "desc": "UI or performance changes only when outputs and permissions remain unchanged.",
              "children": []
            },
            {
              "title": "Class C / universal sync",
              "desc": "Non-executable documentation or metadata, where safely applicable.",
              "children": []
            },
            {
              "title": "Uncertain impact",
              "desc": "Default to the full controlled release.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F01.2"
          ]
        },
        {
          "title": "DEV / BUILD",
          "desc": "Build from private source at an exact commit with a reproducible artefact.",
          "children": [
            {
              "title": "Web application",
              "desc": "GitHub commit -> Vercel build -> isolated environment.",
              "children": []
            },
            {
              "title": "Desktop application",
              "desc": "GitHub Actions -> compiled installer/package.",
              "children": []
            },
            {
              "title": "Checksum",
              "desc": "Verify SHA-256 of downloadable artifacts.",
              "children": []
            },
            {
              "title": "Secrets",
              "desc": "Do not package environment secrets or source in customer delivery.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F04.1"
          ]
        },
        {
          "title": "TEST deployment / install",
          "desc": "Install only the TEST build and use TEST-specific control and data.",
          "children": [
            {
              "title": "TEST runtime",
              "desc": "Bind to Super Control TEST and TEST SharePoint/storage.",
              "children": []
            },
            {
              "title": "Fail closed",
              "desc": "No fallbacks to DEMO or LIVE.",
              "children": []
            },
            {
              "title": "Static verification",
              "desc": "Confirm version, commit and environment before operations.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F04.2",
            "F03.4"
          ]
        },
        {
          "title": "TEST verification",
          "desc": "Verify regression, identity, access, transactions and all relevant contracts.",
          "children": [
            {
              "title": "Authentication",
              "desc": "Both applicable sign-in routes and their session handoff.",
              "children": []
            },
            {
              "title": "Controlled transaction",
              "desc": "At most one approved sale/job where the test calls for it.",
              "children": []
            },
            {
              "title": "Environment proof",
              "desc": "Demonstrate TEST records stay in TEST.",
              "children": []
            },
            {
              "title": "Failed checks",
              "desc": "STOP and provide the exact blocker.",
              "children": []
            }
          ],
          "status": "gate",
          "links": [
            "F03.9",
            "F05.7"
          ]
        },
        {
          "title": "TEST evidence checkpoint",
          "desc": "Record what passed and what must remain unchanged before DEMO approval.",
          "children": [
            {
              "title": "Reference lock",
              "desc": "Commit, deployment/run ID and installer SHA-256 if applicable.",
              "children": []
            },
            {
              "title": "PASS/FAIL log",
              "desc": "Evidence, owner, unresolved defects and next action.",
              "children": []
            },
            {
              "title": "Explicit stop",
              "desc": "No automatic promotion to the next environment.",
              "children": []
            }
          ],
          "status": "gate",
          "links": [
            "F01.3",
            "F07.8"
          ]
        },
        {
          "title": "Explicit DEMO/PILOT approval",
          "desc": "Request a separate go-ahead to test the accepted version with isolated DEMO resources.",
          "children": [
            {
              "title": "Approved candidate",
              "desc": "Reuse accepted TEST functionality; don't rebuild.",
              "children": []
            },
            {
              "title": "DEMO bindings",
              "desc": "DEMO CompanyID, Control, storage and credentials.",
              "children": []
            },
            {
              "title": "Authorization",
              "desc": "Approver confirms the precise release stage.",
              "children": []
            }
          ],
          "status": "gate",
          "links": [
            "F01.6"
          ]
        },
        {
          "title": "DEMO verification / freeze",
          "desc": "Prove the accepted release works in the DEMO environment, then freeze it.",
          "children": [
            {
              "title": "Function and access",
              "desc": "Focused regression on exact deployed version.",
              "children": []
            },
            {
              "title": "Controlled worker/sale",
              "desc": "Only the authorized DEMO transaction.",
              "children": []
            },
            {
              "title": "Freeze",
              "desc": "Stop worker/writes after verification where required.",
              "children": []
            },
            {
              "title": "Checkpoint",
              "desc": "Record PASS plus unresolved pre-LIVE changes.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F05.8",
            "F07.4"
          ]
        },
        {
          "title": "Explicit LIVE approval",
          "desc": "LIVE is a separate human authorization gate, never inferred from DEMO PASS.",
          "children": [
            {
              "title": "Acceptance evidence",
              "desc": "Review both TEST and DEMO evidence, open issues and protected contracts.",
              "children": []
            },
            {
              "title": "Go / no-go decision",
              "desc": "Record an explicit LIVE decision by the authorized release owner.",
              "children": [
                {
                  "title": "Approver identity",
                  "desc": "Capture who approved, without relying on a UI toggle alone.",
                  "children": []
                },
                {
                  "title": "Scope and timestamp",
                  "desc": "Record what exact release is authorized and when.",
                  "children": []
                }
              ]
            },
            {
              "title": "Immutable release manifest",
              "desc": "Freeze Version, ReleaseChannel, commit/deployment or installer SHA-256.",
              "children": []
            },
            {
              "title": "Preflight & rollback readiness",
              "desc": "Confirm monitoring, rollback target, owner and support window before promotion.",
              "children": []
            }
          ],
          "status": "gate",
          "links": [
            "F01.6",
            "F03.8"
          ]
        },
        {
          "title": "LIVE deployment",
          "desc": "Release only the specific authorized artifact against LIVE-only services.",
          "children": [
            {
              "title": "Web promotion",
              "desc": "Deploy approved build to the LIVE Vercel alias without TEST/DEMO configuration.",
              "children": []
            },
            {
              "title": "Desktop publication",
              "desc": "Publish only approved compiled installer to Download repository.",
              "children": [
                {
                  "title": "Direct download",
                  "desc": "Include version, environment, filename and SHA-256.",
                  "children": []
                },
                {
                  "title": "Super Control release",
                  "desc": "Register the exact artifact and download URL with licence requirements.",
                  "children": []
                }
              ]
            },
            {
              "title": "Verification smoke",
              "desc": "Confirm health, entitlement and critical user journey.",
              "children": []
            },
            {
              "title": "Abort conditions",
              "desc": "Stop or roll back on unacceptable failure.",
              "children": []
            }
          ],
          "status": "gate",
          "links": [
            "F04.2",
            "F01.7"
          ]
        },
        {
          "title": "Audit, rollback & monitoring",
          "desc": "Keep an operational record after LIVE and respond to regressions using pre-agreed triggers.",
          "children": [
            {
              "title": "Deployment audit",
              "desc": "Record release ID, approver, time, artifact fingerprint and tested scope.",
              "children": []
            },
            {
              "title": "Rollback plan",
              "desc": "Document known-good target, database compatibility and safe restore steps.",
              "children": [
                {
                  "title": "Web fallback",
                  "desc": "Restore previous accepted Vercel deployment if safe.",
                  "children": []
                },
                {
                  "title": "Desktop fallback",
                  "desc": "Withdraw the bad release and restore the approved installer channel.",
                  "children": []
                },
                {
                  "title": "Database caution",
                  "desc": "Never assume a destructive schema migration is automatically reversible.",
                  "children": []
                }
              ]
            },
            {
              "title": "Monitoring & alerts",
              "desc": "Watch errors, auth regressions, write failures and automation backlogs.",
              "children": []
            },
            {
              "title": "Incident response",
              "desc": "Escalate, pause writes where applicable and checkpoint corrective action.",
              "children": []
            },
            {
              "title": "Post-release review",
              "desc": "Confirm stability before closing the release record.",
              "children": []
            }
          ],
          "status": "planned",
          "links": [
            "F04.8",
            "F07.1"
          ]
        }
      ]
    },
    {
      "id": "F07",
      "number": "07",
      "title": "Operational History & Roadmap",
      "short": "Evidence, freeze points and next work",
      "color": "#597aa6",
      "owner": "Control Room / product specialists",
      "summary": "A date-stamped historical evidence ledger paired with an explicitly labelled roadmap. This is documentation, not real-time production telemetry.",
      "links": [
        "F01",
        "F03",
        "F04",
        "F05",
        "F06"
      ],
      "stages": [
        {
          "title": "Historical evidence register",
          "desc": "Record why any status is regarded as passed, pending or blocked.",
          "children": [
            {
              "title": "Evidence anchors",
              "desc": "Source commit, deployment ID, workflow run, JobID and SaleID in private control records.",
              "children": []
            },
            {
              "title": "Timestamp and owner",
              "desc": "Reference exact verification time and responsible specialist.",
              "children": []
            },
            {
              "title": "No false live state",
              "desc": "An old handover is not proof of current deployment.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F01.8"
          ]
        },
        {
          "title": "CRM original TEST baseline",
          "desc": "The historical September record reports TEST authentication, sale/automation routing and uniqueness tests as PASS.",
          "children": [
            {
              "title": "Accepted baseline",
              "desc": "Preserve accepted CRM behavior and SharePoint constraints.",
              "children": []
            },
            {
              "title": "Controlled transaction",
              "desc": "One approved TEST sale/job verified.",
              "children": []
            },
            {
              "title": "Frozen checkpoint",
              "desc": "Do not silently modify the approved functional TEST reference.",
              "children": []
            }
          ],
          "status": "verified",
          "links": [
            "F02.4"
          ]
        },
        {
          "title": "iThynk TEST worker acceptance",
          "desc": "The historical worker acceptance reports real-device activation and controlled write-back as PASS.",
          "children": [
            {
              "title": "Worker reference",
              "desc": "iThynk CRM Worker v1.0.8.",
              "children": []
            },
            {
              "title": "iDocs write-back",
              "desc": "Client, sale and job outcome verified.",
              "children": []
            },
            {
              "title": "Safe stop",
              "desc": "Worker stopped and writes disabled after testing.",
              "children": []
            }
          ],
          "status": "frozen",
          "links": [
            "F05.8"
          ]
        },
        {
          "title": "CRM + iThynk DEMO acceptance",
          "desc": "Historical DEMO reports successful controlled sale, exact job processing, isolation and final freeze.",
          "children": [
            {
              "title": "DEMO job lock",
              "desc": "Exact controlled identifiers were required.",
              "children": []
            },
            {
              "title": "No extra jobs",
              "desc": "Unrelated queue jobs were ignored.",
              "children": []
            },
            {
              "title": "No LIVE effect",
              "desc": "Historical DEMO acceptance did not authorize LIVE.",
              "children": []
            }
          ],
          "status": "frozen",
          "links": [
            "F06.7",
            "F05.4"
          ]
        },
        {
          "title": "Email/password enhancement",
          "desc": "At the 29 September handover, real invitation-token activation and normal password login required further verification.",
          "children": [
            {
              "title": "Public activation route",
              "desc": "Route/guard was reported as PASS.",
              "children": []
            },
            {
              "title": "Real invitation token",
              "desc": "Was not yet confirmed at the last documented checkpoint.",
              "children": []
            },
            {
              "title": "Session convergence",
              "desc": "Microsoft and password need the same Control CRM session model.",
              "children": []
            },
            {
              "title": "Freshness review",
              "desc": "Check newer commits/results before advancing this status.",
              "children": []
            }
          ],
          "status": "pending",
          "links": [
            "F03.9",
            "F06.4"
          ]
        },
        {
          "title": "Known UI follow-up",
          "desc": "Record remaining UX defects separately from functional acceptance.",
          "children": [
            {
              "title": "Sales agent default",
              "desc": "Review the historical hard-coded preferred agent issue.",
              "children": []
            },
            {
              "title": "Change classification",
              "desc": "UI-only changes still need TEST verification.",
              "children": []
            },
            {
              "title": "No DEMO cleanup",
              "desc": "Do not alter frozen DEMO without an approved change.",
              "children": []
            }
          ],
          "status": "pending",
          "links": [
            "F02.2"
          ]
        },
        {
          "title": "Product and operational roadmap",
          "desc": "Future enhancements are planning items, not implemented runtime behavior.",
          "children": [
            {
              "title": "Observability dashboard",
              "desc": "Correlate auth, licences, sales and worker progress.",
              "children": []
            },
            {
              "title": "Release catalog",
              "desc": "Provide approved installer manifests and download history.",
              "children": []
            },
            {
              "title": "Product expansion",
              "desc": "Coordinate Chatto, Stride, StatusFlow and Sign against common standards.",
              "children": []
            },
            {
              "title": "Documentation atlas",
              "desc": "Keep this diagram synced with verified sources.",
              "children": []
            }
          ],
          "status": "planned",
          "links": [
            "F01.1",
            "F06.10"
          ]
        },
        {
          "title": "Continuation and handover",
          "desc": "Prepare recoverable checkpoints for each specialist product and next control-room session.",
          "children": [
            {
              "title": "70% approximate context",
              "desc": "Warn and start collecting checkpoints.",
              "children": []
            },
            {
              "title": "90% approximate context",
              "desc": "Strong handover warning before major new work.",
              "children": []
            },
            {
              "title": "Complete handover",
              "desc": "State exact environment, versions, failures, blockers, next action and do-not-change list.",
              "children": []
            },
            {
              "title": "Explicit approval",
              "desc": "Never promote an environment merely because the diagram describes it.",
              "children": []
            }
          ],
          "status": "standard",
          "links": [
            "F01.8"
          ]
        }
      ]
    }
  ],
  "connections": [
    {
      "from": "F01",
      "to": "F02",
      "label": "Governed operating model",
      "type": "main"
    },
    {
      "from": "F02",
      "to": "F03",
      "label": "Authenticated client work",
      "type": "main"
    },
    {
      "from": "F03",
      "to": "F04",
      "label": "Approved records and APIs",
      "type": "main"
    },
    {
      "from": "F04",
      "to": "F05",
      "label": "Job + integration contract",
      "type": "main"
    },
    {
      "from": "F05",
      "to": "F06",
      "label": "Controlled acceptance evidence",
      "type": "main"
    },
    {
      "from": "F06",
      "to": "F07",
      "label": "Audit and release history",
      "type": "main"
    },
    {
      "from": "F01",
      "to": "F06",
      "label": "Approval authority",
      "type": "cross"
    },
    {
      "from": "F03",
      "to": "F05",
      "label": "Entitlement and job isolation",
      "type": "cross"
    },
    {
      "from": "F02",
      "to": "F05",
      "label": "Sale to automation",
      "type": "cross"
    },
    {
      "from": "F04",
      "to": "F07",
      "label": "Diagnostic evidence",
      "type": "cross"
    },
    {
      "from": "F03",
      "to": "F06",
      "label": "Auth regression gate",
      "type": "cross"
    }
  ]
};
