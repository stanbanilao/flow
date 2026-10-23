/* FLOW 4.1 secure expiring sharing UI; backend is server-validated, not a browser expiry flag. */
(function(){
"use strict";
const L=window.FlowLib;if(!L)throw Error("Library core missing");
const {$,current,notify,modal,closeModal,esc,clean}=L;
$("shareOpen").onclick=()=>{
 const d=current();if(!d)return;
 modal({kicker:"CLIENT SNAPSHOT",title:"Create an expiring client link",intro:"Share a fixed, read-only copy of this diagram. Its expiry is checked on the server each time the link is opened.",
 action:"Create secure link",
 fields:'<div class="field"><label for="shareDuration">Expires after</label><select id="shareDuration"><option value="1440">24 hours</option><option value="10080" selected>7 days</option><option value="43200">30 days</option><option value="60">1 hour</option><option value="15">15 minutes</option></select></div>'+
 '<div class="warning">The recipient only sees this snapshot. Later changes to your diagram are not included. Early revocation and view limits require a persistent, authenticated Share Manager and are not enabled in this version.</div>'+
 '<div class="field" id="generatedLinkWrap" hidden><label for="generatedLink">Client link</label><textarea id="generatedLink" readonly rows="3"></textarea></div>',
 onSubmit:async()=>{
  const body={durationMinutes:Number($("shareDuration").value),diagram:{name:d.name,industry:d.industry,nodes:d.nodes,links:d.links}};
  $("modalSubmit").disabled=true;$("modalMessage").textContent="Creating server-enforced expiring link…";
  try{
   const response=await fetch("/api/flow-share",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
   const result=await response.json();
   if(!response.ok)throw Error(result.error||"Link creation failed");
   const url=new URL(result.readPath,location.origin).toString();
   $("generatedLinkWrap").hidden=false;$("generatedLink").value=url;
   $("modalMessage").textContent="Expires "+new Date(result.expiresAt).toLocaleString("en-ZA")+". Copy the link below to send it.";
   $("modalSubmit").textContent="Copy link";
   $("modalSubmit").disabled=false;
   L.state.modalAction=async()=>{
    try{await navigator.clipboard.writeText(url);notify("Client link copied");closeModal()}
    catch(err){$("generatedLink").select();$("modalMessage").textContent="Select and copy the link manually"}
   };
  }catch(err){$("modalMessage").textContent=err.message||"Unable to create link";$("modalSubmit").disabled=false}
 }});
};
window.FlowLib.sharingReady=true;
})();