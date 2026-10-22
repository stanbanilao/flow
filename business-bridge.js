/* FLOW Business Structure extension.
 * The original business-flow.html is untouched. This bridge runs in business-engine.html.
 * Edits remain local drafts until intentionally shared/exported.
 */
(function(){
"use strict";
const BASE_CATS=["company","department","product","process","checkpoint","system","thynkverse"];
const clean=(value,max=500)=>String(value??"").replace(/[<>&"'\u0060]/g,"").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g," ").trim().slice(0,max);
const categoryName={company:"Company",department:"Department",product:"Product",process:"Process",checkpoint:"Checkpoint",system:"IT / System",thynkverse:"Thynkverse"};
const added=new Set();
function parseList(v,limit){return (Array.isArray(v)?v:String(v||"").split(",")).map(x=>clean(x,125)).filter(Boolean).slice(0,limit)}
function normalize(input){
 const p=input||{};
 return {id:/^[a-z0-9_-]{4,45}$/i.test(p.id||"")?p.id:"",parent:clean(p.parent,45),title:clean(p.title,85),cat:BASE_CATS.includes(p.cat)?p.cat:"process",desc:clean(p.desc,700),owner:clean(p.owner,110)||"Owner to assign",why:clean(p.why,500),advice:clean(p.advice,400),systems:parseList(p.systems,7),needs:parseList(p.needs,8)};
}
function generateId(){let id="";do{id="added_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7)}while(D[id]);return id}
function addProcess(payload,initial=false){
 if(added.size>=120)throw Error("Browser draft limit reached; export your diagram before adding more.");
 const p=normalize(payload);
 if(!p.title)throw Error("Enter a process name.");
 if(!D[p.parent])throw Error("Select a valid parent process.");
 const id=p.id||generateId();
 if(D[id])throw Error("This process identifier already exists.");
 const parent=D[p.parent];
 D[id]={title:p.title,type:categoryName[p.cat]||"Process",cat:p.cat,desc:p.desc||"Owner-created process awaiting description.",why:p.why||"Document why this activity is needed.",owner:p.owner,systems:p.systems,needs:p.needs,advice:p.advice||"Owner-created draft; verify the process with the relevant team.",next:[]};
 if(!Array.isArray(parent.next))parent.next=[];
 if(!parent.next.includes(id))parent.next.push(id);
 EDGE.push([p.parent,id]);
 for(const arr of Object.values(VIEW))if(Array.isArray(arr)&&!arr.includes(id)&&(arr===VIEW.all||arr.includes(p.parent)))arr.push(id);
 cy.add([{group:"nodes",data:{id,label:D[id].title,cat:D[id].cat}},{group:"edges",data:{id:"owner_edge_"+id,source:p.parent,target:id}}]);
 const anchor=cy.getElementById(p.parent).position();
 const siblings=EDGE.filter(([source,target])=>source===p.parent&&added.has(target)).length;
 cy.getElementById(id).position({x:anchor.x+195,y:anchor.y+95+siblings*90});
 added.add(id);
 if(!initial){document.getElementById("viewSelect").value="all";document.getElementById("categorySelect").value="all";applyFilters();}
 return {id,...p};
}
function removeOne(id){
 if(!added.has(id))return false;
 for(const child of EDGE.filter(([from,to])=>from===id&&added.has(to)).map(x=>x[1]))removeOne(child);
 for(const d of Object.values(D))if(Array.isArray(d.next))d.next=d.next.filter(x=>x!==id);
 for(const key of Object.keys(VIEW))VIEW[key]=VIEW[key].filter(x=>x!==id);
 for(let i=EDGE.length-1;i>=0;i--)if(EDGE[i][0]===id||EDGE[i][1]===id)EDGE.splice(i,1);
 cy.getElementById(id).remove();delete D[id];added.delete(id);return true;
}
function readAll(){return Object.entries(D).map(([id,d])=>({id,title:d.title,cat:d.cat,type:d.type,desc:d.desc,owner:d.owner,custom:added.has(id)}))}
function saveShape(){
 const items=[];
 for(const id of added){if(!D[id])continue;const edge=EDGE.find(([source,target])=>target===id);if(!edge)continue;const d=D[id];items.push({id,parent:edge[0],title:d.title,cat:d.cat,desc:d.desc,owner:d.owner,why:d.why,advice:d.advice,systems:d.systems,needs:d.needs});}
 return items;
}
function showCategory(cat){const el=document.getElementById("categorySelect");el.value=BASE_CATS.includes(cat)||cat==="all"?cat:"all";applyFilters();return el.value}
function setView(view){const el=document.getElementById("viewSelect");el.value=Object.hasOwn(VIEW,view)?view:"all";applyFilters();return el.value}
function choose(id){if(!D[id])return false;cy.$(":selected").unselect();cy.getElementById(id).select();return true}
function fit(){cy.fit(cy.elements(":visible"),50)}
function notify(id){if(D[id]&&typeof api.onSelect==="function")api.onSelect(id,{...D[id],id,custom:added.has(id)})}
function previewOnlyStyle(){
 const sheet=document.createElement("style");
 sheet.textContent="html,body,.app{width:100%!important;height:100%!important;min-height:0!important;overflow:hidden!important}"
 +".app>header,.app>.toolbar,.app>.mobileDock,.app>main>aside,.mapHint,.legend{display:none!important}"
 +"main{display:block!important;height:100%!important;min-height:0!important;overflow:hidden!important}"
 +".mapWrap{position:relative!important;min-height:0!important;height:100%!important;overflow:hidden!important}"
 +"#cy{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}";
 document.head.appendChild(sheet);cy.resize();setTimeout(()=>cy.fit(cy.elements(":visible"),55),90);
}
// Unlike the original, double-tap must never automatically recenter the diagram.
cy.off("dbltap","node");
cy.on("dbltap","node",event=>notify(event.target.id()));
cy.on("tap","node",event=>notify(event.target.id()));
const api={ready:true,onSelect:null,getNodes:readAll,getCategory:()=>document.getElementById("categorySelect").value,getView:()=>document.getElementById("viewSelect").value,addProcess,removeProcess:removeOne,customNodes:saveShape,setCategory:showCategory,setView,choose,fit,search:q=>{const el=document.getElementById("search");el.value=clean(q,160);el.dispatchEvent(new Event("input",{bubbles:true}))},setEditing:enabled=>toggleEdit(!!enabled),isEditing:()=>editMode,applySavedPositions:()=>loadPositions(),resetLayout:()=>resetLayout()};
window.FlowBusinessBridge=api;
previewOnlyStyle();
})();
