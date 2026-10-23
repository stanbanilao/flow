/* Flow Studio isolated Cytoscape adapter: original Business Flow is unchanged. */
(function(){
"use strict";
const base=window.FlowBusinessBridge;
if(!base||!base.ready)throw new Error("Base business bridge missing");
cy.off("tap","node");cy.off("dbltap","node");
let onSelect=null;
const dispatch=e=>{
 const id=e.target.id(),data=D[id];if(!data)return;
 cy.$(":selected").unselect();e.target.select();
 if(onSelect)onSelect(id,{...data,id,custom:base.getNodes().some(n=>n.id===id&&n.custom)});
};
cy.on("tap","node",dispatch);cy.on("dbltap","node",dispatch);
const css=document.createElement("style");
css.textContent=[
"html,body,.app,main,.mapWrap{background:#0F151D!important}",
"#cy{background-image:radial-gradient(rgba(243,241,237,.085) .9px,transparent .95px)!important;background-size:22px 22px!important}",
".mapHint,.legend,.mobileDock,.detail,main>aside,.app>header,.app>.toolbar{display:none!important}",
"main,.mapWrap{display:block!important;height:100%!important;width:100%!important;min-height:0!important;overflow:hidden!important}",
".app{display:block!important;min-height:0!important;height:100%!important}",
"#cy{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}"
].join("\n");
document.head.appendChild(css);
function filterStill(view,cat){
 const viewInput=document.getElementById("viewSelect"),catInput=document.getElementById("categorySelect");
 viewInput.value=Object.prototype.hasOwnProperty.call(VIEW,view)?view:"all";
 catInput.value=["all","department","product","process","checkpoint","system","thynkverse"].includes(cat)?cat:"all";
 const allowed=new Set(VIEW[viewInput.value]||VIEW.all);
 cy.nodes().forEach(n=>{
  const d=D[n.id()],inView=allowed.has(n.id()),inCategory=catInput.value==="all"||d.cat===catInput.value||n.id()==="company";
  n.toggleClass("hiddenNode",!(inView&&inCategory));
 });
 cy.edges().forEach(e=>e.toggleClass("hiddenNode",!e.source().visible()||!e.target().visible()));
 // Filtering is a data operation, not a camera instruction.
}
const studio={
 ready:true,
 get onSelect(){return onSelect},
 set onSelect(fn){onSelect=typeof fn==="function"?fn:null},
 getNodes:base.getNodes,
 getNode:id=>D[id]?{...D[id],id,custom:base.getNodes().some(n=>n.id===id&&n.custom)}:null,
 customNodes:base.customNodes,
 addProcess:payload=>{const result=base.addProcess(payload,true);filterStill("all","all");return result},
 removeProcess:id=>{const done=base.removeProcess(id);filterStill("all","all");return done},
 select:id=>{if(!D[id])return false;cy.$(":selected").unselect();cy.$id(id).select();return true},
 setFilters:filterStill,
 getFilters:()=>({view:document.getElementById("viewSelect").value,category:document.getElementById("categorySelect").value}),
 fit:()=>cy.fit(cy.elements(":visible"),60),
 zoomIn:()=>cy.zoom({level:Math.min(2.2,cy.zoom()*1.16),renderedPosition:{x:cy.width()/2,y:cy.height()/2}}),
 zoomOut:()=>cy.zoom({level:Math.max(.18,cy.zoom()/1.16),renderedPosition:{x:cy.width()/2,y:cy.height()/2}}),
 getCamera:()=>({zoom:cy.zoom(),pan:{...cy.pan()}}),
 search:q=>{
  const query=String(q||"").trim().toLowerCase();cy.nodes().removeClass("searchDim searchHit");cy.edges().removeClass("searchDim");
  if(!query)return;
  cy.nodes(":visible").forEach(n=>{
   const d=D[n.id()],hay=[d.title,d.type,d.desc,d.owner].join(" ").toLowerCase();
   n.addClass(hay.includes(query)?"searchHit":"searchDim");
  });
 }
};
window.FlowStudioBusiness=studio;
cy.resize();
setTimeout(()=>{cy.resize();studio.fit()},125);
})();