/* FLOW 4.1 — Diagram Library core. Existing Flow Studio and Atlas remain unchanged. */
(function(){
"use strict";
const $=id=>document.getElementById(id),KEY="thynkverse-flow-library-v41";
const industries=["Debt Review","Joinery & Estimating","Security Automation","Mediation","Other"];
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clean=(s,n=160)=>String(s??"").replace(/[\u0000-\u001F\u007F]/g," ").trim().slice(0,n);
const uid=()=>crypto.randomUUID?.()||"node-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);
const clone=o=>JSON.parse(JSON.stringify(o)),now=()=>new Date().toISOString();
const time=s=>{const t=Date.parse(s);return Number.isFinite(t)?new Date(t).toLocaleString("en-ZA",{day:"2-digit",month:"short",year:"numeric"}):"Draft"};
const templates=[
{industry:"Debt Review",icon:"◈",subtitle:"Sales, confirmation, servicing and collections",name:"Debt Review lifecycle",steps:["Qualify lead","Client intake","Check uniqueness","Submit sale","Confirm documents","Operations handoff","Payment schedule","Collections monitoring"]},
{industry:"Joinery & Estimating",icon:"⌁",subtitle:"Enquiry, quotation, production and installation",name:"Joinery project workflow",steps:["Customer enquiry","Site measurement","Prepare quotation","Customer approves?","Deposit and production order","Manufacture joinery","Quality inspection","Install on site","Issue final invoice"]},
{industry:"Security Automation",icon:"⌘",subtitle:"Detection, verification, escalation and reporting",name:"Security event workflow",steps:["Alarm event","Validate source","Event actionable?","Create incident","Notify recipient","Acknowledged?","Escalate","Close and report"]},
{industry:"Mediation",icon:"◇",subtitle:"Intake, negotiation and resolution",name:"Mediation case workflow",steps:["Open enquiry","Check suitability","Client consent?","Allocate mediator","Gather submissions","Mediation session","Agreement reached?","Record resolution"]}
];
const state={library:[],activeId:null,selectedId:null,connectFrom:null,mode:"home",pan:{scale:1,x:0,y:0},pointer:null,nodePointer:null,drawer:null,modalAction:null,returnTo:null,toastId:null};
const elements={viewport:$("panViewport"),world:$("diagramWorld"),nodes:$("diagramNodes"),edges:$("edgeSvg")};
const worldSize={w:2800,h:1900};
function notify(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(state.toastId);state.toastId=setTimeout(()=>el.classList.remove("show"),2400)}
function read(){
 try{const obj=JSON.parse(localStorage.getItem(KEY)||"{}");state.library=(Array.isArray(obj.library)?obj.library:[]).filter(d=>d&&Array.isArray(d.nodes)&&Array.isArray(d.links)).slice(0,65)}
 catch(e){state.library=[];notify("Unable to read this browser's saved library")}
}
function persist(){
 try{const data=JSON.stringify({version:41,library:state.library});if(data.length>2600000)throw Error("too large");localStorage.setItem(KEY,data);return true}
 catch(e){notify("Browser storage is full. Export the diagram library now.");return false}
}
function current(){return state.library.find(d=>d.id===state.activeId)||null}
function save(f){const d=current();if(!d)return;f(d);d.updatedAt=now();persist();$("editorUpdated").textContent="Updated "+time(d.updatedAt)}
function newDiagram(title,industry){return{id:uid(),name:clean(title,90),industry:industries.includes(industry)?industry:"Other",createdAt:now(),updatedAt:now(),nodes:[],links:[],versions:[]}}
function fromTemplate(t,title){
 const d=newDiagram(title||t.name,t.industry);
 d.nodes=t.steps.map((text,i)=>({id:uid(),title:text,kind:i===0?"start":i===t.steps.length-1?"end":text.endsWith("?")||text.includes("uniqueness")?"decision":"process",description:"Editable example — confirm against the business's actual process.",owner:"",x:135+(i%3)*330,y:130+Math.floor(i/3)*225}));
 d.links=d.nodes.slice(1).map((n,i)=>({id:uid(),from:d.nodes[i].id,to:n.id,type:d.nodes[i].kind==="decision"?"decision":"sequence",label:d.nodes[i].kind==="decision"?"Yes":""}));
 return d;
}
function renderHome(){
 const query=$("librarySearch").value.toLowerCase().trim(),filter=$("industryFilter").value;
 const diagrams=state.library.filter(d=>(filter==="all"||d.industry===filter)&&(!query||(d.name+" "+d.industry).toLowerCase().includes(query)));
 $("diagramCount").textContent=state.library.length;
 $("diagramGrid").innerHTML=diagrams.map(d=>'<button type="button" class="diagram-card" data-diagram="'+esc(d.id)+'"><span class="card-head"><span class="card-industry">'+esc(d.industry)+'</span><span class="card-icon">↗</span></span><h3>'+esc(d.name)+'</h3><p>Independent industry process map</p><span class="card-foot"><span>'+d.nodes.length+' steps · '+d.links.length+' connections</span><b>'+time(d.updatedAt)+'</b></span></button>').join("")||(!state.library.length?"":'<p class="warning">No diagrams match your search.</p>');
 $("emptyState").hidden=state.library.length!==0||Boolean(query)||filter!=="all";
 $("templateGrid").innerHTML=templates.map((t,i)=>'<button class="template" type="button" data-template="'+i+'"><span class="template-icon">'+t.icon+'</span><strong>'+esc(t.industry)+'</strong><small>'+esc(t.subtitle)+'</small></button>').join("");
}
function openDiagram(id){
 const d=state.library.find(x=>x.id===id);if(!d){notify("Diagram not saved in this browser");return}
 state.mode="editor";state.activeId=id;state.selectedId=null;state.connectFrom=null;
 closeDrawer();$("homeView").hidden=true;$("editorView").hidden=false;
 $("editorIndustry").textContent=d.industry;$("editorName").textContent=d.name;$("editorUpdated").textContent="Updated "+time(d.updatedAt);
 elements.world.style.width=worldSize.w+"px";elements.world.style.height=worldSize.h+"px";
 elements.nodes.style.width=worldSize.w+"px";elements.nodes.style.height=worldSize.h+"px";
 renderBoard();requestAnimationFrame(fit);history.replaceState(null,"","#"+encodeURIComponent(id));
}
function home(){state.mode="home";state.activeId=null;state.selectedId=null;state.connectFrom=null;closeDrawer();$("homeView").hidden=false;$("editorView").hidden=true;renderHome();history.replaceState(null,"",location.pathname)}
function nodeMarkup(n,d){
 const outgoing=d.links.filter(x=>x.from===n.id);
 return'<button type="button" class="process-node '+esc(n.kind||"process")+(n.id===state.selectedId?" selected":"")+'" data-node="'+esc(n.id)+'" style="left:'+n.x+'px;top:'+n.y+'px"><span class="node-head"><small>'+esc((n.kind||"process").toUpperCase())+'</small><em>'+esc(d.industry)+'</em></span><strong>'+esc(n.title)+'</strong><span class="descr">'+esc(n.description||"Click to define this process")+'</span><span class="node-foot"><span>'+outgoing.filter(x=>x.to).length+' connections</span>'+(outgoing.some(x=>x.toDiagram)?'<b>↗ Another diagram</b>':"")+'</span></button>';
}
function path(a,b){
 const right=b.x>=a.x,ax=right?a.x+235:a.x,bx=right?b.x:b.x+235,ay=a.y+66,by=b.y+66,k=Math.max(45,Math.abs(ax-bx)*.43);
 return'M'+ax+','+ay+' C'+(ax+(right?k:-k))+','+ay+' '+(bx-(right?k:-k))+','+by+' '+bx+','+by;
}
function redrawEdges(){
 const d=current();if(!d)return;const byId=new Map(d.nodes.map(n=>[n.id,n]));let lines='<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0L9 4L0 8Z" fill="#8298ad"/></marker></defs>';
 for(const l of d.links){if(!l.to)continue;const a=byId.get(l.from),b=byId.get(l.to);if(!a||!b)continue;lines+='<path class="edge-line '+(l.type==="decision"?"decision":l.type==="cross"?"cross":"")+'" d="'+path(a,b)+'" marker-end="url(#arrow)"/>';
 if(l.label)lines+='<text class="edge-label" x="'+((a.x+b.x+235)/2)+'" y="'+((a.y+b.y+140)/2)+'">'+esc(l.label.slice(0,35))+'</text>';}
 elements.edges.setAttribute("width",worldSize.w);elements.edges.setAttribute("height",worldSize.h);
 elements.edges.setAttribute("viewBox","0 0 "+worldSize.w+" "+worldSize.h);elements.edges.innerHTML=lines;
}
function renderBoard(){const d=current();if(!d)return;elements.nodes.innerHTML=d.nodes.map(n=>nodeMarkup(n,d)).join("");redrawEdges();transform()}
function transform(){state.pan.scale=Math.min(1.85,Math.max(.32,state.pan.scale));elements.world.style.transform="translate("+state.pan.x+"px,"+state.pan.y+"px) scale("+state.pan.scale+")";$("zoomValue").textContent=Math.round(state.pan.scale*100)+"%"}
function fit(){
 const d=current();if(!d)return;let minX=75,maxX=950,minY=75,maxY=630;
 if(d.nodes.length){minX=Math.min(...d.nodes.map(n=>n.x))-90;maxX=Math.max(...d.nodes.map(n=>n.x+235))+90;minY=Math.min(...d.nodes.map(n=>n.y))-100;maxY=Math.max(...d.nodes.map(n=>n.y+140))+100;}
 const w=elements.viewport.clientWidth||1200,h=elements.viewport.clientHeight||760;
 state.pan.scale=Math.max(.32,Math.min(1.1,(w-70)/(maxX-minX),(h-90)/(maxY-minY)));
 state.pan.x=(w-(minX+maxX)*state.pan.scale)/2;state.pan.y=(h-(minY+maxY)*state.pan.scale)/2;transform();
}
function zoom(factor,x,y){const old=state.pan.scale,next=Math.min(1.85,Math.max(.32,old*factor));state.pan.x=x-(x-state.pan.x)*(next/old);state.pan.y=y-(y-state.pan.y)*(next/old);state.pan.scale=next;transform()}
$("fitCanvas").onclick=fit;$("zoomIn").onclick=()=>zoom(1.17,(elements.viewport.clientWidth||900)/2,(elements.viewport.clientHeight||600)/2);$("zoomOut").onclick=()=>zoom(1/1.17,(elements.viewport.clientWidth||900)/2,(elements.viewport.clientHeight||600)/2);
elements.viewport.addEventListener("wheel",e=>{e.preventDefault();const r=elements.viewport.getBoundingClientRect();zoom(e.deltaY<0?1.09:1/1.09,e.clientX-r.left,e.clientY-r.top)},{passive:false});
elements.viewport.addEventListener("pointerdown",e=>{if(e.button!==0||e.target.closest(".process-node"))return;state.pointer={id:e.pointerId,x:e.clientX,y:e.clientY,ox:state.pan.x,oy:state.pan.y};elements.viewport.setPointerCapture(e.pointerId);elements.viewport.classList.add("panning")});
elements.viewport.addEventListener("pointermove",e=>{const p=state.pointer;if(!p||p.id!==e.pointerId)return;state.pan.x=p.ox+e.clientX-p.x;state.pan.y=p.oy+e.clientY-p.y;transform()});
function endPan(e){if(state.pointer?.id!==e.pointerId)return;state.pointer=null;elements.viewport.classList.remove("panning");try{elements.viewport.releasePointerCapture(e.pointerId)}catch(err){}}
elements.viewport.addEventListener("pointerup",endPan);elements.viewport.addEventListener("pointercancel",endPan);
function closeDrawer(){if(state.drawer){state.drawer.classList.remove("open");state.drawer.setAttribute("aria-hidden","true")}state.drawer=null;$("drawerScrim").classList.remove("open");$("editorPanelOpen").setAttribute("aria-expanded","false")}
function openDrawer(panel){closeDrawer();state.drawer=panel;panel.classList.add("open");panel.setAttribute("aria-hidden","false");$("drawerScrim").classList.add("open");$("editorPanelOpen").setAttribute("aria-expanded","true")}
$("drawerScrim").onclick=closeDrawer;$("drawerClose").onclick=$("versionClose").onclick=closeDrawer;
$("editorPanelOpen").onclick=()=>state.drawer?closeDrawer():openInspector();
function modal(config){
 state.modalAction=config.onSubmit;$("modalKicker").textContent=config.kicker||"FLOW LIBRARY";$("modalTitle").textContent=config.title;$("modalIntro").textContent=config.intro||"";
 $("modalFields").innerHTML=config.fields||"";$("modalSubmit").textContent=config.action||"Continue";$("modalMessage").textContent="";$("modalShade").hidden=false;
 requestAnimationFrame(()=>$("modalFields").querySelector("input,select,textarea")?.focus());
}
function closeModal(){$("modalShade").hidden=true;state.modalAction=null}
$("modalClose").onclick=$("modalCancel").onclick=closeModal;
$("modalShade").addEventListener("pointerdown",e=>{if(e.target===$("modalShade"))closeModal()});
$("modalForm").onsubmit=async e=>{e.preventDefault();if(!state.modalAction)return;try{await state.modalAction()}catch(err){$("modalMessage").textContent=err.message||"Please check the fields"}};
function createDialog(tIndex){
 const t=Number.isInteger(tIndex)?templates[tIndex]:null;
 modal({kicker:"NEW WORKFLOW",title:t?"Start with "+t.industry:"Create a business diagram",intro:"Each industry diagram is separate. Connect it with another diagram when needed.",
 fields:'<div class="field"><label for="dialogName">Diagram name *</label><input id="dialogName" maxlength="90" required value="'+esc(t?.name||"")+'" placeholder="E.g. Client onboarding"></div><div class="field"><label for="dialogIndustry">Industry</label><select id="dialogIndustry">'+industries.map(x=>'<option'+(x===(t?.industry||"Other")?" selected":"")+'>'+esc(x)+'</option>').join("")+'</select></div>',
 action:"Create diagram",onSubmit:()=>{if(state.library.length>=65)throw Error("Library limit reached. Export your library first.");const name=clean($("dialogName").value,90),industry=$("dialogIndustry").value;if(!name)throw Error("Enter a diagram name");const d=t?fromTemplate(t,name):newDiagram(name,industry);d.industry=industry;state.library.unshift(d);if(!persist()){state.library.shift();throw Error("Browser storage unavailable")}closeModal();openDiagram(d.id)}});
}
$("newDiagram").onclick=$("emptyCreate").onclick=()=>createDialog();
$("librarySearch").oninput=renderHome;$("industryFilter").onchange=renderHome;
$("backLibrary").onclick=home;
document.addEventListener("click",e=>{const a=e.target.closest("[data-diagram]");if(a){openDiagram(a.dataset.diagram);return}const t=e.target.closest("[data-template]");if(t){createDialog(Number(t.dataset.template));return}});
read();renderHome();
try{const id=decodeURIComponent(location.hash.slice(1));if(state.library.some(d=>d.id===id))openDiagram(id)}catch(e){}
window.FlowLib={state,$,KEY,industries,uid,esc,clean,clone,now,time,templates,current,persist,save,notify,renderHome,renderBoard,redrawEdges,fit,transform,openDiagram,home,openDrawer,closeDrawer,modal,closeModal,newDiagram,fromTemplate,worldSize,nodeMarkup,buildPath:path,elements};
})();
