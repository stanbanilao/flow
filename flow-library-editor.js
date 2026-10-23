/* FLOW 4.1 — process editing, connections, revisions and browser backup. */
(function(){
"use strict";
const L=window.FlowLib;if(!L)throw Error("Flow Library core missing");
const {$,state,esc,clean,uid,clone,now,current,persist,save,notify,renderBoard,redrawEdges,openDrawer,closeDrawer,modal,closeModal,renderHome,openDiagram,home,worldSize,elements}=L;
let drag=null;
const kindNames={start:"Start",process:"Process",decision:"Decision",end:"Finish",system:"System"};
function addNode(){
 const d=current();if(!d)return;
 if(d.nodes.length>=120){notify("This diagram has reached its node limit");return}
 const base=d.nodes[d.nodes.length-1],next={id:uid(),title:"New process",kind:"process",description:"",owner:"",x:base?Math.min(base.x+300,worldSize.w-320):175,y:base?Math.min(base.y+20,worldSize.h-220):160};
 save(x=>x.nodes.push(next));renderBoard();state.selectedId=next.id;openInspector();
}
$("addNode").onclick=addNode;
function selectNode(id){
 const d=current(),n=d?.nodes.find(x=>x.id===id);if(!n)return;
 if(state.connectFrom){
  const source=state.connectFrom;state.connectFrom=null;$("connectionPrompt").hidden=true;
  if(source===id){notify("Choose a different process");return}
  return connectDialog(source,id);
 }
 state.selectedId=id;renderBoard();openInspector();
}
function openInspector(){
 const d=current(),n=d?.nodes.find(x=>x.id===state.selectedId);
 $("drawerKicker").textContent=n?"PROCESS DEFINITION":"DIAGRAM CONTROLS";
 $("drawerTitle").textContent=n?n.title:d?.name||"Process library";
 $("drawerSubtitle").textContent=n?"Edit the step, connect a process or link to another diagram.":"Select a process box to edit it or add another.";
 if(!n){
  $("drawerContent").innerHTML='<p>Each node can carry its own description and ownership. Select a node to create its outgoing links.</p><div class="panel-buttons"><button class="primary" data-panel="add-node">+ New process</button><button class="quiet" data-panel="rename">Rename diagram</button></div>';
  openDrawer($("editorDrawer"));return;
 }
 const outs=d.links.filter(l=>l.from===n.id),incoming=d.links.filter(l=>l.to===n.id);
 const selfList=d.nodes.filter(x=>x.id!==n.id);
 const linkViews=outs.map(l=>{
  const other=l.to?d.nodes.find(x=>x.id===l.to):L.state.library.find(x=>x.id===l.toDiagram);
  if(!other)return"";
  return '<div class="list-link"><span><strong>'+esc(other.title||other.name)+'</strong><small>'+esc(l.type)+(l.label?" · "+esc(l.label):"")+(l.toDiagram?" · Other diagram":"")+'</small></span><button class="x" type="button" data-remove-link="'+esc(l.id)+'" aria-label="Delete connection to '+esc(other.title||other.name)+'">×</button></div>';
 }).join("");
 $("drawerContent").innerHTML=
 '<div class="field"><label for="nodeTitle">Process name</label><input id="nodeTitle" data-node-field="title" maxlength="95" value="'+esc(n.title)+'"></div>'+
 '<div class="field"><label for="nodeKind">Type</label><select id="nodeKind" data-node-field="kind">'+Object.entries(kindNames).map(([v,t])=>'<option value="'+v+'"'+(v===n.kind?" selected":"")+'>'+t+'</option>').join("")+'</select></div>'+
 '<div class="field"><label for="nodeOwner">Owner or department</label><input id="nodeOwner" data-node-field="owner" maxlength="100" value="'+esc(n.owner||"")+'" placeholder="Responsible role"></div>'+
 '<div class="field"><label for="nodeDescription">Process explanation</label><textarea id="nodeDescription" data-node-field="description" maxlength="700" placeholder="What happens here?">'+esc(n.description||"")+'</textarea></div>'+
 '<div class="panel-buttons"><button class="primary" data-panel="connect">↗ Connect a process</button><button class="outline" data-panel="connect-diagram">Link another diagram</button></div>'+
 '<h3>Outgoing connections ('+outs.length+')</h3>'+(linkViews||'<p>No outgoing links yet. Use Connect a process above.</p>')+
 '<h3>Incoming connections ('+incoming.length+')</h3>'+ (incoming.map(l=>'<button class="list-link" data-select-node="'+esc(l.from)+'">'+esc(d.nodes.find(x=>x.id===l.from)?.title||"Source process")+' <b>↗</b></button>').join("")||'<p>No incoming links.</p>')+
 '<h3>Process controls</h3><div class="panel-buttons"><button class="quiet" data-panel="add-node">+ Another step</button><button class="quiet danger" data-panel="remove-node">Delete this process</button></div>';
 openDrawer($("editorDrawer"));
}
L.openInspector=openInspector;L.selectNode=selectNode;
$("drawerContent").addEventListener("input",e=>{
 const k=e.target.dataset.nodeField;if(!k||k==="kind")return;
 const value=clean(e.target.value,k==="description"?700:k==="title"?95:100);
 save(d=>{const n=d.nodes.find(x=>x.id===state.selectedId);if(n)n[k]=value});
 if(k==="title")$("drawerTitle").textContent=value||"Untitled process";
 // Update canvas without rebuilding inspector or moving the camera.
 renderBoard();
});
$("drawerContent").addEventListener("change",e=>{
 if(e.target.dataset.nodeField!=="kind")return;
 const value=e.target.value;if(!kindNames[value])return;
 save(d=>{const n=d.nodes.find(x=>x.id===state.selectedId);if(n)n.kind=value});renderBoard();
});
$("drawerContent").addEventListener("click",e=>{
 const select=e.target.closest("[data-select-node]");if(select){selectNode(select.dataset.selectNode);return}
 const remove=e.target.closest("[data-remove-link]");if(remove){save(d=>d.links=d.links.filter(l=>l.id!==remove.dataset.removeLink));renderBoard();openInspector();return}
 const btn=e.target.closest("[data-panel]");if(!btn)return;
 const action=btn.dataset.panel;
 if(action==="connect"){
  if(!state.selectedId){notify("Select a process first");return}
  state.connectFrom=state.selectedId;$("connectionText").textContent="Choose the destination for "+(current()?.nodes.find(x=>x.id===state.selectedId)?.title||"this process");
  $("connectionPrompt").hidden=false;closeDrawer();
 }
 if(action==="connect-diagram")linkAnotherDiagram();
 if(action==="add-node"){closeDrawer();addNode()}
 if(action==="remove-node"){
  const d=current(),n=d?.nodes.find(x=>x.id===state.selectedId);if(!n)return;
  if(!window.confirm("Delete "+n.title+" and its connections?"))return;
  save(x=>{x.nodes=x.nodes.filter(a=>a.id!==n.id);x.links=x.links.filter(l=>l.from!==n.id&&l.to!==n.id)});
  state.selectedId=null;closeDrawer();renderBoard();notify("Process deleted");
 }
 if(action==="rename")renameDiagram();
});
$("cancelConnection").onclick=()=>{state.connectFrom=null;$("connectionPrompt").hidden=true};
function connectDialog(from,to){
 const d=current();if(!d)return;
 const first=d.nodes.find(x=>x.id===from),second=d.nodes.find(x=>x.id===to);
 if(!first||!second)return;
 modal({kicker:"PROCESS CONNECTION",title:"Connect these processes",intro:first.title+" → "+second.title,action:"Create connection",
 fields:'<div class="field"><label>Connection type</label><select id="linkType"><option value="sequence">Normal process sequence</option><option value="decision">Decision outcome</option><option value="cross">Cross-functional relationship</option></select></div>'+
 '<div class="field"><label>Arrow label (optional)</label><input id="linkLabel" maxlength="55" placeholder="e.g. Yes, Approved, Escalates to"></div>',
 onSubmit:()=>{
  const kind=$("linkType").value,label=clean($("linkLabel").value,55);
  if(d.links.length>=260)throw Error("Connection limit reached");
  if(d.links.some(l=>l.from===from&&l.to===to))throw Error("This connection already exists");
  save(x=>x.links.push({id:uid(),from,to,type:kind,label}));
  closeModal();renderBoard();state.selectedId=from;openInspector();notify("Connection created");
 }});
}
function linkAnotherDiagram(){
 const d=current(),from=state.selectedId,others=state.library.filter(x=>x.id!==d?.id);
 if(!d||!from)return;
 if(!others.length){notify("Create a second diagram in your library first");return}
 modal({kicker:"CROSS-DIAGRAM CONNECTION",title:"Link another industry diagram",intro:"This gateway will open the selected diagram. It does not merge the two workflows.",
 action:"Create diagram link",
 fields:'<div class="field"><label>Destination diagram</label><select id="targetDiagram">'+others.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.industry+" / "+x.name)+'</option>').join("")+'</select></div>'+
 '<div class="field"><label>Meaning of the link</label><input id="linkLabel" maxlength="55" placeholder="e.g. Send to Finance"></div>',
 onSubmit:()=>{
  const toDiagram=$("targetDiagram").value,label=clean($("linkLabel").value,55);
  if(!state.library.some(x=>x.id===toDiagram))throw Error("Choose a valid diagram");
  save(x=>x.links.push({id:uid(),from,toDiagram,type:"cross",label}));
  closeModal();renderBoard();openInspector();notify("Cross-diagram link created");
 }});
}
function captureVersion(note){
 const d=current();if(!d)return;
 const snap={id:uid(),at:now(),note:clean(note,120)||"Manual checkpoint",nodes:clone(d.nodes),links:clone(d.links)};
 save(x=>{x.versions.unshift(snap);x.versions=x.versions.slice(0,25)});notify("Version saved");
}
$("saveRevision").onclick=()=>modal({kicker:"SAVE CHECKPOINT",title:"Name this version",intro:"Save a recoverable snapshot of all nodes and relationships.",action:"Save version",
 fields:'<div class="field"><label>Version note</label><input id="versionNote" maxlength="120" value="Workflow checkpoint" required></div>',
 onSubmit:()=>{captureVersion($("versionNote").value);closeModal()}});
function showHistory(){
 const d=current();if(!d)return;
 $("versionItems").innerHTML=(d.versions?.length?d.versions.map(v=>'<button class="list-link" data-version="'+esc(v.id)+'"><span><strong>'+esc(v.note)+'</strong><small>'+L.time(v.at)+' · '+v.nodes.length+' steps · '+v.links.length+' links</small></span><b>Restore ↗</b></button>').join(""):'<div class="warning">No snapshots saved yet. Use Save version before making major changes.</div>')+
 '<h3>Back up</h3><div class="panel-buttons"><button class="quiet" data-export-current>Export JSON</button><button class="quiet" data-import-current>Import JSON</button></div>';
 openDrawer($("versionDrawer"));
}
$("versionsOpen").onclick=showHistory;
$("versionItems").onclick=e=>{
 const v=e.target.closest("[data-version]");
 if(v){
  const d=current(),snap=d.versions.find(x=>x.id===v.dataset.version);if(!snap)return;
  if(!window.confirm("Restore "+snap.note+"? Current work will be saved as a new version first."))return;
  captureVersion("Before restoration");save(x=>{x.nodes=clone(snap.nodes);x.links=clone(snap.links)});
  closeDrawer();renderBoard();notify("Previous version restored");return;
 }
 if(e.target.closest("[data-export-current]"))exportDiagram();
 if(e.target.closest("[data-import-current]")){$("importFile").dataset.mode="diagram";$("importFile").click()}
};
function renameDiagram(){
 const d=current();if(!d)return;
 modal({kicker:"DIAGRAM SETTINGS",title:"Rename this diagram",intro:"Update the industry or diagram title.",
 fields:'<div class="field"><label>Name</label><input id="newName" value="'+esc(d.name)+'" maxlength="90" required></div><div class="field"><label>Industry</label><select id="newIndustry">'+L.industries.map(x=>'<option'+(x===d.industry?" selected":"")+'>'+esc(x)+'</option>').join("")+'</select></div>',
 action:"Save changes",
 onSubmit:()=>{const name=clean($("newName").value,90),industry=$("newIndustry").value;if(!name)throw Error("Diagram needs a name");save(x=>{x.name=name;x.industry=industry});$("editorName").textContent=name;$("editorIndustry").textContent=industry;closeModal();renderBoard()}});
}
$("renameDiagram").onclick=renameDiagram;
function download(obj,name){
 const blob=new Blob([JSON.stringify(obj,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
}
function exportDiagram(){const d=current();if(d){download({kind:"FLOW41_DIAGRAM",diagram:clone(d)},"Flow-"+d.name.replace(/[^a-z0-9_-]/gi,"-")+".json");notify("Diagram exported")}}
function exportLibrary(){download({kind:"FLOW41_LIBRARY",version:41,exportedAt:now(),library:state.library},"Thynkverse-FLOW-Library-Backup.json");notify("Entire diagram library exported")}
$("exportAll").onclick=exportLibrary;
$("importLibrary").onclick=()=>{$("importFile").dataset.mode="diagram";$("importFile").click()};
$("importFile").onchange=async e=>{
 const file=e.target.files?.[0];e.target.value="";if(!file)return;
 if(file.size>1500000){notify("This JSON file is too large");return}
 try{
  const parsed=JSON.parse(await file.text());
  const items=parsed.kind==="FLOW41_LIBRARY"?parsed.library:[parsed.diagram||parsed];
  if(!Array.isArray(items)||items.length>65)throw Error("Invalid library JSON");
  let count=0;
  for(const raw of items){
   if(!raw||!Array.isArray(raw.nodes)||!Array.isArray(raw.links)||raw.nodes.length>120||raw.links.length>260)continue;
   const d={...raw,id:uid(),name:clean(raw.name,90)||"Imported workflow",industry:L.industries.includes(raw.industry)?raw.industry:"Other",createdAt:now(),updatedAt:now(),versions:[]};
   if(state.library.length>=65)break;
   state.library.unshift(d);count++;
  }
  persist();closeDrawer();renderHome();notify(count+" diagram(s) imported as separate copies");
 }catch(err){notify(err.message||"Invalid diagram JSON")}
};
elements.nodes.addEventListener("pointerdown",e=>{
 const item=e.target.closest(".process-node");if(!item||e.button!==0)return;
 const d=current(),n=d?.nodes.find(x=>x.id===item.dataset.node);if(!n)return;
 drag={id:e.pointerId,nodeId:n.id,x:e.clientX,y:e.clientY,ox:n.x,oy:n.y,moved:false,element:item};
 item.setPointerCapture(e.pointerId);e.stopPropagation();
});
elements.nodes.addEventListener("pointermove",e=>{
 if(!drag||e.pointerId!==drag.id)return;
 const d=current(),n=d?.nodes.find(x=>x.id===drag.nodeId);if(!n)return;
 const dx=(e.clientX-drag.x)/state.pan.scale,dy=(e.clientY-drag.y)/state.pan.scale;
 if(Math.abs(dx)+Math.abs(dy)>4)drag.moved=true;
 if(!drag.moved)return;
 n.x=Math.round(Math.max(10,Math.min(worldSize.w-250,drag.ox+dx)));n.y=Math.round(Math.max(10,Math.min(worldSize.h-180,drag.oy+dy)));
 drag.element.style.left=n.x+"px";drag.element.style.top=n.y+"px";redrawEdges();
});
function stopNode(e){
 if(!drag||e.pointerId!==drag.id)return;
 const nodeId=drag.nodeId,moved=drag.moved,el=drag.element;
 try{el.releasePointerCapture(e.pointerId)}catch(err){}
 drag=null;
 if(moved){save(()=>{});renderBoard()}else selectNode(nodeId);
}
elements.nodes.addEventListener("pointerup",stopNode);elements.nodes.addEventListener("pointercancel",stopNode);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("modalShade").hidden)closeModal();else if(state.connectFrom){state.connectFrom=null;$("connectionPrompt").hidden=true}else closeDrawer()}});
window.FlowLibraryEditor={addNode,selectNode,openInspector,connectDialog,linkAnotherDiagram,showHistory,exportDiagram,captureVersion};
})();
