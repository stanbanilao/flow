/* Thynkverse Business Structure — mobile-first, shareable, extensible. */
(function(){
"use strict";
const $=id=>document.getElementById(id),p=new URLSearchParams(location.search);
const isClient=p.get("client")==="1",code=(p.get("company")||"MASTER").toUpperCase().replace(/[^A-Z0-9_-]/g,"").slice(0,24);
const KEY="tv-business-structure-v3:"+code,frame=$("businessFrame"),panel=$("filterPanel"),toggle=$("filterToggle"),mask=$("edgeMask");
const clean=(value,max=350)=>String(value??"").replace(/[<>&"'\u0060]/g,"").trim().slice(0,max);
let bridge=null,hideTimer=null,msgTimer=null,includeDraft=true,currentLink="",ready=false;
function notice(t){const x=$("message");x.textContent=t;x.hidden=false;clearTimeout(msgTimer);msgTimer=setTimeout(()=>x.hidden=true,3600)}
function closeFilters(){clearTimeout(hideTimer);panel.classList.remove("open");mask.classList.remove("visible");toggle.setAttribute("aria-expanded","false")}
function delayHide(){clearTimeout(hideTimer);hideTimer=setTimeout(()=>{const active=document.activeElement;if(panel.contains(active)&&["INPUT","TEXTAREA","SELECT"].includes(active.tagName))return delayHide();closeFilters()},6500)}
function openFilters(){panel.classList.add("open");mask.classList.add("visible");toggle.setAttribute("aria-expanded","true");delayHide()}
toggle.onclick=()=>panel.classList.contains("open")?closeFilters():openFilters();
$("closeFilters").onclick=$("panelClose").onclick=mask.onclick=closeFilters;
["pointerdown","keydown","mousemove"].forEach(t=>panel.addEventListener(t,delayHide));
function showInfo(id,d){
 if(!d)return;closeFilters();$("detailType").textContent=d.type||"Process";$("detailTitle").textContent=d.title||id;
 const box=$("detailBody");box.replaceChildren();
 const heading=t=>{const h=document.createElement("h3");h.textContent=t;box.appendChild(h)};
 const text=t=>{const e=document.createElement("p");e.textContent=t||"Not documented yet";box.appendChild(e)};
 heading("What happens");text(d.desc);heading("Why it matters");text(d.why);heading("Responsible owner");text(d.owner);
 for(const key of ["systems","needs"]){
  if(d[key]?.length){heading(key==="systems"?"Systems / tools":"Minimum requirements");for(const value of d[key]){const span=document.createElement("span");span.className="pill";span.textContent=value;box.appendChild(span)}}
 }
 if(d.advice){heading("Advisory note");text(d.advice)}
 if(d.next?.length){heading("Related next steps");for(const next of d.next){
  const n=bridge?.getNodes().find(x=>x.id===next);if(!n)continue;
  const button=document.createElement("button");button.type="button";button.textContent="↗ "+n.title;button.onclick=()=>{bridge.choose(next);showInfo(next,{...n,next:[],systems:[],needs:[]})};box.appendChild(button);
 }}
 if(d.custom&&!isClient){
  heading("Owner-created process");const b=document.createElement("button");b.type="button";b.textContent="Remove this added process";
  b.onclick=()=>{if(window.confirm("Remove this custom node and any custom child nodes?")){bridge.removeProcess(id);saveDraft();$("detailCard").hidden=true;notice("Custom process removed")}};box.appendChild(b);
 }
 $("detailCard").hidden=false;
}
$("detailClose").onclick=()=>$("detailCard").hidden=true;
function modal(id,open){$(id).hidden=!open}
function setParents(){
 if(!bridge)return;
 const list=bridge.getNodes();$("processParent").replaceChildren();
 for(const item of list){const o=document.createElement("option");o.value=item.id;o.textContent=item.id+" — "+item.title;$("processParent").appendChild(o)}
 $("processParent").value="company";
}
function openAdd(){if(isClient||!bridge)return;closeFilters();$("detailCard").hidden=true;$("addForm").reset();setParents();modal("addModal",true);$("processTitle").focus()}
$("addButton").onclick=$("showAdd").onclick=openAdd;
$("closeAdd").onclick=$("cancelAdd").onclick=()=>modal("addModal",false);
$("addForm").onsubmit=event=>{
 event.preventDefault();if(isClient||!bridge)return;
 try{
  const item=bridge.addProcess({title:$("processTitle").value,parent:$("processParent").value,cat:$("processCategory").value,desc:$("processDesc").value,owner:$("processOwner").value,systems:$("processSystems").value,needs:$("processNeeds").value});
  saveDraft();modal("addModal",false);bridge.choose(item.id);notice("Process added and stored as a browser draft");
 }catch(e){notice(e.message||"Failed to add process")}
};
function saveDraft(){
 if(isClient||!bridge)return;const nodes=bridge.customNodes();
 try{localStorage.setItem(KEY,JSON.stringify({version:3,nodes}))}catch(e){notice("Storage unavailable; export JSON to save your draft")}
 setCount();
}
function setCount(){const n=bridge?.customNodes().length||0;$("draftCount").textContent=n+" custom process"+(n===1?"":"es")+" added"}
function exportDraft(){
 if(!bridge)return;
 const body={kind:"THYNKVERSE_BUSINESS_STRUCTURE",version:3,exportedAt:new Date().toISOString(),company:code,nodes:bridge.customNodes()};
 const url=URL.createObjectURL(new Blob([JSON.stringify(body,null,2)],{type:"application/json"}));
 const a=document.createElement("a");a.href=url;a.download="THYNKVERSE-Business-Structure-"+code+".json";document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);notice("Structure JSON exported");
}
$("exportButton").onclick=exportDraft;
$("importButton").onclick=()=>{if(!isClient)$("importFile").click()};
$("importFile").onchange=async event=>{
 if(isClient||!bridge)return;const f=event.target.files[0];event.target.value="";if(!f)return;
 if(f.size>600000){notice("Import is too large");return}
 try{
  const obj=JSON.parse(await f.text()),nodes=Array.isArray(obj)?obj:obj.nodes;
  if(!Array.isArray(nodes)||nodes.length>120)throw Error("Invalid JSON structure");
  let n=0;for(const item of nodes)try{bridge.addProcess(item,true);n++}catch(e){}
  bridge.fit();saveDraft();closeFilters();notice(n+" processes imported");
 }catch(e){notice(e.message||"Could not import JSON")}
};
function encode(items){
 const bytes=new TextEncoder().encode(JSON.stringify(items));let binary="";
 for(let i=0;i<bytes.length;i++)binary+=String.fromCharCode(bytes[i]);
 return btoa(binary).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function decode(raw){
 if(!raw||raw.length>10000)throw Error("Invalid shared diagram");
 const bin=atob(raw.replace(/-/g,"+").replace(/_/g,"/"));const bytes=new Uint8Array(bin.length);
 for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
 const arr=JSON.parse(new TextDecoder().decode(bytes));
 if(!Array.isArray(arr)||arr.length>120)throw Error("Shared diagram invalid");return arr;
}
function shareURL(){
 const url=new URL("/business-structure",location.origin);url.searchParams.set("client","1");
 const name=clean($("clientName").value,100);if(name)url.searchParams.set("name",name);
 const draft=bridge?.customNodes()||[];
 if(includeDraft&&draft.length)url.searchParams.set("d",encode(draft));
 return url.toString();
}
function refreshShare(){
 if(isClient)return;currentLink=shareURL();$("shareUrl").value=currentLink;
 const tooLong=currentLink.length>3900;$("copyShare").disabled=tooLong;
 const count=bridge?.customNodes().length||0;
 $("shareStatus").textContent=tooLong?"The custom diagram link is too long. Export JSON or select Base structure only.":(includeDraft&&count?count+" custom processes included in this link.":"Standard Business Structure only.");
 $("shareBase").textContent=includeDraft?"Base structure only":"Include additions";
}
$("shareButton").onclick=()=>{if(isClient)return;closeFilters();includeDraft=true;modal("shareModal",true);refreshShare()};
$("closeShare").onclick=()=>modal("shareModal",false);
$("shareBase").onclick=()=>{includeDraft=!includeDraft;refreshShare()};
$("clientName").oninput=refreshShare;
$("copyShare").onclick=async()=>{
 if(!currentLink||$("copyShare").disabled)return;
 try{
  if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(currentLink);
  else{$("shareUrl").select();document.execCommand("copy")}
  notice("Client-only Business Structure link copied");
 }catch(e){$("shareUrl").focus();$("shareUrl").select();notice("Select and copy this link manually")}
};
$("fitButton").onclick=()=>bridge?.fit();
$("panelFit").onclick=()=>{bridge?.fit();closeFilters()};
$("viewSelect").onchange=e=>{bridge?.setView(e.target.value);closeFilters();$("detailCard").hidden=true};
$("categorySelect").onchange=e=>{bridge?.setCategory(e.target.value);closeFilters();$("detailCard").hidden=true};
$("findProcess").oninput=e=>bridge?.search(e.target.value);
$("findProcess").onkeydown=e=>{if(e.key==="Enter"){e.target.blur();closeFilters()}};
$("editLayout").onclick=()=>{if(isClient||!bridge)return;const next=!bridge.isEditing();bridge.setEditing(next);$("editLayout").textContent=next?"Lock layout":"Edit layout";closeFilters()};
$("resetLayout").onclick=()=>{if(isClient||!bridge)return;if(window.confirm("Reset diagram positions? New custom processes remain.")){bridge.resetLayout();closeFilters();notice("Layout reset")}};
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeFilters();modal("addModal",false);modal("shareModal",false);$("detailCard").hidden=true}});
["addModal","shareModal"].forEach(id=>$(id).addEventListener("pointerdown",e=>{if(e.target===$(id))modal(id,false)}));
frame.onload=()=>{
 try{
  bridge=frame.contentWindow.FlowBusinessBridge;
  if(!bridge?.ready)throw Error("Business diagram could not initialize");
  bridge.onSelect=showInfo;
  let saved=[];
  if(isClient&&p.get("d"))saved=decode(p.get("d"));
  else if(!isClient)saved=JSON.parse(localStorage.getItem(KEY)||"{}").nodes||[];
  if(Array.isArray(saved))for(const x of saved)try{bridge.addProcess(x,true)}catch(e){}
  bridge.fit();setCount();
  try{frame.contentDocument.addEventListener("pointerdown",closeFilters,{passive:true})}catch(e){}
  ready=true;
 }catch(e){notice("Unable to load shared diagram: "+(e.message||"Refresh page"))}
};
if(isClient){
 document.body.classList.add("share-only");const name=clean(p.get("name"),100);
 $("pageTitle").textContent=name?name+" · Business Structure":"Business Structure";
 $("subtitle").textContent="Client diagram · View only";
}
window.__businessStructureTest=Object.freeze({getReady:()=>ready,getPanelOpen:()=>panel.classList.contains("open"),isClient:()=>isClient,getCustomCount:()=>bridge?.customNodes().length||0});
})();
