"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const handler=require("../api/flow-share");
function req(method,body,token){
 return {method,body,query:{token},headers:{host:"flow.example.test",origin:"https://flow.example.test","content-type":"application/json"}};
}
async function call(input){
 const res={statusCode:200,headers:{},setHeader(k,v){this.headers[k.toLowerCase()]=v},end(body){this.body=body}};
 await handler(input,res);
 return {code:res.statusCode,headers:res.headers,json:JSON.parse(res.body||"{}")};
}
const snapshot={name:"Example workflow",industry:"Other",
 nodes:[{id:"node-1",title:"Enquiry",kind:"start",description:"Client asks for an estimate",x:125,y:145},
        {id:"node-2",title:"Quote",kind:"process",description:"Review material and labour",x:420,y:145}],
 links:[{id:"link-1",from:"node-1",to:"node-2",type:"sequence",label:"Continue"}]};
const original={env:process.env.VERCEL_ENV,key:process.env.FLOW_SHARE_SECRET};
function setPreview(){process.env.VERCEL_ENV="preview";process.env.FLOW_SHARE_SECRET="unit-test-only-long-secret-key-1234567890-test-value"}
test.after(()=>{for(const [key,value] of [["VERCEL_ENV",original.env],["FLOW_SHARE_SECRET",original.key]]){if(value===undefined)delete process.env[key];else process.env[key]=value}});
test("PROD-01 public issuance and read access fail closed even with a secret",async()=>{
 setPreview();process.env.VERCEL_ENV="production";
 const created=await call(req("POST",{durationMinutes:15,diagram:snapshot}));
 assert.equal(created.code,503);
 assert.equal(created.headers["cache-control"].includes("no-store"),true);
 const opened=await call(req("GET",null,"a".repeat(128)));
 assert.equal(opened.code,503);
});
test("SHARE-01 preview creates encrypted client snapshot and reads it",async()=>{
 setPreview();
 const created=await call(req("POST",{durationMinutes:15,diagram:snapshot}));
 assert.equal(created.code,201,JSON.stringify(created.json));
 assert.ok(created.json.token.length>50);
 assert.ok(!created.json.token.includes("Enquiry"));
 const found=await call(req("GET",null,created.json.token));
 assert.equal(found.code,200);
 assert.equal(found.json.diagram.name,"Example workflow");
 assert.equal(found.json.diagram.nodes.length,2);
});
test("SHARE-02 tampered client link is rejected",async()=>{
 setPreview();
 const created=await call(req("POST",{durationMinutes:15,diagram:snapshot}));
 assert.equal(created.code,201);
 const token=created.json.token;
 const i=Math.floor(token.length/2);const alter=token.slice(0,i)+(token[i]==="A"?"B":"A")+token.slice(i+1);
 const denied=await call(req("GET",null,alter));
 assert.equal(denied.code,403,JSON.stringify(denied.json));
});
test("SHARE-03 expiration is enforced server-side",async()=>{
 setPreview();
 const created=await call(req("POST",{durationMinutes:15,diagram:snapshot}));
 assert.equal(created.code,201);
 const realNow=Date.now;
 try{Date.now=()=>realNow()+16*60*1000;const expired=await call(req("GET",null,created.json.token));assert.equal(expired.code,410,JSON.stringify(expired.json))}
 finally{Date.now=realNow}
});
test("SHARE-04 invalid or oversized request fails",async()=>{
 setPreview();
 assert.equal((await call(req("POST",{durationMinutes:0,diagram:snapshot}))).code,400);
 assert.equal((await call(req("POST",{durationMinutes:43201,diagram:snapshot}))).code,400);
 assert.equal((await call(req("POST",{durationMinutes:15,diagram:{...snapshot,nodes:[snapshot.nodes[0],snapshot.nodes[0]]}}))).code,400);
});
test("SHARE-05 cross-origin issuance is not permitted",async()=>{
 setPreview();
 const r=req("POST",{durationMinutes:15,diagram:snapshot});r.headers.origin="https://malicious.example";
 assert.equal((await call(r)).code,403);
});
test("STATIC-01 referenced library assets exist",()=>{
 const root=path.resolve(__dirname,"..");
 for(const file of ["library.html","share.html","studio.html"]){
  const html=fs.readFileSync(path.join(root,file),"utf8");
  for(const [,ref] of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g))
   if(!ref.startsWith("https"))assert.ok(fs.existsSync(path.join(root,ref)),file+" missing "+ref);
 }
});
test("STATIC-02 editor, share and architecture routes remain available",()=>{
 const root=path.resolve(__dirname,"..");
 const routes=JSON.parse(fs.readFileSync(path.join(root,"vercel.json"),"utf8")).rewrites;
 for(const p of ["/admin","/c/:code","/business-flow","/business-structure","/architecture","/studio","/library","/share"])
  assert.ok(routes.some(x=>x.source===p),"Missing route "+p);
 for(const f of ["flow-library-core.js","flow-library-editor.js","flow-library-sharing.js","studio.js","studio-owner.js","flow-share.js"])
  assert.ok(fs.existsSync(path.join(root,f)),f+" missing");
});
