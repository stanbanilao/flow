
(function(){
"use strict";
const A=window.THYNKVERSE_ARCH;
if(!A||!Array.isArray(A.flows)){document.body.textContent="Architecture data could not be loaded.";return}
const $=id=>document.getElementById(id);
const flowMap=new Map(),nodeMap=new Map(),allItems=[];
function safe(value){return String(value==null?"":value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}
function build(){
 A.flows.forEach(f=>{
  flowMap.set(f.id,f);nodeMap.set(f.id,Object.assign({depth:-1,flowId:f.id,children:f.stages,status:"standard"},f));allItems.push(nodeMap.get(f.id));
  function assign(item,id,depth,parent){
   item.id=id;item.depth=depth;item.flowId=f.id;item.parentId=parent||null;item.owner=item.owner||f.owner;item.children=item.children||[];
   item.status=item.status||(depth>0?"standard":"reference");
   nodeMap.set(id,item);allItems.push(item);
   item.children.forEach((child,j)=>assign(child,id+"."+(j+1),depth+1,id));
  }
  f.stages.forEach((item,i)=>assign(item,f.id+"."+(i+1),0,null));
 });
}
build();
const state={flowId:null,selected:null,expandedRoot:null,expandedChild:null,showCross:true,scale:.7,tx:0,ty:0,worldW:1400,worldH:1000,positions:{},renderedEdges:[],inspector:false,drag:null};
const wrap=$("viewport"),world=$("world"),nodesLayer=$("nodesLayer"),edgesLayer=$("edgesLayer"),search=$("search");
const STATUS={verified:"Verified baseline",standard:"Documented standard",reference:"Reference",gate:"Approval gate",frozen:"Frozen checkpoint",pending:"Reverification pending",planned:"Planned"};
const overviewPos={F01:[80,150],F02:[500,150],F03:[920,150],F04:[920,485],F05:[500,485],F06:[80,485],F07:[500,815]};
function renderNav(){
 $("navFlows").innerHTML=A.flows.map(f=>'<button class="flow-link'+(state.flowId===f.id?' active':'')+'" type="button" data-nav="'+f.id+'" style="--flow-color:'+f.color+'"><span class="flow-num">'+f.number+'</span><span class="flow-label"><strong>'+safe(f.title)+'</strong><small>'+f.stages.length+' connected stages</small></span><span class="flow-arrow">›</span></button>').join("");
 const roots=A.flows.reduce((n,f)=>n+f.stages.length,0),nested=allItems.length-A.flows.length-roots;
 $("countInfo").textContent=A.flows.length+" systems · "+roots+" stages · "+nested+" checkpoints";
}
function nodeHTML(node,pos,type){
 const f=flowMap.get(node.flowId);
 const className=type==="flow"?"flow-node":type==="root"?"stage-node":type==="child"?"child-node":"grandchild-node";
 const isSelected=state.selected===node.id;
 const expanded=state.expandedRoot===node.id||state.expandedChild===node.id;
 const kids=(node.children||[]).length;
 const label=node.depth<0?node.id:node.id.replace("F0","").replaceAll(".", " / ");
 const status=node.depth<0?"standard":node.status;
 const desc=node.depth<0?f.summary:node.desc||"Inspect the process and its required controls.";
 const shortDesc=desc.length>(type==="flow"?169:129)?desc.slice(0,type==="flow"?166:126)+"...":desc;
 return '<div role="button" tabindex="0" data-node="'+safe(node.id)+'" class="diagram-node '+className+(isSelected?' selected':'')+'" style="--flow-color:'+f.color+';left:'+pos.x+'px;top:'+pos.y+'px"><div class="node-top"><span class="node-code">'+safe(label)+'</span><span class="state '+status+'">'+safe(STATUS[status]||"Reference")+'</span></div><div class="node-title">'+safe(node.title)+'</div><div class="node-desc">'+safe(shortDesc)+'</div><div class="node-foot"><span>'+(node.depth<0?f.stages.length+" process stages":kids?'<span class="count">'+kids+'</span> inner steps':(node.links||[]).length+" linked systems")+'</span>'+(kids&&node.depth>=0?'<span role="button" tabindex="0" class="node-expand" data-expand="'+node.id+'">'+(expanded?"− Collapse":"+ Expand")+'</span>':'<span class="node-open">'+(node.depth<0?"Explore flow →":"Inspect →")+'</span>')+'</div></div>';
}
function createEdge(a,b,type,label){
 if(!state.positions[a]||!state.positions[b])return;
 state.renderedEdges.push({from:a,to:b,type,label:label||""});
}
function getEdgePath(p,q){
 const cx=p.x+p.w/2,cy=p.y+p.h/2,dx=q.x+q.w/2,dy=q.y+q.h/2;
 let sx,sy,ex,ey,c1x,c1y,c2x,c2y;
 if(Math.abs(dx-cx)>=Math.abs(dy-cy)*.85){
  const right=dx>=cx;
  sx=right?p.x+p.w:p.x;sy=cy;ex=right?q.x:q.x+q.w;ey=dy;
  const bend=Math.max(55,Math.abs(ex-sx)*.44);
  c1x=sx+(right?bend:-bend);c1y=sy;c2x=ex-(right?bend:-bend);c2y=ey;
 }else{
  const below=dy>=cy;
  sx=cx;sy=below?p.y+p.h:p.y;ex=dx;ey=below?q.y:q.y+q.h;
  const bend=Math.max(55,Math.abs(ey-sy)*.45);
  c1x=sx;c1y=sy+(below?bend:-bend);c2x=ex;c2y=ey-(below?bend:-bend);
 }
 return "M"+sx+","+sy+" C"+c1x+","+c1y+" "+c2x+","+c2y+" "+ex+","+ey;
}
function drawEdges(){
 let lines='<defs><marker id="atlas-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3.2" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L8 3.2 L0 6.4 Z" fill="#829ebf"/></marker><marker id="atlas-arrow-hot" markerWidth="10" markerHeight="10" refX="8" refY="3.2" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L8 3.2 L0 6.4 Z" fill="#f18548"/></marker></defs>';
 for(const e of state.renderedEdges){
  if(e.type==="cross"&&!state.showCross)continue;
  lines+='<path class="edge '+e.type+'" data-from="'+e.from+'" data-to="'+e.to+'" d="'+getEdgePath(state.positions[e.from],state.positions[e.to])+'" marker-end="url(#atlas-arrow)"></path>';
 }
 edgesLayer.innerHTML=lines;
 edgesLayer.setAttribute("width",state.worldW);edgesLayer.setAttribute("height",state.worldH);edgesLayer.setAttribute("viewBox","0 0 "+state.worldW+" "+state.worldH);
}
function renderDiagram(){
 state.positions={};state.renderedEdges=[];
 let html="",w=1450,h=1160;
 if(!state.flowId){
  A.flows.forEach(f=>{const p=overviewPos[f.id];const pos={x:p[0],y:p[1],w:320,h:210};state.positions[f.id]=pos;html+=nodeHTML(nodeMap.get(f.id),pos,"flow")});
  A.connections.forEach(e=>createEdge(e.from,e.to,e.type,e.label));
 }else{
  const flow=flowMap.get(state.flowId),steps=flow.stages;
  w=Math.max(1450,190+steps.length*315);h=750;
  steps.forEach((s,i)=>{const pos={x:95+i*315,y:208,w:268,h:177};state.positions[s.id]=pos;html+=nodeHTML(s,pos,"root");if(i)createEdge(steps[i-1].id,s.id,"main","Next approved step")});
  if(state.expandedRoot&&nodeMap.has(state.expandedRoot)){
   const root=nodeMap.get(state.expandedRoot),rootPos=state.positions[state.expandedRoot];
   const kids=root.children||[];
   if(rootPos&&kids.length){
    const baseX=Math.max(80,rootPos.x-40);
    kids.forEach((k,i)=>{const pos={x:baseX+i*274,y:565,w:242,h:143};state.positions[k.id]=pos;html+=nodeHTML(k,pos,"child");createEdge(i?kids[i-1].id:root.id,k.id,i?"deeper":"main","Internal checkpoint")});
    w=Math.max(w,baseX+kids.length*274+90);h=1020;
    if(state.expandedChild){
     const child=nodeMap.get(state.expandedChild),childPos=state.positions[state.expandedChild];
     if(childPos&&(child.children||[]).length){
      const base2=Math.max(80,childPos.x-18);
      child.children.forEach((g,i)=>{const pos={x:base2+i*259,y:865,w:230,h:136};state.positions[g.id]=pos;html+=nodeHTML(g,pos,"grandchild");createEdge(i?child.children[i-1].id:child.id,g.id,i?"deeper":"main","Decision detail")});
      w=Math.max(w,base2+child.children.length*259+80);h=1225;
     }
    }
   }
  }
 }
 state.worldW=w;state.worldH=h;
 world.style.width=w+"px";world.style.height=h+"px";nodesLayer.style.width=w+"px";nodesLayer.style.height=h+"px";
 nodesLayer.innerHTML=html;
 drawEdges();
 applyTransform();
 updateCanvasHeading();
}
function updateCanvasHeading(){
 const flow=flowMap.get(state.flowId);
 $("canvasHeading").innerHTML='<strong>'+(flow?safe(flow.id+" / "+flow.title):"ALL SYSTEMS / MASTER ARCHITECTURE")+'</strong><span>'+(flow?"Select a stage to reveal its internal checks. Drag to move across the sequence.":"Solid lines = primary flow; dotted lines = cross-system relationship.")+'</span>';
 $("headline").textContent=flow?flow.title:"Architecture overview";
 $("subheadline").textContent=flow?flow.summary:"Seven linked domains · Interactive process architecture · Reference snapshot";
 $("backBtn").textContent=flow?"← Master map":"Master map";
 $("backBtn").classList.toggle("active",Boolean(flow));
}
function applyTransform(){
 state.scale=Math.max(.30,Math.min(2.05,state.scale));
 world.style.transform="translate("+state.tx+"px,"+state.ty+"px) scale("+state.scale+")";
 $("zoomLabel").textContent=Math.round(state.scale*100)+"%";
}
function fitAll(){
 const cw=wrap.clientWidth,ch=wrap.clientHeight,margin=76;
 state.scale=Math.max(.30,Math.min(1,(cw-margin)/state.worldW,(ch-margin)/state.worldH));
 state.tx=(cw-state.worldW*state.scale)/2;state.ty=(ch-state.worldH*state.scale)/2;
 applyTransform();
}
function defaultFraming(){
 const cw=wrap.clientWidth,ch=wrap.clientHeight;
 if(!state.flowId){
  state.scale=Math.max(.35,Math.min(.82,(cw-88)/1420));
  state.tx=(cw-1420*state.scale)/2;
  state.ty=ch<660?-45:2;
 }else{
  state.scale=Math.max(.64,Math.min(1,(cw-55)/890));
  state.tx=35;state.ty=Math.max(40,Math.min(100,ch*.19-130));
 }
 applyTransform();
}
function centerNode(id){
 const p=state.positions[id];if(!p)return;
 state.tx=wrap.clientWidth*(state.inspector?.37:.49)-(p.x+p.w/2)*state.scale;
 state.ty=wrap.clientHeight*.34-(p.y+p.h/2)*state.scale;
 applyTransform();
}
function setActiveFlow(id){
 state.flowId=id||null;state.selected=null;state.expandedRoot=null;state.expandedChild=null;state.inspector=false;
 closeInspector();closeSearch();closeMenu();renderNav();renderDiagram();defaultFraming();
 setHash(id||"");updateRelated();
}
function route(id,opts={}){
 if(!nodeMap.has(id))return;
 const target=nodeMap.get(id);
 if(target.depth===-1){setActiveFlow(id);return}
 if(state.flowId!==target.flowId)setActiveFlow(target.flowId);
 state.expandedRoot=null;state.expandedChild=null;
 if(target.depth>0){
  let p=target;
  while(p.parentId){
   const anc=nodeMap.get(p.parentId);
   if(anc.depth===0)state.expandedRoot=anc.id;
   if(anc.depth===1)state.expandedChild=anc.id;
   p=anc;
  }
 }else if(target.children&&target.children.length&&opts.autoExpand!==false)state.expandedRoot=target.id;
 if(target.depth===1&&target.children&&target.children.length&&opts.autoExpand!==false)state.expandedChild=target.id;
 state.selected=id;state.inspector=true;
 renderDiagram();showInspector();centerNode(id);setHash(id);updateRelated();closeSearch();closeMenu();
}
function expand(id){
 const target=nodeMap.get(id);if(!target||!(target.children||[]).length)return;
 if(target.depth===0){state.expandedRoot=state.expandedRoot===id?null:id;state.expandedChild=null}
 if(target.depth===1){
  if(state.expandedRoot!==target.parentId)state.expandedRoot=target.parentId;
  state.expandedChild=state.expandedChild===id?null:id;
 }
 state.selected=id;state.inspector=true;renderDiagram();showInspector();centerNode(id);setHash(id);updateRelated();
}
function setHash(id){try{history.replaceState(null,"",id?"#"+encodeURIComponent(id):location.pathname+location.search)}catch(e){}}
function statusTip(s){return ({
 verified:"Previously accepted controlled verification; the date-stamped checkpoint is not live telemetry.",
 standard:"Documented operating standard. Implementation must be checked against the target product.",
 reference:"Documented or modelled process. Verification may be needed for a specific product.",
 gate:"Requires authorization or evidence before execution. This diagram never starts a deployment.",
 frozen:"Previously frozen after controlled acceptance. Do not change without authorization.",
 pending:"Incomplete or not freshly verified against the current environment.",
 planned:"Roadmap only; do not assume this has been implemented."
 })[s]||"Reference architecture checkpoint."}
function siblingNext(n){
 if(n.depth<0)return null;
 const siblings=n.parentId?nodeMap.get(n.parentId).children:flowMap.get(n.flowId).stages;
 const i=siblings.findIndex(x=>x.id===n.id);return siblings[i+1]||null;
}
function showInspector(){
 const n=nodeMap.get(state.selected);if(!n)return;
 const f=flowMap.get(n.flowId),isFlow=n.depth===-1,kids=n.children||[],next=siblingNext(n);
 $("inspector").classList.add("open");state.inspector=true;
 $("inspectCode").textContent=(isFlow?"SYSTEM "+f.number:n.id)+" · "+(STATUS[n.status]||"Reference");
 $("inspectTitle").textContent=n.title;
 let body='<p class="inspector-lead">'+safe(isFlow?f.summary:n.desc||"See the related process checkpoint.")+'</p>';
 body+='<div class="info-band"><b>Owner</b> · '+safe(n.owner||f.owner)+'<br><b>Classification</b> · '+safe(statusTip(n.status))+'</div>';
 if(isFlow){
  body+='<button class="action-btn" type="button" data-nav="'+f.id+'">Explore '+safe(f.title)+' →</button>';
 }else{
  if(kids.length){
   body+='<button class="action-btn" type="button" data-expand="'+n.id+'">'+(state.expandedRoot===n.id||state.expandedChild===n.id?"Collapse detailed checkpoints":"Expand "+kids.length+" detailed checkpoints")+' ↘</button>';
  }
  if(next)body+='<button class="action-btn secondary" type="button" data-go="'+next.id+'">Next: '+safe(next.title)+' →</button>';
 }
 if(kids.length){
  body+='<div class="info-section"><h3>'+(isFlow?"Major process stages":"Inside this checkpoint")+'</h3><div class="inspector-list">'+kids.map(k=>'<button type="button" data-go="'+k.id+'" class="inspector-row"><span class="small-index">'+safe(k.id.replace(f.id+".",""))+'</span><span><b>'+safe(k.title)+'</b>'+(k.desc?'<br><span style="color:#7389a1">'+safe(k.desc)+'</span>':'')+'</span><span style="margin-left:auto;color:#7990a8">↗</span></button>').join("")+'</div></div>';
 }
 const links=(n.links||[]).concat(isFlow?f.links:[]);
 const unique=[...new Set(links)].filter(x=>nodeMap.has(x)&&x!==n.id);
 if(unique.length)body+='<div class="info-section"><h3>Cross-system connections</h3><div class="related-links">'+unique.map(x=>'<button type="button" class="related-btn" data-go="'+x+'">↗ '+safe(x+' · '+nodeMap.get(x).title)+'</button>').join("")+'</div></div>';
 if(!isFlow&&n.depth===0){
  body+='<div class="info-section"><h3>Process trace</h3><div class="info-chip">Flow '+f.number+'</div><div class="info-chip">Stage '+safe(n.id.split(".").slice(-1)[0])+' / '+f.stages.length+'</div><div class="info-chip">'+kids.length+' subchecks</div></div>';
 }
 body+='<div class="info-section"><h3>Share this exact checkpoint</h3><button type="button" class="action-btn secondary" data-copy>Copy deep link ↗</button></div>';
 $("inspectorContent").innerHTML=body;
}
function closeInspector(){state.inspector=false;$("inspector").classList.remove("open");$("inspectTitle").textContent="";$("inspectCode").textContent=""}
function closeSearch(){$("searchResults").classList.remove("open")}
function closeMenu(){$("sidebar").classList.remove("open");$("sidebarOverlay").classList.remove("open")}
function searchItems(){
 const q=search.value.trim().toLowerCase();
 if(!q){closeSearch();return}
 const results=allItems.filter(n=>[n.id,n.title,n.desc,n.summary,n.owner,flowMap.get(n.flowId).title].join(" ").toLowerCase().includes(q)).slice(0,24);
 $("searchResults").innerHTML=results.length?results.map(n=>'<button class="result" data-go="'+n.id+'" type="button"><small>'+safe(n.id+" · "+flowMap.get(n.flowId).title)+'</small><strong>'+safe(n.title)+'</strong><span>'+safe((n.desc||n.summary||"").slice(0,120))+'</span></button>').join(""):'<div class="empty-search">No matching process. Try "licence", "rollback" or "sale".</div>';
 $("searchResults").classList.add("open");
}
function updateRelated(){
 world.querySelectorAll(".diagram-node").forEach(el=>el.classList.remove("related","muted"));
 edgesLayer.querySelectorAll(".edge").forEach(el=>{el.classList.remove("highlight","muted");el.setAttribute("marker-end","url(#atlas-arrow)")});
 if(!state.selected||state.flowId)return;
 const related=new Set([state.selected]);
 state.renderedEdges.forEach(e=>{if(e.from===state.selected)related.add(e.to);if(e.to===state.selected)related.add(e.from)});
 world.querySelectorAll(".diagram-node").forEach(el=>el.classList.add(related.has(el.dataset.node)?"related":"muted"));
 edgesLayer.querySelectorAll(".edge").forEach(el=>{
  const relatedEdge=el.dataset.from===state.selected||el.dataset.to===state.selected;
  el.classList.add(relatedEdge?"highlight":"muted");
  if(relatedEdge)el.setAttribute("marker-end","url(#atlas-arrow-hot)");
 });
}
function onNode(id){
 const n=nodeMap.get(id);
 if(!n)return;
 if(n.depth<0){setActiveFlow(id);return}
 route(id,{autoExpand:true});
}
function zoomTo(target,cx,cy){
 const old=state.scale,scale=Math.max(.30,Math.min(2.05,target));
 const x=cx==null?wrap.clientWidth/2:cx,y=cy==null?wrap.clientHeight/2:cy;
 state.tx=x-(x-state.tx)*(scale/old);
 state.ty=y-(y-state.ty)*(scale/old);
 state.scale=scale;applyTransform();
}
function toast(message){
 $("toast").textContent=message;$("toast").classList.add("show");clearTimeout(toast.t);
 toast.t=setTimeout(()=>$("toast").classList.remove("show"),2400);
}
function exportData(){
 const json=JSON.stringify(A,null,2),blob=new Blob([json],{type:"application/json"}),url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download="THYNKVERSE-FLOW-ARCHITECTURE-v"+A.version+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 toast("Architecture JSON exported");
}
document.addEventListener("click",e=>{
 const expandEl=e.target.closest("[data-expand]");
 if(expandEl){e.preventDefault();e.stopPropagation();expand(expandEl.dataset.expand);return}
 const go=e.target.closest("[data-go]");
 if(go){e.preventDefault();route(go.dataset.go);return}
 const nav=e.target.closest("[data-nav]");
 if(nav){e.preventDefault();setActiveFlow(nav.dataset.nav);return}
 const node=e.target.closest("[data-node]");
 if(node){onNode(node.dataset.node);return}
 if(e.target.closest("[data-copy]")){
  const href=location.href;
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(href).then(()=>toast("Deep link copied")).catch(()=>toast("Use the address bar to copy this link"));
  else toast("Use the address bar to copy this link");
  return;
 }
 if(!e.target.closest(".search-wrap"))closeSearch();
});
nodesLayer.addEventListener("keydown",e=>{
 if((e.key==="Enter"||e.key===" ")&&e.target.closest("[data-expand]")){e.preventDefault();expand(e.target.closest("[data-expand]").dataset.expand)}
 else if((e.key==="Enter"||e.key===" ")&&e.target.closest("[data-node]")){e.preventDefault();onNode(e.target.closest("[data-node]").dataset.node)}
});
wrap.addEventListener("pointerdown",e=>{
 if(e.button!==0||e.target.closest(".diagram-node"))return;
 state.drag={id:e.pointerId,x:e.clientX,y:e.clientY,tx:state.tx,ty:state.ty};
 wrap.setPointerCapture(e.pointerId);wrap.classList.add("is-dragging");
});
wrap.addEventListener("pointermove",e=>{
 if(!state.drag||state.drag.id!==e.pointerId)return;
 state.tx=state.drag.tx+e.clientX-state.drag.x;state.ty=state.drag.ty+e.clientY-state.drag.y;applyTransform();
});
function endDrag(e){if(state.drag&&state.drag.id===e.pointerId){state.drag=null;wrap.classList.remove("is-dragging");try{wrap.releasePointerCapture(e.pointerId)}catch(err){}}}
wrap.addEventListener("pointerup",endDrag);wrap.addEventListener("pointercancel",endDrag);
wrap.addEventListener("wheel",e=>{e.preventDefault();const rect=wrap.getBoundingClientRect();zoomTo(state.scale*(e.deltaY<0?1.11:.9),e.clientX-rect.left,e.clientY-rect.top)},{passive:false});
$("fitBtn").onclick=fitAll;$("zoomIn").onclick=()=>zoomTo(state.scale*1.2);$("zoomOut").onclick=()=>zoomTo(state.scale/1.2);
$("backBtn").onclick=()=>setActiveFlow(null);
$("menuBtn").onclick=()=>{$("sidebar").classList.toggle("open");$("sidebarOverlay").classList.toggle("open")};
$("sidebarOverlay").onclick=closeMenu;
$("closeInspector").onclick=()=>{closeInspector();state.selected=null;renderDiagram()};
$("demoBtn").onclick=()=>route("F06.8");
$("exportBtn").onclick=exportData;
$("crossToggle").onclick=()=>{
 state.showCross=!state.showCross;
 $("crossToggle").classList.toggle("active",state.showCross);
 $("crossToggle").textContent=state.showCross?"Cross-links ON":"Cross-links OFF";
 renderDiagram();updateRelated();
};
search.addEventListener("input",searchItems);
search.addEventListener("focus",()=>{if(search.value.trim())searchItems()});
document.addEventListener("keydown",e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();search.focus();search.select();return}
 if(e.key==="/"&&document.activeElement!==search&&!e.ctrlKey){e.preventDefault();search.focus();return}
 if(e.key==="Escape"){if(document.activeElement===search)search.blur();closeSearch();closeInspector();return}
 if(e.key==="0"&&document.activeElement!==search){fitAll();return}
 if(e.key==="+"&&document.activeElement!==search)zoomTo(state.scale*1.2);
 if(e.key==="-"&&document.activeElement!==search)zoomTo(state.scale/1.2);
});
window.addEventListener("resize",()=>{if(!state.selected&&!state.flowId)defaultFraming()});
window.addEventListener("hashchange",()=>{let hash="";try{hash=decodeURIComponent(location.hash.slice(1))}catch(e){}if(hash&&nodeMap.has(hash)&&hash!==state.selected)route(hash)});
renderNav();
let first="";try{first=decodeURIComponent(location.hash.slice(1))}catch(e){}
if(first&&nodeMap.has(first))route(first);else setActiveFlow(null);
$("crossToggle").classList.add("active");
})();
