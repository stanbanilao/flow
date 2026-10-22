/* THYNKVERSE FLOW — ADDITIVE ARCHITECTURE DETAIL, v2.0.
 * Historical handovers are documentary evidence, not live environment verification.
 * This file adds missing architecture areas without renumbering accepted v1 process IDs.
 */
(function(){
"use strict";
const A=window.THYNKVERSE_ARCH;
if(!A||!Array.isArray(A.flows))return;
A.version="2.0.0";
A.builtDate="2026-10-22";
A.referenceDate="2026-10-21";
A.disclaimer="Reference architecture, not live telemetry. Statuses are historical or proposed. Do not promote TEST, DEMO or LIVE by following this diagram.";
A.sources=[
 {title:"Master Control Room 4.0 Handover",date:"2026-09-29",type:"Historical"},
 {title:"CRM Workspace 8.0 to 9.0 Handover",date:"2026-10-21",type:"Recent handover"},
 {title:"Flow business diagram",date:"2026-09-16",type:"Original source preserved"}
];
const c=(title,desc,children=[])=>({title,desc,children});
const stage=(title,desc,children,status="reference",links=[])=>({title,desc,children,status,links});
function put(id,items){const f=A.flows.find(x=>x.id===id);if(f)f.stages.push(...items)}
put("F01",[
 stage("Business offerings vs software products","Separate Debt Review, Debt Removal, Mediation and Thrives from licensing products such as CRM, iThynk and Chatto.",[
 c("Business offering catalogue","Use company-configured offerings for employee work and CRM sales, not as standalone ProductCodes."),
 c("Software product catalogue","Super Control registers approved ProductCode and ModelCode pairs."),
 c("Explicit mapping","Associate offerings with allowed workflow without falsely granting software entitlement.")
 ],"standard",["F02.2","F03.5"]),
 stage("Portfolio change ownership","Each product team owns its execution, while the Control Room coordinates shared contracts and release gates.",[
 c("Specialist impact review","CRM, Super Control, iThynk, Chatto, Stride or other impacted product."),
 c("Shared contract review","CompanyID, identity, release channel, job routing, domain and data boundaries."),
 c("Change authority","Control Room confirms readiness and permission to move between environments."),
 c("Evidence ledger","No claim of completed testing without actual test records.")
 ],"standard",["F06.1","F07.1"])
]);
put("F02",[
 stage("Lead Gen qualification and Sales handoff","Historical target flow: qualified lead progresses to assigned Sales Agent and the accepted Submit Sale action.",[
 c("Lead capture","Lead Gen user records approved contact and provenance through a future agreed interface."),
 c("Qualification","Check lead suitability and completeness before assignment."),
 c("Assignment","Route to the authorised Sales Agent or queue."),
 c("Stable LeadID","Keep original LeadID across assignment; do not create SaleID at qualification."),
 c("Existing Sales Workspace","Create SaleID only after the official Submit Sale action.")
 ],"planned",["F04.10","F02.4"]),
 stage("Supervisor reporting and Main Focus","Planned CRM 9.0 descriptive reporting across Lead Gen and Sales Agents without altering access rights.",[
 c("Load staff rosters","Read LeadGen and SalesAgents according to existing access and team scope."),
 c("Main Focus filter","Classify primary selling focus; this is descriptive metadata, not permission."),
 c("Call and disposition counts","Do not treat a disposition as a sale; show calls with missing dispositions distinctly."),
 c("Actual sales results","Calculate sold products from SalesTracker.ProductType, not Main Focus."),
 c("Communications workflow","Preserve supervisor WhatsApp approvals and associated Chatto integration.")
 ],"planned",["F03.10","F04.10","F04.11","F07.9"])
]);
put("F03",[
 stage("Main Focus is NOT authorization","Supervisor/Main Focus is a descriptive roster field. Super Control and StaffAssignments remain the access authorities.",[
 c("Read roster label","Permitted values come from company offerings or Multi-Product / Not Assigned."),
 c("Filter dashboard","Filter displayed employees and totals only."),
 c("Keep permissions unchanged","Never infer, grant or revoke product or workspace access from MainFocus."),
 c("Write scope","Authorized Supervisor changes descriptive label only; Company Admin retains staff enrollment.")
 ],"standard",["F02.11","F07.9"])
]);
put("F04",[
 stage("Thynkly / Dialog Connect reporting","Preserve the existing phone activity and link-code integration contracts without inventing dialer privileges.",[
 c("Thynkly activity events","TEST extension tracks calls and recorded dispositions separately."),
 c("Supervisor aggregation","Display calls, results, incomplete disposition categories and correct denominators."),
 c("Dialog Connect mapping","Confirm API permission, webhook contract and stable employee/link-code mapping before LIVE."),
 c("Lead transfer planned","Future qualified leads remain distinct from sales until Sales Workspace submission.")
 ],"pending",["F02.10","F02.11"]),
 stage("Chatto / WhatsApp request contract","CRM communications requests are separate from iThynk AutomationJobs.",[
 c("CRM request queue","Use WhatsAppRequests for permitted message requests."),
 c("Supervisor approval","Retain existing supervisor review and approval workflow."),
 c("Chatto execution","Send only when approved and properly entitled."),
 c("Delivery audit","Record result and exception evidence separately from CRM sale status.")
 ],"reference",["F05.10","F02.11"]),
 stage("ThynkSign document delivery","Represent e-signature integration as a separate contract requiring current LIVE verification.",[
 c("Document request","Create through authorised business workflow."),
 c("Signature tracking","Correlate approved client/document identity."),
 c("Status reconciliation","Update only through verified integration policy."),
 c("Environment confirmation","Verify current ThynkSign status before calling production ready.")
 ],"pending",["F02.5","F06.4"])
]);
put("F05",[
 stage("Chatto approved communication","Do not mix supervisor WhatsApp requests into the iThynk IDOCS_PROFILE_SYNC job queue.",[
 c("CRM user requests a template","Choose a permissible approved WhatsApp message."),
 c("Supervisor review","Accept/reject with current permission enforcement."),
 c("Chatto route and template","Use authorised Chatto connector where available."),
 c("Delivery / escalation","Return result to communications monitoring without false success claims.")
 ],"reference",["F04.11","F03.5"])
]);
put("F06",[
 stage("Fast-track and universal sync guards","Lower-risk change classification does not constitute permission to bypass TEST or promote LIVE.",[
 c("Class B UI/performance","TEST first; confirm business data, access and outputs are unchanged."),
 c("DEMO smoke","Use same accepted candidate and explicitly permitted promotion."),
 c("LIVE permission","Even a fast-track change needs deployment authority."),
 c("Class C documentation","Non-runtime content may sync without a business-cycle release only after scope approval.")
 ],"standard",["F01.2"])
]);
put("F07",[
 stage("CRM 9.0 Supervisor redesign planning","The 21 Oct handover calls for READ-ONLY → DESIGN → APPROVAL → TEST, preserving CRM workspaces and employee authority.",[
 c("Current implementation review","Supervisor, Company Admin, LeadGen, SalesAgents and relevant API routes."),
 c("Main Focus proposal","Nullable descriptive roster metadata, not workspace permission."),
 c("Read-only comparison","Verify field/schema reality before creating any list columns."),
 c("Design approval","Owner reviews screen design before TEST implementation."),
 c("Controlled acceptance","Calls/dispositions, filtering, team scopes, ProductType and access unchanged.")
 ],"planned",["F02.11","F03.10","F04.10"])
]);
A.stageLinks=[
 ["F01.4","F03.5","Licensing authority"],["F01.6","F06.8","Explicit go / no-go"],
 ["F01.7","F06.2","Private source build"],
 ["F02.1","F03.1","Authenticate"],
 ["F02.3","F04.4","Unique record check"],
 ["F02.4","F05.1","AutomationJob"],
 ["F02.5","F04.12","Signed docs"],
 ["F02.7","F04.4","Payments history"],
 ["F02.10","F04.10","Lead activity"],
 ["F02.11","F04.11","Communication approvals"],
 ["F03.4","F05.2","Isolation tuple"],
 ["F03.5","F05.3","Licence / device"],
 ["F03.7","F04.2","Handoff runtime"],
 ["F03.9","F07.5","Auth checkpoint"],
 ["F03.10","F02.11","Descriptive label only"],
 ["F04.5","F05.6","Write-back API"],
 ["F04.6","F05.5","iDocs profile"],
 ["F04.10","F02.10","Qualified lead"],
 ["F04.11","F05.10","WhatsApp queue"],
 ["F05.7","F07.3","Acceptance evidence"],
 ["F05.8","F06.7","Frozen DEMO"],
 ["F06.2","F04.1","Exact source SHA"],
 ["F06.4","F03.9","Identity regression"],
 ["F06.5","F01.6","Checkpoint authority"],
 ["F06.8","F06.9","LIVE authorization"],
 ["F06.9","F06.10","Monitor deployment"],
 ["F06.10","F07.1","Audit record"],
 ["F07.8","F01.8","Universal handover"],
 ["F07.9","F02.11","Supervisor proposal"]
].map(([from,to,label])=>({from,to,label}));
A.decisionBranches={
 "F02.3":[
  {label:"DUPLICATE",type:"no",title:"Block sale and show conflict",desc:"Stop partial writes and return actionable duplicate evidence.",to:"F02.2"},
  {label:"UNIQUE",type:"yes",title:"Proceed to Submit Sale",desc:"Accepted uniqueness constraints pass; continue through existing sale constructor.",to:"F02.4"}
 ],
 "F03.5":[
  {label:"AUTHORIZED",type:"yes",title:"Continue access policy",desc:"Entitlement and licence checks pass for exact company and environment.",to:"F03.6"},
  {label:"DENIED",type:"no",title:"Fail closed",desc:"No normal CRM/worker session when licence or entitlement fails.",to:"F03.8"}
 ],
 "F03.9":[
  {label:"VALID",type:"yes",title:"Activate employee",desc:"Verified token, identity and company policies permit INVITED to ACTIVE.",to:"F03.7"},
  {label:"INVALID",type:"no",title:"Remain blocked",desc:"Do not activate on expired/invalid invitation or user/domain mismatch.",to:"F03.2"}
 ],
 "F05.2":[
  {label:"MATCH",type:"yes",title:"Accept exact job claim",desc:"Company, ProductCode, ModelCode, Environment, Target, Status and Type match.",to:"F05.4"},
  {label:"MISMATCH",type:"no",title:"Ignore / reject job",desc:"No fallback, cross-company processing or automatic routing correction.",to:"F05.9"}
 ],
 "F06.4":[
  {label:"PASS",type:"yes",title:"Checkpoint TEST evidence",desc:"Confirm the verified candidate and capture acceptance artifacts.",to:"F06.5"},
  {label:"FAIL",type:"no",title:"STOP and correct in DEV",desc:"No promotion from a failed TEST verification.",to:"F06.2"}
 ],
 "F06.8.2":[
  {label:"YES — APPROVED",type:"yes",title:"Authorize exact LIVE candidate",desc:"Record approver, scope, timestamp, verified fingerprint and rollback conditions.",to:"F06.9"},
  {label:"NO — REJECTED",type:"no",title:"Stop and remediate",desc:"Retain current LIVE release. Correct, retest and reapprove through the controlled sequence.",to:"F06.4"}
 ],
 "F06.9":[
  {label:"HEALTHY",type:"yes",title:"Verify post-deploy checks",desc:"Confirmed environment, access, smoke tests and monitoring records.",to:"F06.10"},
  {label:"FAILED",type:"no",title:"Abort / rollback",desc:"Activate the approved incident/rollback plan; do not assume schemas are reversible.",to:"F06.10"}
 ]
};
A.flowFamilies=[
 {title:"Company and authority",ids:["F01","F03"]},
 {title:"Operational delivery",ids:["F02","F05"]},
 {title:"Technical foundations",ids:["F04","F06"]},
 {title:"Evidence and future",ids:["F07"]}
];
})();
