/* Compact mobile side category and business-view controls for existing /c/:code client page. */
(function(){
"use strict";
const view=document.getElementById("parentView"),category=document.getElementById("parentCategory");
if(!view||!category)return;
const button=document.createElement("button");button.type="button";button.className="clientCatHandle";button.setAttribute("aria-label","Open business view and category controls");button.setAttribute("aria-expanded","false");button.innerHTML='<span>View / Category</span><b>☰</b>';
const veil=document.createElement("div");veil.className="clientCatMask";
const pane=document.createElement("aside");pane.className="clientCatPanel";pane.setAttribute("aria-label","Mobile business structure filters");
pane.innerHTML='<div class="catPanelHead"><h3>View & categories</h3><button type="button" aria-label="Close category filters" id="catClose">×</button></div><div><label for="mobileBusinessView">Business view</label><select id="mobileBusinessView"></select></div><div><label for="mobileBusinessCategory">Show category</label><select id="mobileBusinessCategory"></select></div><button type="button" id="catFit">Fit diagram</button><small>Tap the side tab to reopen. The controls auto-hide after inactivity, when you select a category, or when you tap outside.</small>';
document.body.append(button,veil,pane);
const viewCopy=pane.querySelector("#mobileBusinessView"),categoryCopy=pane.querySelector("#mobileBusinessCategory");
viewCopy.innerHTML=view.innerHTML;categoryCopy.innerHTML=category.innerHTML;
let timer;
function close(){clearTimeout(timer);button.classList.remove("open");pane.classList.remove("open");veil.classList.remove("open");button.setAttribute("aria-expanded","false")}
function idle(){clearTimeout(timer);timer=setTimeout(()=>{if(pane.contains(document.activeElement)&&document.activeElement.tagName==="SELECT")return idle();close()},6500)}
function open(){
 const drawer=document.getElementById("brandDrawer"),brand=document.getElementById("brandTab");
 if(drawer?.classList.contains("open"))brand.click();
 viewCopy.value=view.value;categoryCopy.value=category.value;
 pane.classList.add("open");veil.classList.add("open");button.classList.add("open");button.setAttribute("aria-expanded","true");idle();
}
button.onclick=()=>pane.classList.contains("open")?close():open();
veil.onclick=pane.querySelector("#catClose").onclick=close;
pane.querySelector("#catFit").onclick=()=>{document.getElementById("parentFit").click();close()};
viewCopy.onchange=()=>{view.value=viewCopy.value;view.dispatchEvent(new Event("change",{bubbles:true}));close()};
categoryCopy.onchange=()=>{category.value=categoryCopy.value;category.dispatchEvent(new Event("change",{bubbles:true}));close()};
pane.addEventListener("pointerdown",idle);pane.addEventListener("keydown",idle);
document.addEventListener("keydown",event=>{if(event.key==="Escape")close()});
const frame=document.getElementById("flowFrame");
if(frame){
 const hook=()=>{try{frame.contentDocument?.addEventListener("pointerdown",close,{passive:true})}catch(e){}};
 frame.addEventListener("load",hook);if(frame.contentDocument?.readyState==="complete")hook();
}
})();
