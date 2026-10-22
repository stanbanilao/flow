/* THYNKVERSE FLOW v2 — stable master canvas and unlimited recursive process subflows.
 * Navigating and expanding never changes the master canvas transform.
 * Every process is represented as a connected node, not merely descriptive text.
 */
(function(){
"use strict";
const A=window.THYNKVERSE_ARCH;
if(!A||!Array.isArray(A.flows))throw new Error("Architecture reference data unavailable.");
const $=id=>document.getElementById(id);
const escapeHTML=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ALL=new Map(),FLOWS=new Map(),CROSS=new Map(),flat=[];
const state={
 flow:null,node:null,expanded:new Map(),inspected:new Set(),showCross:true,
 cam:{scale:1,tx:0,ty:0},userMoved:false,drag:null,
 worldWidth:2600,worldHeight:1750,lastScroll:0
};
const STATUS={verified:"HISTORICAL PASS",frozen:"FROZEN",pending:"VERIFY",planned:"PROPOSED",standard:"STANDARD",reference:"REFERENCE",gate:"APPROVAL GATE"};
const coords={F01:[85,118],F02:[930,118],F03:[1775,118],F04:[85,670],F05:[930,670],F06:[1775,670],F07:[930,1220]};
const GROUP_W=735,GROUP_H=445;
function register(){
 for(const flow of A.flows){
  FLOWS.set(flow.id,flow);
  const root={id:flow.id,flowId:flow.id,depth:-1,owner:flow.owner,title:flow.title,desc:flow.summary,status:"standard",children:flow.stages,parentId:null};
  ALL.set(flow.id,root);flat.push(root);
  function visit(node,id,depth,parentId){
   node.id=id;node.depth=depth;node.flowId=flow.id;node.parentId=parentId;
   node.owner ||= flow.owner;node.children ||= [];
   node.status ||= "reference";
   ALL.set(id,node);flat.push(node);
   node.children.forEach((ch,i)=>visit(ch,id+"."+(i+1),depth+1,id));
  }
  flow.stages.forEach((node,i)=>visit(node,flow.id+"."+(i+1),0,flow.id));
 }
 for(const c of A.stageLinks||[]){
  if(!ALL.has(c.from)||!ALL.has(c.to))continue;
  if(!CROSS.has(c.from))CROSS.set(c.from,[]);
  if(!CROSS.has(c.to))CROSS.set(c.to,[]);
  CROSS.get(c.from).push({other:c.to,label:c.label});
  CROSS.get(c.to).push({other:c.from,label:c.label});
 }
}
register();
const nodeCount=flat.filter(x=>x.depth>=0).length;
const viewport=$("viewport"),world=$("world"),map=$("flowMap"),scroll=$("flowScroll"),dialog=$("flowWindow"),masterSVG=$("masterEdges"),regionLayer=$("regionLayer");
function flowColor(id){return FLOWS.get(id)?.color||"#6991c6"}
function branches(node){return (A.decisionBranches||{})[node.id]||[]}
function hasDetail(node){return !!((node.children||[]).length||branches(node).length)}
function crossNodes(node){
 const more=(node.links||[]).filter(x=>ALL.has(x)).map(x=>({other:x,label:"Related system"}));
 const all=[...(CROSS.get(node.id)||[]),...more];const seen=new Set();
 return all.filter(x=>x.other!==node.id&&!seen.has(x.other)&&seen.add(x.other));
}
function typeOf(node){
 if(branches(node).length)return"decision";
 if(node.status==="gate")return"gate";
 return "process";
}
function drawNav(){
 $("flowNavigation").innerHTML=A.flows.map(f=>'<button class="nav-flow" type="button" data-open="'+f.id+'" style="--accent:'+f.color+'"><span class="nav-number">'+f.number+'</span><span class="nav-name">'+escapeHTML(f.title)+'<small>'+f.stages.length+' primary stages · '+f.short+'</small></span><span class="nav-caret">↗</span></button>').join("");
 $("mapStats").textContent=A.flows.length+" domains  ·  "+A.flows.reduce((a,f)=>a+f.stages.length,0)+" stages  ·  "+nodeCount+" connected process nodes";
}
function previewStep(stage,flow,index){
 const hasDecision=branches(stage).length>0||stage.status==="gate";
 return '<button type="button" class="preview-step'+(hasDecision?" decision":"")+'" data-open="'+stage.id+'" title="Open connected '+escapeHTML(stage.title)+' flow"><span class="preview-code">'+stage.id+'</span><strong>'+escapeHTML(stage.title)+'</strong><small>'+((stage.children||[]).length+(branches(stage).length))+' internal checks ↗</small></button>';
}
function miniLines(){
 const paths=[];
 for(let row=0;row<2;row++){
  for(let col=0;col<2;col++){
   const y=55+row*133,x1=225+col*237,x2=242+col*237;
   paths.push('<path d="M'+x1+' '+y+' L'+x2+' '+y+'" stroke="#a1b5ca" stroke-width="2.2" fill="none" marker-end="url(#mini-tip)"/>');
  }
 }
 return '<svg class="preview-lines" aria-hidden="true" style="position:absolute;left:18px;top:126px;z-index:1" width="699" height="252" viewBox="0 0 699 252"><defs><marker id="mini-tip" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#a1b5ca"/></marker></defs>'+paths.join("")+'</svg>';
}
function renderMaster(){
 regionLayer.style.width=state.worldWidth+"px";regionLayer.style.height=state.worldHeight+"px";
 world.style.width=state.worldWidth+"px";world.style.height=state.worldHeight+"px";
 let out="";
 for(const f of A.flows){
  const [x,y]=coords[f.id];
  out+='<section class="region" id="region-'+f.id+'" aria-label="'+escapeHTML(f.title)+'" style="left:'+x+'px;top:'+y+'px;--accent:'+f.color+'">';
  out+='<div class="region-title-row"><div><span class="region-eyebrow">'+f.number+' / SYSTEM ARCHITECTURE</span><h2>'+escapeHTML(f.title)+'</h2><div class="region-summary">'+escapeHTML(f.short)+'</div></div>';
  out+='<button type="button" class="region-open" data-open="'+f.id+'">Expand system ↗</button></div>';
  out+='<p class="region-small-count">PROCESS CHAIN / FIRST 6 OF '+f.stages.length+' STAGES</p>';
  out+=miniLines();
  out+='<div class="region-preview">'+f.stages.slice(0,6).map((s,i)=>previewStep(s,f,i)).join("")+'</div>';
  out+='<div class="region-bottom"><span>'+f.stages.length+' major processes · '+countDescendants(f.stages)+' detailed subprocesses</span><button type="button" data-open="'+f.id+'">View all stages and connections →</button></div>';
  out+='</section>';
 }
 regionLayer.innerHTML=out;
 drawOverviewConnections();
 updateCamera();
}
function countDescendants(nodes){let k=0;for(const n of nodes){k+=(n.children||[]).length;k+=countDescendants(n.children||[])}return k}
function anchor(id,to){
 const [x,y]=coords[id],w=GROUP_W,h=GROUP_H;
 if(to){const [xx,yy]=coords[to],dx=xx-x,dy=yy-y;
  if(Math.abs(dx)>Math.abs(dy)*1.10)return{x:x+(dx>0?w:0),y:y+h/2};
  return{x:x+w/2,y:y+(dy>0?h:0)};
 }
 return{x:x+w/2,y:y+h/2};
}
function masterEdgePath(e){
 const p=anchor(e.from,e.to),q=anchor(e.to,e.from),dx=q.x-p.x,dy=q.y-p.y;
 if(Math.abs(dx)>Math.abs(dy)*.75){const side=dx>=0?1:-1,b=Math.max(65,Math.abs(dx)*.43);return'M'+p.x+','+p.y+' C'+(p.x+b*side)+','+p.y+' '+(q.x-b*side)+','+q.y+' '+q.x+','+q.y;}
 const side=dy>=0?1:-1,b=Math.max(65,Math.abs(dy)*.44);
 return'M'+p.x+','+p.y+' C'+p.x+','+(p.y+b*side)+' '+q.x+','+(q.y-b*side)+' '+q.x+','+q.y;
}
function drawOverviewConnections(){
 let svg='<defs><marker id="overviewTip" markerWidth="11" markerHeight="11" refX="9" refY="3.5" orient="auto"><path d="M0 0L9 3.5L0 7Z" fill="#829bbb"/></marker><marker id="overviewTipCross" markerWidth="11" markerHeight="11" refX="9" refY="3.5" orient="auto"><path d="M0 0L9 3.5L0 7Z" fill="#e4935b"/></marker></defs>';
 for(const edge of A.connections||[]){
  svg+='<path class="overview-edge '+(edge.type==="cross"?"cross":"")+(edge.type==="cross"&&!state.showCross?" hidden-cross":"")+'" d="'+masterEdgePath(edge)+'" marker-end="url(#'+(edge.type==="cross"?"overviewTipCross":"overviewTip")+')"/>';
 }
 masterSVG.setAttribute("width",state.worldWidth);masterSVG.setAttribute("height",state.worldHeight);
 masterSVG.setAttribute("viewBox","0 0 "+state.worldWidth+" "+state.worldHeight);masterSVG.innerHTML=svg;
}
function updateCamera(){
 const c=state.cam;c.scale=Math.max(.20,Math.min(1.95,c.scale));
 world.style.transform='translate('+c.tx+'px,'+c.ty+'px) scale('+c.scale+')';
 $("zoomPercent").textContent=Math.round(c.scale*100)+"%";
}
function fitCamera(){
 const cw=viewport.clientWidth||1300,ch=viewport.clientHeight||740,pad=65;
 const scale=Math.max(.20,Math.min(1,(cw-pad)/state.worldWidth,(ch-pad)/state.worldHeight));
 state.cam.scale=scale;
 state.cam.tx=(cw-state.worldWidth*scale)/2;state.cam.ty=(ch-state.worldHeight*scale)/2;
 updateCamera();
}
function zoomTo(factor,clientX,clientY){
 const rect=viewport.getBoundingClientRect(),x=clientX==null?rect.width/2:clientX-rect.left,y=clientY==null?rect.height/2:clientY-rect.top;
 const old=state.cam.scale,next=Math.max(.20,Math.min(1.95,old*factor));
 state.cam.tx=x-(x-state.cam.tx)*next/old;state.cam.ty=y-(y-state.cam.ty)*next/old;state.cam.scale=next;
 state.userMoved=true;updateCamera();
}
function makeRoot(stage,flow,expanded){
 const isDecision=branches(stage).length>0;
 const related=crossNodes(stage),details=hasDetail(stage);
 const klass=(isDecision?" featured":"")+(expanded?" open":"");
 return '<button type="button" data-toggle="'+stage.id+'" aria-expanded="'+(expanded?"true":"false")+'" class="stage-node'+klass+'" style="--accent:'+flow.color+'"><div class="node-topline"><span class="node-id">'+stage.id+(isDecision?' ◇':'')+'</span><span class="node-state '+stage.status+'">'+escapeHTML(STATUS[stage.status]||"REFERENCE")+'</span></div><h3>'+escapeHTML(stage.title)+'</h3><p class="node-descr">'+escapeHTML(stage.desc)+'</p><div class="node-meta"><span>'+((stage.children||[]).length+branches(stage).length)+' connected checks · '+related.length+' external links</span><span class="expander">'+(expanded?"− Collapse":details?"+ Expand":"Inspect")+'</span></div></button>';
}
function crossChips(n){
 const links=crossNodes(n);
 if(!links.length)return'';
 return '<div class="flow-cell-links">'+links.map(x=>{const dest=ALL.get(x.other);return '<button class="cross-chip" data-open="'+x.other+'" type="button" title="'+escapeHTML(x.label)+'">↗ '+escapeHTML(x.other+" "+(dest?dest.title:"Process"))+'</button>'}).join("")+'</div>';
}
function getExpansion(){let set=state.expanded.get(state.flow);if(!set){set=new Set();state.expanded.set(state.flow,set)}return set}
function inspectBody(node){
 if(state.inspected.has(node.id))return '<div class="node-extra"><span style="font-size:10px;line-height:1.5;color:#6987a0"><b>Owner:</b> '+escapeHTML(node.owner)+' · <b>Reference status:</b> '+escapeHTML(STATUS[node.status]||"Reference")+'</span>'+crossNodes(node).map(x=>'<button type="button" data-open="'+x.other+'">↗ '+escapeHTML(x.other)+'</button>').join("")+'</div>';
 return "";
}
function renderOutcomes(node){
 const list=branches(node);if(!list.length)return"";
 return '<div class="branch-caption" style="margin-top:14px">◇ DECISION / BRANCH OUTCOMES</div><div class="decision-outcomes">'+list.map(b=>
 '<button type="button" class="outcome '+(b.type==="no"?"no":"")+'" data-open="'+b.to+'" title="Follow '+escapeHTML(b.label)+' branch"><span class="outcome-label">'+escapeHTML(b.label)+' → '+escapeHTML(b.to)+'</span><strong>'+escapeHTML(b.title)+'</strong><small>'+escapeHTML(b.desc)+'</small></button>'
 ).join("")+'</div>';
}
function renderTreeChild(node,depth){
 const exp=getExpansion().has(node.id),detail=hasDetail(node);
 return '<div class="tree-wrap" aria-expanded="'+(exp?'true':'false')+'" style="--accent:'+flowColor(node.flowId)+'">'
 +'<button type="button" class="tree-node '+(typeOf(node)==="decision"?"decision-box":"")+'" data-toggle="'+node.id+'" aria-expanded="'+(exp?'true':'false')+'">'
 +'<span class="tree-node-top">'+(typeOf(node)==="decision"?'<i class="diamond-mark"></i>':'')+'<b>'+escapeHTML(node.id)+'</b><em>'+escapeHTML(STATUS[node.status]||"DETAIL")+'</em></span><strong>'+escapeHTML(node.title)+'</strong><span>'+escapeHTML(node.desc||"Inspect this documented process checkpoint.")+'</span><div class="node-meta"><span>'+((node.children||[]).length+branches(node).length)+' subprocesses</span><b class="expander">'+(exp?"− Collapse":detail?"+ Expand":"Details")+'</b></div></button>'
 +inspectBody(node)+crossChips(node)
 +(exp?renderBranch(node,depth+1):"")+'</div>';
}
function renderBranch(node,depth){
 const children=node.children||[],outcomes=branches(node);
 if(!children.length&&!outcomes.length)return"";
 return '<div class="branch-tree'+(depth>0?" nested":"")+'" style="--accent:'+flowColor(node.flowId)+'"><span class="branch-caption">↳ '+(depth>0?"NEXT LEVEL":"EXPANDED SUBFLOW")+' / '+(children.length+outcomes.length)+' STEPS</span>'
 +'<div class="tree-list">'+children.map(child=>renderTreeChild(child,depth)).join("")+'</div>'
 +renderOutcomes(node)+'</div>';
}
function renderStage(stage,flow){
 const expanded=getExpansion().has(stage.id);
 return '<article class="stage-cell" style="--accent:'+flow.color+'" data-stage="'+stage.id+'">'
  +makeRoot(stage,flow,expanded)+crossChips(stage)
  +(expanded?renderBranch(stage,0):"")
  +'</article>';
}
function updateBreadcrumb(){
 if(!state.flow)return;
 const flow=FLOWS.get(state.flow),n=ALL.get(state.node);
 $("breadCrumb").textContent="MASTER  /  "+flow.number+" "+flow.title+(n&&n.depth>=0?"  /  "+n.id+" · "+n.title:"");
}
function renderFlow(){
 if(!state.flow)return;
 const flow=FLOWS.get(state.flow),expanded=getExpansion();
 map.innerHTML='<svg class="inner-edges" id="innerEdges" aria-hidden="true"></svg><div class="flow-sequence" id="stageSequence">'+flow.stages.map(s=>renderStage(s,flow)).join("")+'</div>';
 $("detailTitle").textContent=flow.title;
 $("detailNum").textContent=flow.number;
 $("detailKicker").textContent="FLOW "+flow.number+" · CONNECTED PROCESS MAP";
 $("detailSummary").textContent=flow.summary;
 dialog.style.setProperty("--accent",flow.color);
 const expandedVisible=[...expanded].filter(id=>ALL.has(id)&&ALL.get(id).flowId===flow.id).length;
 $("flowStats").textContent=flow.stages.length+" main stages · "+countDescendants(flow.stages)+" detail nodes · "+expandedVisible+" expanded · "+(A.stageLinks||[]).filter(x=>x.from.startsWith(flow.id)||x.to.startsWith(flow.id)).length+" cross-links";
 updateBreadcrumb();
 requestAnimationFrame(drawSequenceEdges);
}
function drawSequenceEdges(){
 const seq=$("stageSequence"),svg=$("innerEdges");
 if(!seq||!svg||!state.flow)return;
 const boxes=[...seq.querySelectorAll(":scope > .stage-cell > .stage-node")];
 if(boxes.length<2){svg.innerHTML="";return}
 const base=map.getBoundingClientRect();
 let d='<defs><marker id="seqArrow" markerWidth="10" markerHeight="10" refX="8" refY="3.2" orient="auto"><path d="M0 0L8 3.2L0 6.4Z" fill="'+flowColor(state.flow)+'"/></marker></defs>';
 for(let i=0;i<boxes.length-1;i++){
  const r=boxes[i].getBoundingClientRect(),q=boxes[i+1].getBoundingClientRect();
  const p={x:r.right-base.left,y:r.top-base.top+r.height/2};
  const t={x:q.left-base.left,y:q.top-base.top+q.height/2};
  const sameRow=Math.abs((q.top-r.top))<22;
  let path;
  if(sameRow){
   const middle=(p.x+t.x)/2;
   path='M'+p.x+','+p.y+' C'+middle+','+p.y+' '+middle+','+t.y+' '+t.x+','+t.y;
  }else{
   const start={x:r.left-base.left+r.width/2,y:r.bottom-base.top};
   const end={x:q.left-base.left+q.width/2,y:q.top-base.top};
   const bend=Math.min(75,Math.max(22,(end.y-start.y)*.48));
   path='M'+start.x+','+start.y+' C'+start.x+','+(start.y+bend)+' '+end.x+','+(end.y-bend)+' '+end.x+','+end.y;
  }
  d+='<path class="inner-edge" d="'+path+'" marker-end="url(#seqArrow)" style="stroke:'+flowColor(state.flow)+'"/>';
 }
 const ww=Math.max(map.scrollWidth,950),hh=Math.max(map.scrollHeight,100);
 svg.setAttribute("width",ww);svg.setAttribute("height",hh);
 svg.setAttribute("viewBox","0 0 "+ww+" "+hh);svg.innerHTML=d;
}
function openFlow(id){
 const node=ALL.get(id);if(!node)return;
 const flowId=node.flowId;
 const sameFlow=state.flow===flowId;
 state.flow=flowId;state.node=id;
 dialog.hidden=false;
 if(node.depth>=0){
  if(node.depth===0) getExpansion().add(id);
  else{
   let current=node;
   while(current&&current.depth>=0){
    const p=ALL.get(current.parentId);
    if(p&&p.depth>=0)getExpansion().add(p.id);
    current=p&&p.depth>=0?p:null;
   }
   if(hasDetail(node))getExpansion().add(node.id);
   else state.inspected.add(node.id);
  }
 }
 renderFlow();
 if(!sameFlow)scroll.scrollTop=0; // Only the subflow pane changes; the master canvas never moves.
 setURL(id);
 closeSearch();closeMobileMenu();
 markCurrentNav();
}
function toggleNode(id){
 const n=ALL.get(id);if(!n)return;
 if(n.depth===-1){openFlow(id);return}
 if(!state.flow||state.flow!==n.flowId){openFlow(id);return}
 const set=getExpansion();
 if(hasDetail(n)){if(set.has(id))set.delete(id);else set.add(id)}
 else {if(state.inspected.has(id))state.inspected.delete(id);else state.inspected.add(id)}
 state.node=id;renderFlow();setURL(id);markCurrentNav();
 // Do not change viewport transform or focus pane scrollTop on expansion.
}
function markCurrentNav(){
 for(const button of $("flowNavigation").querySelectorAll("button[data-open]")){
  button.classList.toggle("active",button.dataset.open===state.flow);
 }
}
function closeFlow(){
 dialog.hidden=true;state.flow=null;state.node=null;markCurrentNav();setURL("");
 // Master camera and overview regions are exactly where the user left them.
}
function setURL(id){
 try{history.replaceState(null,"",id?"#"+encodeURIComponent(id):location.pathname+location.search)}catch(err){}
}
function expandEverything(all){
 if(!state.flow)return;
 const set=getExpansion();set.clear();
 if(all){for(const n of flat)if(n.flowId===state.flow&&n.depth>=0&&hasDetail(n))set.add(n.id)}
 renderFlow();
}
function toast(message){
 const x=$("toast");x.textContent=message;x.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>x.classList.remove("show"),2400);
}
function exportData(){
 const data=JSON.stringify(A,null,2),blob=new Blob([data],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="THYNKVERSE-FLOW-ARCHITECTURE-"+A.version+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800);
 toast("Complete architecture exported");
}
function copyLink(){
 const url=location.href;
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(()=>toast("Deep link copied")).catch(()=>toast("Copy URL from your address bar"));
 else toast("Copy URL from your address bar");
}
function closeSearch(){$("searchMenu").classList.remove("open")}
function search(){
 const q=$("findProcess").value.trim().toLowerCase();
 const menu=$("searchMenu");if(!q){closeSearch();return}
 const hits=flat.filter(n=>[n.id,n.title,n.desc,n.owner,FLOWS.get(n.flowId)?.title].join(" ").toLowerCase().includes(q)).slice(0,28);
 menu.innerHTML=hits.length?hits.map(n=>'<button type="button" class="search-item" data-open="'+n.id+'"><small>'+n.id+' · '+escapeHTML(FLOWS.get(n.flowId).title)+'</small><strong>'+escapeHTML(n.title)+'</strong><span>'+escapeHTML((n.desc||"").slice(0,115))+'</span></button>').join(""):'<div class="no-result">No matching checkpoint — try “approval”, “agent”, “licence”, “rollback”.</div>';
 menu.classList.add("open");
}
function closeMobileMenu(){$("sidebar").classList.remove("menu-open");$("menuBackdrop").classList.remove("open")}
function onClick(e){
 const toggle=e.target.closest("[data-toggle]");
 if(toggle){e.preventDefault();toggleNode(toggle.dataset.toggle);return}
 const opener=e.target.closest("[data-open]");
 if(opener){e.preventDefault();openFlow(opener.dataset.open);return}
 if(!e.target.closest(".search-box"))closeSearch();
}
document.addEventListener("click",onClick);
$("menuOpen").onclick=()=>{$("sidebar").classList.toggle("menu-open");$("menuBackdrop").classList.toggle("open")};
$("menuBackdrop").onclick=closeMobileMenu;
$("allMap").onclick=()=>{closeFlow();closeMobileMenu()};
$("closeFlow").onclick=closeFlow;
$("expandAll").onclick=()=>expandEverything(true);
$("collapseAll").onclick=()=>expandEverything(false);
$("copyNodeLink").onclick=copyLink;
$("exportData").onclick=exportData;
$("fitCanvas").onclick=fitCamera;
$("fitCanvas2").onclick=fitCamera;
$("zoomIn").onclick=()=>zoomTo(1.18);
$("zoomOut").onclick=()=>zoomTo(1/1.18);
$("linksToggle").onclick=()=>{
 state.showCross=!state.showCross;$("linksToggle").classList.toggle("on",state.showCross);
 $("linksToggle").setAttribute("aria-pressed",String(state.showCross));drawOverviewConnections();
};
$("findProcess").addEventListener("input",search);
$("findProcess").addEventListener("focus",()=>{if($("findProcess").value.trim())search()});
viewport.addEventListener("pointerdown",e=>{
 if(e.button!==0||e.target.closest("button,.region"))return;
 state.drag={id:e.pointerId,x:e.clientX,y:e.clientY,tx:state.cam.tx,ty:state.cam.ty};
 viewport.setPointerCapture(e.pointerId);viewport.classList.add("dragging");
});
viewport.addEventListener("pointermove",e=>{
 if(!state.drag||state.drag.id!==e.pointerId)return;
 state.cam.tx=state.drag.tx+(e.clientX-state.drag.x);state.cam.ty=state.drag.ty+(e.clientY-state.drag.y);state.userMoved=true;updateCamera();
});
function stopDrag(e){
 if(state.drag&&state.drag.id===e.pointerId){state.drag=null;viewport.classList.remove("dragging");try{viewport.releasePointerCapture(e.pointerId)}catch(err){}}
}
viewport.addEventListener("pointerup",stopDrag);
viewport.addEventListener("pointercancel",stopDrag);
viewport.addEventListener("wheel",e=>{if(!dialog.hidden)return; // Closed master overview is zoomable; open subflows scroll independently.
 e.preventDefault();zoomTo(e.deltaY<0?1.11:1/1.11,e.clientX,e.clientY)},{passive:false});
document.addEventListener("keydown",e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("findProcess").focus();$("findProcess").select();return}
 if(e.key==="Escape"){if($("searchMenu").classList.contains("open"))closeSearch();else if(!dialog.hidden)closeFlow();else closeMobileMenu();return}
 if(document.activeElement!==$("findProcess")&&dialog.hidden&&e.key==="0"){fitCamera()}
});
window.addEventListener("resize",()=>{if(!dialog.hidden)requestAnimationFrame(drawSequenceEdges);if(!state.userMoved&&dialog.hidden)fitCamera()});
window.addEventListener("hashchange",()=>{
 let id="";try{id=decodeURIComponent(location.hash.slice(1))}catch(e){}
 if(id&&ALL.has(id))openFlow(id);else closeFlow();
});
renderMaster();drawNav();requestAnimationFrame(fitCamera); // Initial camera fit happens once; never inside openFlow or toggleNode.
let initial="";try{initial=decodeURIComponent(location.hash.slice(1))}catch(e){}
if(initial&&ALL.has(initial))openFlow(initial);
document.body.dataset.architectureReady="true";
window.__flowInspection=Object.freeze({
 version:A.version,
 nodeCount,flowCount:A.flows.length,
 getCamera:()=>({...state.cam}),
 getFocused:()=>({flow:state.flow,node:state.node,expanded:[...(state.flow?getExpansion():new Set())]}),
 // Read-only test inspection. No deployment action or external writes.
});
})();
