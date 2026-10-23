/* FLOW Studio owner tools — preserve existing local drafts and client-only share links. */
(function(){
"use strict";
const S=window.FlowStudio;if(!S)throw Error("Flow Studio did not initialize");
const $=id=>document.getElementById(id),params=S.params,client=S.client;
const company=(params.get("company")||"MASTER").toUpperCase().replace(/[^A-Z0-9_-]/g,"").slice(0,24);
const KEY="tv-business-structure-v3:"+company;
let shareDraft=true,currentShare="",loaded=false;
function safe(v,n){return String(v||"").replace(/[<>&"']/g,"").slice(0,n||180).trim()}
function closeDialogs(){$("editorDialog").hidden=true;$("shareDialog").hidden=true}
document.querySelectorAll("[data-dialog-close]").forEach(b=>b.onclick=closeDialogs);
for(const id of ["editorDialog","shareDialog"])$(id).addEventListener("pointerdown",e=>{if(e.target===$(id))closeDialogs()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDialogs()});
function saveDraft(){
 if(client||!S.bridge())return;
 const body={version:3,nodes:S.bridge().customNodes()};
 try{localStorage.setItem(KEY,JSON.stringify(body))}
 catch(e){S.toast("Cannot save in this browser. Use Export JSON instead.")}
}
S.saveDraft=saveDraft;
function makeParents(){
 const select=$("editParent");select.replaceChildren();
 for(const n of S.bridge().getNodes()){
  const opt=document.createElement("option");opt.value=n.id;opt.textContent=n.title;
  select.appendChild(opt);
 }
 if(S.bridge().getNode("company"))select.value="company";
}
function openEditor(){
 if(client||!S.bridge())return;
 $("editorForm").reset();makeParents();S.closeDrawer();$("editorDialog").hidden=false;$("editName").focus();
}
$("addOpen").onclick=$("panelAdd").onclick=openEditor;
$("editorForm").onsubmit=e=>{
 e.preventDefault();if(client||!S.bridge())return;
 const input={
  title:$("editName").value,
  parent:$("editParent").value,cat:$("editCategory").value,desc:$("editDescription").value,
  owner:$("editOwner").value,systems:$("editSystems").value,needs:$("editNeeds").value
 };
 try{
  const n=S.bridge().addProcess(input);
  saveDraft();closeDialogs();S.switchMode("business");S.bridge().select(n.id);
  S.reveal("business",n.id);S.toast("New connected process saved as a local draft");
 }catch(err){S.toast(err.message||"Could not add this process")}
};
function exportDraft(){
 if(client||!S.bridge())return;
 const payload={kind:"THYNKVERSE_BUSINESS_STRUCTURE",version:4,company,exportedAt:new Date().toISOString(),nodes:S.bridge().customNodes()};
 const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
 const a=document.createElement("a");a.href=url;a.download="Thynkverse-Business-Structure-"+company+"-draft.json";
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),750);S.toast("Custom process JSON exported");
}
$("exportDraft").onclick=exportDraft;
$("importDraft").onclick=()=>{if(!client)$("importFile").click()};
$("importFile").onchange=async e=>{
 if(client||!S.bridge())return;
 const f=e.target.files?.[0];e.target.value="";if(!f)return;
 if(f.size>450000){S.toast("The selected file is too large");return}
 try{
  const data=JSON.parse(await f.text()),arr=Array.isArray(data)?data:data.nodes;
  if(!Array.isArray(arr)||arr.length>120)throw Error("Invalid custom process JSON");
  let count=0;
  for(const node of arr){try{S.bridge().addProcess(node);count++}catch(err){}}
  saveDraft();S.toast(count+" process nodes imported");
 }catch(err){S.toast(err.message||"Import failed")}
};
function encode(items){
 const array=new TextEncoder().encode(JSON.stringify(items));let string="";
 for(let i=0;i<array.length;i++)string+=String.fromCharCode(array[i]);
 return btoa(string).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function decode(raw){
 if(typeof raw!=="string"||raw.length>10000)throw Error("Invalid shared link");
 const binary=atob(raw.replace(/-/g,"+").replace(/_/g,"/"));
 const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
 const nodes=JSON.parse(new TextDecoder().decode(bytes));
 if(!Array.isArray(nodes)||nodes.length>120)throw Error("Invalid shared node data");
 return nodes;
}
function createShare(){
 const u=new URL("/studio",location.origin);u.searchParams.set("client","1");
 if(company!=="MASTER")u.searchParams.set("company",company);
 const name=safe($("shareName").value,100);if(name)u.searchParams.set("name",name);
 const nodes=S.bridge()?.customNodes()||[];
 if(shareDraft&&nodes.length)u.searchParams.set("d",encode(nodes));
 currentShare=u.toString();$("shareURL").value=currentShare;
 const tooLong=currentShare.length>3800;$("copyShare").disabled=tooLong;
 $("shareMessage").textContent=tooLong?"This shared link is too large. Export JSON or select the base structure only.":(shareDraft&&nodes.length?nodes.length+" custom nodes are included in the link.":"Base Business Structure only.");
 $("toggleShareDraft").textContent=shareDraft?"Base structure only":"Include additions";
}
function openShare(){
 if(client)return;shareDraft=true;$("shareName").value="";
 S.closeDrawer();createShare();$("shareDialog").hidden=false;
}
$("shareOpen").onclick=$("panelShare").onclick=openShare;
$("shareName").oninput=createShare;
$("toggleShareDraft").onclick=()=>{shareDraft=!shareDraft;createShare()};
$("copyShare").onclick=async()=>{
 if($("copyShare").disabled||!currentShare)return;
 try{
  if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(currentShare);
  else{$("shareURL").focus();$("shareURL").select();document.execCommand("copy")}
  S.toast("Business-only client link copied");
 }catch(e){$("shareURL").focus();$("shareURL").select();S.toast("Copy this selected link manually")}
};
$("businessFrame").onload=()=>{
 try{
  const b=$("businessFrame").contentWindow.FlowStudioBusiness;
  if(!b||!b.ready)throw Error("Business diagram bridge was not ready");
  S.setBridge(b);
  let drafts=[];
  if(client&&params.has("d"))drafts=decode(params.get("d"));
  else if(!client){try{drafts=JSON.parse(localStorage.getItem(KEY)||"{}").nodes||[]}catch(err){drafts=[]}}
  if(!Array.isArray(drafts))drafts=[];
  let imported=0;
  for(const item of drafts){try{b.addProcess(item);imported++}catch(err){}}
  b.setFilters("all","all");b.fit();S.renderSearch();
  loaded=true;
  if(drafts.length&&imported!==drafts.length)S.toast("Some custom process nodes could not be restored");
 }catch(err){S.toast("Diagram initialization failed: "+(err.message||"Unknown error"))}
};
window.__flowStudioDiagnostics=Object.freeze({
 isClient:client,ready:()=>loaded,customCount:()=>S.bridge()?.customNodes().length||0,
 getBusinessCamera:()=>S.bridge()?.getCamera()||null,
 getArchitectureCamera:S.getCam,
 getSelected:S.getSelected,getMode:S.getMode,getDrawer:S.getDrawer,counts:S.counts
});
})();