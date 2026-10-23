/* FLOW Studio 4 — unified canvas, glass drawers, real linked architecture definitions. */
(function(){
"use strict";
const $=id=>document.getElementById(id),A=window.THYNKVERSE_ARCH;
if(!A||!Array.isArray(A.flows))throw Error("Architecture data unavailable");
const params=new URLSearchParams(location.search),client=params.get("client")==="1";
const fMap=new Map(),nMap=new Map(),crossMap=new Map(),mapLinks={
 company:["F01.1","F02.1","F04.4"],sales:["F02.2","F02.4","F03.6"],salescomplete:["F02.3","F02.4"],
 payments:["F02.7","F04.4"],collections:["F02.7","F02.8"],products:["F01.9","F02.2"],
 debt:["F02.6","F04.4"],dr1:["F02.6"],dr2:["F02.6"],dr3:["F02.6"],dr4:["F02.6"],dr5:["F02.6","F03.8"],legalroute:["F02.6","F03.8"],
 removal:["F02.6"],remverify:["F02.3"],remaction:["F02.6"],remconfirm:["F02.9"],
 mediation:["F02.6"],medopen:["F02.2"],medcontact:["F04.5"],medoutcome:["F02.9"],
 customercare:["F02.5","F02.6"],carequery:["F02.6"],carestatus:["F02.8"],careescalation:["F03.8"],
 hr:["F03.6"],hronboard:["F03.9"],hrtraining:["F07.8"],hroffboard:["F03.6"],
 it:["F04.1","F04.2"],itsales:["F04.2"],itops:["F04.4"],itdomain:["F03.3","F04.7"],
 thynkverse:["F01.1","F01.4","F06.1"],tvdata:["F04.4","F04.9"],tvauto:["F05.1","F05.2"],tvpeople:["F03.6"]
};
const fPositions={F01:[60,85],F02:[800,85],F03:[1540,85],F04:[60,565],F05:[800,565],F06:[1540,565],F07:[800,1045]};
const states={standard:"STANDARD",verified:"HISTORICAL PASS",reference:"REFERENCE",frozen:"FROZEN",pending:"REVERIFY",planned:"PLANNED",gate:"APPROVAL GATE"};
let bridge=null,selected=null,drawer=null,panelTimer=null,toastTimer=null;
const state={mode:"business",archFlow:null,cam:{scale:.7,tx:0,ty:0},worldWidth:2290,worldHeight:1510,userMoved:false,drag:null};
const V=$("archViewport"),W=$("archWorld"),nodes=$("archNodes"),edges=$("archEdges"),scrim=$("scrim");
const safe=v=>String(v==null?"":v).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
function index(){
 for(const f of A.flows){
  fMap.set(f.id,f);
  const root={id:f.id,flowId:f.id,title:f.title,desc:f.summary,children:f.stages,owner:f.owner,status:"standard",depth:-1,links:f.links||[]};
  nMap.set(root.id,root);
  function rec(n,id,depth,parent){
   n.id=id;n.depth=depth;n.flowId=f.id;n.parent=parent;n.owner=n.owner||f.owner;n.children=n.children||[];
   nMap.set(id,n);n.children.forEach((c,i)=>rec(c,id+"."+(i+1),depth+1,id));
  }
  f.stages.forEach((n,i)=>rec(n,f.id+"."+(i+1),0,f.id));
 }
 for(const x of A.stageLinks||[]){
  if(!nMap.has(x.from)||!nMap.has(x.to))continue;
  for(const [a,b] of [[x.from,x.to],[x.to,x.from]]){
   if(!crossMap.has(a))crossMap.set(a,[]);
   crossMap.get(a).push({id:b,label:x.label});
  }
 }
}
index();
function toast(text){
 const t=$("toast");t.textContent=text;t.classList.add("show");clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>t.classList.remove("show"),2400);
}
function closeDrawer(){
 if(!drawer)return;
 drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");drawer=null;scrim.classList.remove("open");clearTimeout(panelTimer);
}
function resetPanelTimer(){
 clearTimeout(panelTimer);if(drawer===$("controlsDrawer"))panelTimer=setTimeout(closeDrawer,11000);
}
function openDrawer(next){
 if(drawer===next)return;
 closeDrawer();drawer=next;next.classList.add("open");next.setAttribute("aria-hidden","false");scrim.classList.add("open");resetPanelTimer();
}
$("controlsOpen").onclick=()=>drawer===$("controlsDrawer")?closeDrawer():openDrawer($("controlsDrawer"));
$("searchOpen").onclick=()=>{openDrawer($("searchDrawer"));$("searchText").focus();renderSearch()};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeDrawer);
for(const type of ["pointerdown","keydown","mousemove"])$("controlsDrawer").addEventListener(type,resetPanelTimer);
scrim.onclick=closeDrawer;
function setLabels(){
 const arch=state.mode==="architecture",f=fMap.get(state.archFlow);
 $("canvasIndex").textContent=arch?(f?f.number+" / PROCESS FLOW":"02 / SYSTEM ARCHITECTURE"):(client?"CLIENT / BUSINESS STRUCTURE":"01 / BUSINESS STRUCTURE");
 $("canvasTitle").textContent=arch?(f?f.title:"Seven systems. One connected architecture."):(client?params.get("name")||"Business Structure":"One business. Every process connected.");
 $("canvasHint").textContent=arch?"Select a node to reveal its connected subprocesses and decisions.":"Select a box to reveal its explanation and connected architecture.";
 $("goOverview").hidden=!arch||!state.archFlow;
 $("businessControls").hidden=arch;$("architectureControls").hidden=!arch;
 $("statusNote").textContent=client?"Client Business Structure · view only":"Reference architecture · does not operate real systems";
}
function switchMode(mode){
 if(client&&mode==="architecture")return;
 state.mode=mode;
 $("businessPane").hidden=mode!=="business";$("architecturePane").hidden=mode!=="architecture";
 for(const [id,yes] of [["businessMode",mode==="business"],["architectureMode",mode==="architecture"]]){
  $(id).classList.toggle("selected",yes);$(id).setAttribute("aria-pressed",String(yes));
 }
 setLabels();closeDrawer();
 if(mode==="architecture"){drawArchitecture();if(!state.userMoved)requestAnimationFrame(fitArchitecture)}
}
$("businessMode").onclick=()=>switchMode("business");$("architectureMode").onclick=()=>switchMode("architecture");
function wrapSection(name,body){return'<section class="details-section"><h3>'+safe(name)+'</h3>'+body+'</section>'}
function chips(items){
 if(!items?.length)return'<p>Not specified in this reference.</p>';
 return'<div class="detail-tags">'+items.map(x=>'<span class="detail-tag">'+safe(x)+'</span>').join("")+'</div>';
}
function trail(items,label,type){
 return'<div class="flow-trail">'+items.map((n,i)=>{
  const ref=n.id||n;
  return'<button type="button" class="trail-item" data-'+type+'="'+safe(ref)+'"><span class="trail-index">'+safe(label)+' '+String(i+1).padStart(2,"0")+' → '+safe(ref)+'</span><strong>'+safe(n.title)+'</strong><small>'+safe(n.desc||"Open the next connected process")+'</small></button>';
 }).join("")+'</div>';
}
function related(n){
 const all=[...(crossMap.get(n.id)||[]),...(n.links||[]).map(id=>({id,label:"Related architecture"}))],seen=new Set();
 return all.filter(x=>nMap.has(x.id)&&x.id!==n.id&&!seen.has(x.id)&&seen.add(x.id));
}
function detailsBusiness(id){
 const d=bridge?.getNode(id);if(!d)return;
 selected={type:"business",id};$("detailEyebrow").textContent=(d.type||"BUSINESS PROCESS").toUpperCase();
 $("detailTitle").textContent=d.title;$("detailSubtitle").textContent="Business owner · "+(d.owner||"Not assigned");
 let content=wrapSection("What happens",'<p class="description">'+safe(d.desc||"Not yet documented")+'</p>');
 if(d.why)content+=wrapSection("Why it matters",'<p>'+safe(d.why)+'</p>');
 content+=wrapSection("Owner and required inputs",'<p>'+safe(d.owner||"Owner not assigned")+'</p>'+chips(d.needs));
 if(d.systems?.length)content+=wrapSection("Supporting systems",chips(d.systems));
 if(d.advice)content+=wrapSection("Operational note",'<div class="detail-info">'+safe(d.advice)+'</div>');
 const next=(d.next||[]).map(x=>bridge.getNode(x)).filter(Boolean);
 if(next.length)content+=wrapSection("Connected business handoffs",trail(next,"NEXT","business"));
 if(!client){
  const ids=(mapLinks[id]||[]).filter(x=>nMap.has(x));
  if(!ids.length)content+=wrapSection("Architecture connection",'<div class="detail-info">No verified system-architecture mapping has been assigned to this process yet.</div>');
  if(ids.length)content+=wrapSection("Connected system architecture",
   '<p style="font-size:11px;color:var(--fog);line-height:1.6">These controls, systems and rules sit behind the business process. Open any definition without leaving this diagram.</p>'+
   ids.map(x=>{const n=nMap.get(x);return'<button type="button" class="cross-link" data-arch="'+safe(x)+'"><span>'+safe(n.title)+'<small>'+safe(fMap.get(n.flowId).title)+'</small></span><b>'+safe(x)+' ↗</b></button>'}).join(""));
  if(d.custom)content+=wrapSection("Owner-created draft",'<button class="cross-link" data-remove="'+safe(id)+'"><span>Remove custom process<small>Its custom child nodes will be removed too</small></span><b>×</b></button>');
 }
 $("detailContent").innerHTML=content;openDrawer($("detailDrawer"));$("detailContent").scrollTop=0;
}
function detailsArchitecture(id){
 const n=nMap.get(id);if(!n)return;
 selected={type:"architecture",id};const f=fMap.get(n.flowId);
 $("detailEyebrow").textContent=id+" / "+(states[n.status]||"REFERENCE");
 $("detailTitle").textContent=n.title;$("detailSubtitle").textContent=f.title+" · "+(n.owner||f.owner);
 let content=wrapSection("Process definition",'<p class="description">'+safe(n.desc||f.summary)+'</p>');
 content+=wrapSection("Evidence / status",'<div class="detail-info">'+safe(states[n.status]||"REFERENCE")+' — Reference and historical evidence; not current LIVE system monitoring.</div>');
 const children=n.depth===-1?f.stages:n.children||[];
 if(children.length)content+=wrapSection("Expand connected subprocesses",trail(children,"STEP","arch"));
 const decisions=A.decisionBranches?.[id]||[];
 if(decisions.length)content+=wrapSection("◇ Decision branches",'<div class="decision-card"><p class="decision-header">FOLLOW THE APPROVED OR REJECTED PATH</p><div class="branch-list">'+decisions.map(b=>
  '<button type="button" data-arch="'+safe(b.to)+'" class="'+(b.type==="no"?"no":"")+'"><span>'+safe(b.label)+' → '+safe(b.to)+'</span><b>'+safe(b.title)+'</b><small>'+safe(b.desc)+'</small></button>'
 ).join("")+'</div></div>');
 if(n.depth>=0){
  const list=n.parent===n.flowId?f.stages:(nMap.get(n.parent)?.children||[]);
  const at=list.findIndex(x=>x.id===id);
  if(at>=0&&at+1<list.length)content+=wrapSection("Next process",trail([list[at+1]],"NEXT","arch"));
 }
 const links=related(n);
 if(links.length)content+=wrapSection("Cross-system links",links.map(x=>{
  const dest=nMap.get(x.id);return'<button class="cross-link" data-arch="'+safe(x.id)+'"><span>'+safe(dest.title)+'<small>'+safe(x.label)+'</small></span><b>'+safe(x.id)+' ↗</b></button>';
 }).join(""));
 content+='<div class="detail-actions"><button type="button" data-map="'+safe(n.flowId)+'">Open domain process map →</button><button type="button" data-arch="'+safe(n.flowId)+'">Domain overview</button></div>';
 $("detailContent").innerHTML=content;openDrawer($("detailDrawer"));$("detailContent").scrollTop=0;
}
function reveal(type,id){if(type==="business")detailsBusiness(id);else if(!client)detailsArchitecture(id)}
function setBridge(b){bridge=b;bridge.onSelect=id=>reveal("business",id);renderSearch()}
function getBridge(){return bridge}
/* Architecture layout: seven anchored domains or a serpentine process chain. */
function graphNode(n,pos,isDomain){
 const f=fMap.get(n.flowId),label=isDomain?f.stages.length+" PROCESS STAGES":states[n.status]||"REFERENCE";
 return'<button type="button" class="arch-node '+(isDomain?"domain-node":"stage-node")+'" data-arch="'+safe(n.id)+'" style="left:'+pos.x+'px;top:'+pos.y+'px"><div class="node-kicker"><span>'+safe(n.id)+'</span><span class="node-status">'+safe(label)+'</span></div><h3>'+safe(n.title)+'</h3><p>'+safe(isDomain?f.short:n.desc||"Documented process")+'</p>'+
  (isDomain?'<div class="arch-sequence">'+f.stages.slice(0,3).map((s,i)=>'<span>'+String(i+1).padStart(2,"0")+' / '+safe(s.title)+'</span>').join("")+'</div>':"")+
  '<div class="node-footer"><span>'+(isDomain?"Inspect system architecture":(n.children?.length||0)+" inner checks")+'</span><b>Inspect ↗</b></div></button>';
}
function edgePath(a,b){
 const cx=a.x+a.w/2,cy=a.y+a.h/2,ex=b.x+b.w/2,ey=b.y+b.h/2,dx=ex-cx,dy=ey-cy;
 if(Math.abs(dx)>Math.abs(dy)*.78){
  const right=dx>0,ax=right?a.x+a.w:a.x,bx=right?b.x:b.x+b.w,k=Math.max(45,Math.abs(bx-ax)*.36);
  return'M'+ax+','+cy+' C'+(ax+(right?k:-k))+','+cy+' '+(bx-(right?k:-k))+','+ey+' '+bx+','+ey;
 }
 const down=dy>0,ay=down?a.y+a.h:a.y,by=down?b.y:b.y+b.h,k=Math.max(45,Math.abs(by-ay)*.4);
 return'M'+cx+','+ay+' C'+cx+','+(ay+(down?k:-k))+' '+ex+','+(by-(down?k:-k))+' '+ex+','+by;
}
function drawArchitecture(){
 const f=fMap.get(state.archFlow),positions={},links=[];let html="",w,h;
 if(!f){
  w=2290;h=1510;
  for(const flow of A.flows){const [x,y]=fPositions[flow.id],pos={x,y,w:650,h:350};positions[flow.id]=pos;html+=graphNode(nMap.get(flow.id),pos,true)}
  for(const x of A.connections||[])if(positions[x.from]&&positions[x.to])links.push({a:positions[x.from],b:positions[x.to],type:x.type==="cross"?"cross":""});
 }else{
  w=1665;h=Math.max(650,200+Math.ceil(f.stages.length/3)*290);
  f.stages.forEach((n,i)=>{
   const row=Math.floor(i/3),col=row%2?2-i%3:i%3,pos={x:60+col*550,y:135+row*290,w:450,h:181};
   positions[n.id]=pos;html+=graphNode(n,pos,false);
   if(i)links.push({a:positions[f.stages[i-1].id],b:pos,type:"rail"});
  });
 }
 state.worldWidth=w;state.worldHeight=h;
 W.style.width=w+"px";W.style.height=h+"px";nodes.style.width=w+"px";nodes.style.height=h+"px";nodes.innerHTML=html;
 edges.setAttribute("viewBox","0 0 "+w+" "+h);edges.setAttribute("width",w);edges.setAttribute("height",h);
 edges.innerHTML='<defs><marker id="flowArrow" markerWidth="11" markerHeight="11" refX="9" refY="4" orient="auto"><path d="M0 0L9 4L0 8Z" fill="#A4A9B0"/></marker></defs>'+
  links.map(x=>'<path class="diagram-edge '+x.type+'" marker-end="url(#flowArrow)" d="'+edgePath(x.a,x.b)+'"/>').join("");
 updateCam();
}
function updateCam(){state.cam.scale=Math.min(1.8,Math.max(.24,state.cam.scale));W.style.transform='translate('+state.cam.tx+'px,'+state.cam.ty+'px) scale('+state.cam.scale+')';$("scaleText").textContent=state.mode==="architecture"?Math.round(state.cam.scale*100)+"%":"MAP"}
function fitArchitecture(){
 if(state.mode!=="architecture")return;
 const width=V.clientWidth||1180,height=V.clientHeight||740,s=Math.max(.24,Math.min(1,(width-80)/state.worldWidth,(height-80)/state.worldHeight));
 state.cam.scale=s;state.cam.tx=(width-state.worldWidth*s)/2;state.cam.ty=(height-state.worldHeight*s)/2;updateCam();state.userMoved=false;
}
function zoomArch(factor,point){
 const r=V.getBoundingClientRect(),x=point?point.x-r.left:r.width/2,y=point?point.y-r.top:r.height/2,old=state.cam.scale,next=Math.max(.24,Math.min(1.8,old*factor));
 state.cam.tx=x-(x-state.cam.tx)*next/old;state.cam.ty=y-(y-state.cam.ty)*next/old;state.cam.scale=next;state.userMoved=true;updateCam();
}
function openMap(id){
 if(client||!fMap.has(id))return;
 const changed=state.archFlow!==id;state.archFlow=id;switchMode("architecture");drawArchitecture();
 if(changed){state.userMoved=false;fitArchitecture()}setLabels();closeDrawer();
}
function overview(){state.archFlow=null;state.userMoved=false;switchMode("architecture");drawArchitecture();fitArchitecture();setLabels();closeDrawer()}
$("goOverview").onclick=overview;
$("domainLinks").innerHTML=A.flows.map(f=>'<button type="button" data-map="'+safe(f.id)+'"><b>'+safe(f.number)+'</b><span>'+safe(f.title)+'</span></button>').join("");
$("fitMap").onclick=()=>state.mode==="architecture"?fitArchitecture():bridge?.fit();
$("zoomIn").onclick=()=>state.mode==="architecture"?zoomArch(1.16):bridge?.zoomIn();
$("zoomOut").onclick=()=>state.mode==="architecture"?zoomArch(1/1.16):bridge?.zoomOut();
$("fitBusinessMap").onclick=()=>{bridge?.fit();closeDrawer()};
function filterBusiness(){
 bridge?.setFilters($("businessView").value,$("businessCategory").value);closeDrawer();
}
$("businessView").onchange=filterBusiness;$("businessCategory").onchange=filterBusiness;
$("resetBusinessFilters").onclick=()=>{$("businessView").value="all";$("businessCategory").value="all";filterBusiness()};
V.addEventListener("pointerdown",e=>{if(e.button!==0||e.target.closest("button"))return;state.drag={id:e.pointerId,x:e.clientX,y:e.clientY,tx:state.cam.tx,ty:state.cam.ty};V.setPointerCapture(e.pointerId);V.classList.add("dragging")});
V.addEventListener("pointermove",e=>{if(!state.drag||state.drag.id!==e.pointerId)return;state.cam.tx=state.drag.tx+e.clientX-state.drag.x;state.cam.ty=state.drag.ty+e.clientY-state.drag.y;state.userMoved=true;updateCam()});
function endDrag(e){if(state.drag?.id===e.pointerId){state.drag=null;V.classList.remove("dragging");try{V.releasePointerCapture(e.pointerId)}catch(err){}}}
V.addEventListener("pointerup",endDrag);V.addEventListener("pointercancel",endDrag);
V.addEventListener("wheel",e=>{if(state.mode!=="architecture")return;e.preventDefault();zoomArch(e.deltaY<0?1.1:1/1.1,{x:e.clientX,y:e.clientY})},{passive:false});
window.addEventListener("resize",()=>{if(state.mode==="architecture"&&!state.userMoved)fitArchitecture()});
function renderSearch(){
 const q=$("searchText").value.trim().toLowerCase(),results=[];
 if(bridge)for(const n of bridge.getNodes())if(!q||[n.id,n.title,n.desc,n.owner].join(" ").toLowerCase().includes(q))results.push({kind:"business",...n});
 if(!client)for(const n of nMap.values())if(!q||[n.id,n.title,n.desc,fMap.get(n.flowId)?.title].join(" ").toLowerCase().includes(q))results.push({kind:"architecture",...n});
 $("searchResults").innerHTML=results.slice(0,36).map(n=>
  '<button class="search-result" type="button" data-result="'+safe(n.kind)+':'+safe(n.id)+'"><small>'+safe(n.kind==="business"?"BUSINESS":"ARCHITECTURE "+n.flowId)+'</small><strong>'+safe(n.title)+'</strong><span>'+safe((n.desc||"").slice(0,120))+'</span></button>'
 ).join("")||'<p class="detail-info">No matching process found.</p>';
}
$("searchText").oninput=renderSearch;
document.addEventListener("click",e=>{
 const arch=e.target.closest("[data-arch]");if(arch){reveal("architecture",arch.dataset.arch);return}
 const business=e.target.closest("[data-business]");if(business){if(bridge?.select(business.dataset.business))reveal("business",business.dataset.business);return}
 const map=e.target.closest("[data-map]");if(map){openMap(map.dataset.map);return}
 const hit=e.target.closest("[data-result]");
 if(hit){const [type,id]=hit.dataset.result.split(":");if(type==="business"){switchMode("business");bridge?.select(id)}reveal(type,id);return}
 const remove=e.target.closest("[data-remove]");if(remove&&!client&&window.confirm("Remove this custom process and its custom children?")){
  if(bridge?.removeProcess(remove.dataset.remove)){window.FlowStudio?.saveDraft?.();closeDrawer();toast("Custom process removed")}
 }
});
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openDrawer($("searchDrawer"));$("searchText").focus()}else if(e.key==="Escape")closeDrawer()});
if(client)document.body.classList.add("client-only");
drawArchitecture();setLabels();
window.FlowStudio={
 client,params,toast,switchMode,reveal,openDrawer,closeDrawer,bridge:()=>bridge,setBridge,renderSearch,fitArchitecture,openMap,
 getMode:()=>state.mode,getSelected:()=>selected?{...selected}:null,getCam:()=>({...state.cam}),getDrawer:()=>drawer?.id||null,
 counts:{domains:A.flows.length,nodes:nMap.size,stages:A.flows.reduce((sum,f)=>sum+f.stages.length,0)}
};
})();