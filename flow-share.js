/* Thynkverse Flow — secure read-only client snapshot. The server validates expiry before revealing any content. */
(function(){
"use strict";
const $=id=>document.getElementById(id),params=new URLSearchParams(location.search);
const token=params.get("token"),world=$("shareWorld"),nodes=$("shareNodes"),svg=$("shareEdges"),viewport=$("shareViewport");
const size={w:2800,h:1900},cam={s:1,x:0,y:0},state={snapshot:null,pointer:null};
const safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function error(msg,status){
 $("shareLoading").hidden=true;$("shareError").hidden=false;
 $("errorTitle").textContent=status===410?"This client link has expired":"This link cannot be opened";
 $("errorText").textContent=msg||"Please request a fresh Business Structure link from the sender.";
 $("expiryLabel").textContent=status===410?"Expired link":"Unavailable";
}
function draw(){
 const d=state.snapshot;if(!d)return;
 nodes.innerHTML=d.nodes.map(n=>'<button type="button" class="process-node '+safe(n.kind)+'" data-process="'+safe(n.id)+'" style="left:'+n.x+'px;top:'+n.y+'px"><span class="node-head"><small>'+safe(n.kind.toUpperCase())+'</small><em>'+safe(d.industry)+'</em></span><strong>'+safe(n.title)+'</strong><span class="descr">'+safe(n.description||"Select to read details")+'</span><span class="node-foot">'+d.links.filter(l=>l.from===n.id).length+' connections</span></button>').join("");
 const lookup=new Map(d.nodes.map(n=>[n.id,n]));
 let html='<defs><marker id="clientArrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0L9 4L0 8Z" fill="#8298ad"/></marker></defs>';
 for(const l of d.links){
  const a=lookup.get(l.from),b=lookup.get(l.to);if(!a||!b)continue;
  const right=b.x>=a.x,ax=right?a.x+235:a.x,bx=right?b.x:b.x+235,ay=a.y+66,by=b.y+66,k=Math.max(45,Math.abs(bx-ax)*.42);
  const path='M'+ax+','+ay+' C'+(ax+(right?k:-k))+','+ay+' '+(bx-(right?k:-k))+','+by+' '+bx+','+by;
  html+='<path class="edge-line '+(l.type==="decision"?"decision":l.type==="cross"?"cross":"")+'" d="'+path+'" marker-end="url(#clientArrow)"/>';
  if(l.label)html+='<text class="edge-label" x="'+((a.x+b.x+235)/2)+'" y="'+((a.y+b.y+140)/2)+'">'+safe(l.label.slice(0,35))+'</text>';
 }
 svg.innerHTML=html;svg.setAttribute("width",size.w);svg.setAttribute("height",size.h);
 svg.setAttribute("viewBox","0 0 "+size.w+" "+size.h);
}
function transform(){world.style.transform='translate('+cam.x+'px,'+cam.y+'px) scale('+cam.s+')';$("shareScale").textContent=Math.round(cam.s*100)+"%"}
function fit(){
 const d=state.snapshot;if(!d)return;let minX=80,maxX=1000,minY=70,maxY=630;
 if(d.nodes.length){minX=Math.min(...d.nodes.map(n=>n.x))-80;maxX=Math.max(...d.nodes.map(n=>n.x+235))+80;minY=Math.min(...d.nodes.map(n=>n.y))-80;maxY=Math.max(...d.nodes.map(n=>n.y+145))+80}
 const cw=viewport.clientWidth||1000,ch=viewport.clientHeight||700;
 cam.s=Math.max(.32,Math.min(1.12,(cw-50)/(maxX-minX),(ch-70)/(maxY-minY)));
 cam.x=(cw-(minX+maxX)*cam.s)/2;cam.y=(ch-(minY+maxY)*cam.s)/2;transform();
}
function zoom(f){const old=cam.s,next=Math.max(.3,Math.min(1.85,old*f)),cx=(viewport.clientWidth||900)/2,cy=(viewport.clientHeight||700)/2;cam.x=cx-(cx-cam.x)*(next/old);cam.y=cy-(cy-cam.y)*(next/old);cam.s=next;transform()}
$("shareFit").onclick=fit;$("shareMinus").onclick=()=>zoom(1/1.15);$("sharePlus").onclick=()=>zoom(1.15);
viewport.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY<0?1.1:1/1.1)},{passive:false});
viewport.addEventListener("pointerdown",e=>{if(e.button!==0||e.target.closest(".process-node"))return;state.pointer={id:e.pointerId,x:e.clientX,y:e.clientY,ox:cam.x,oy:cam.y};viewport.setPointerCapture(e.pointerId)});
viewport.addEventListener("pointermove",e=>{const a=state.pointer;if(a?.id!==e.pointerId)return;cam.x=a.ox+e.clientX-a.x;cam.y=a.oy+e.clientY-a.y;transform()});
function stop(e){if(state.pointer?.id!==e.pointerId)return;state.pointer=null;try{viewport.releasePointerCapture(e.pointerId)}catch(err){}}
viewport.addEventListener("pointerup",stop);viewport.addEventListener("pointercancel",stop);
nodes.addEventListener("click",e=>{
 const el=e.target.closest("[data-process]");if(!el)return;
 const d=state.snapshot,n=d?.nodes.find(x=>x.id===el.dataset.process);if(!n)return;
 $("shareDetailTitle").textContent=n.title;
 const outgoing=d.links.filter(l=>l.from===n.id),body=$("shareDetailBody");
 body.innerHTML='<div class="share-detail"><label>Process type</label><p>'+safe(n.kind)+'</p><label>Description</label><p>'+safe(n.description||"Not provided in this snapshot")+'</p><label>Responsible owner</label><p>'+safe(n.owner||"Not assigned")+'</p><label>Outgoing relationships</label></div>'+
 (outgoing.map(l=>{
  const next=d.nodes.find(x=>x.id===l.to);
  return'<div class="share-link-row">'+safe(l.label||l.type)+' → '+safe(next?.title||"Other diagram (not included)")+'</div>';
 }).join("")||'<p>No outgoing relationships.</p>');
 $("shareDetails").classList.add("open");$("shareDetails").setAttribute("aria-hidden","false");$("shareScrim").classList.add("open");
});
function close(){
 $("shareDetails").classList.remove("open");$("shareDetails").setAttribute("aria-hidden","true");$("shareScrim").classList.remove("open");
}
$("shareScrim").onclick=$("shareCloseDetails").onclick=close;
document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
async function load(){
 if(!token||token.length>12000)return error("Missing or invalid link",400);
 try{
  const r=await fetch("/api/flow-share?token="+encodeURIComponent(token),{cache:"no-store",headers:{"Accept":"application/json"}});
  const data=await r.json();
  if(!r.ok)return error(data.error||"Unable to open the link",r.status);
  if(!data.diagram||!Array.isArray(data.diagram.nodes))throw Error("The shared diagram has no valid data");
  state.snapshot=data.diagram;
  $("shareName").textContent=data.diagram.name;
  $("shareIndustry").textContent=data.diagram.industry;
  const expiresAt=new Date(data.expiresAt).toLocaleString("en-ZA",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
  $("shareExpiry").textContent="Expires "+expiresAt;$("expiryLabel").textContent="Valid until "+expiresAt;
  $("shareLoading").hidden=true;$("shareView").hidden=false;
  world.style.width=size.w+"px";world.style.height=size.h+"px";nodes.style.width=size.w+"px";nodes.style.height=size.h+"px";
  draw();requestAnimationFrame(fit);
 }catch(err){error(err.message||"Unable to verify your link",0)}
}
load();
})();
