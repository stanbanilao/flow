"use strict";
const assert=require("node:assert/strict");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const base=path.resolve(__dirname,"..");
process.env.VERCEL_ENV="production";
const shareHandler=require("../api/flow-share"),capHandler=require("../api/flow-capabilities");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".ico":"image/x-icon"};
const web=http.createServer(async(req,res)=>{
 const url=new URL(req.url,"http://127.0.0.1");
 if(url.pathname==="/api/flow-capabilities")return capHandler(req,res);
 if(url.pathname==="/api/flow-share"){
  req.query=Object.fromEntries(url.searchParams);
  if(req.method==="POST"){
   const chunks=[];for await (const c of req)chunks.push(c);
   try{req.body=JSON.parse(Buffer.concat(chunks).toString("utf8"))}catch(e){req.body={}}
  }
  return shareHandler(req,res);
 }
 const aliases={"/library":"/library.html","/studio":"/studio.html","/share":"/share.html","/architecture":"/architecture.html"};
 const pathname=aliases[url.pathname]||url.pathname;
 const filename=path.resolve(base,"."+pathname);
 if(!filename.startsWith(base+path.sep)){res.statusCode=403;return res.end("Forbidden")}
 try{
  const body=fs.readFileSync(filename);
  res.statusCode=200;res.setHeader("content-type",mime[path.extname(filename)]||"application/octet-stream");return res.end(body);
 }catch(e){res.statusCode=404;return res.end("Not found")}
});
(async()=>{
 await new Promise(ok=>web.listen(0,"127.0.0.1",ok));
 const origin="http://127.0.0.1:"+web.address().port;
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const errors=[];
 const pages=[];
 try{
  const desktop=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await desktop.newPage();pages.push(page);
  page.on("pageerror",e=>errors.push("desktop: "+e.message));
  await page.route("https://fonts.googleapis.com/**",r=>r.abort());
  await page.route("https://fonts.gstatic.com/**",r=>r.abort());
  await page.goto(origin+"/library",{waitUntil:"domcontentloaded"});
  await page.locator("#diagramGrid").waitFor({state:"visible"});
  assert.equal(await page.locator("#diagramCount").textContent(),"0");
  await page.locator("#newDiagram").click();
  await page.locator("#dialogName").fill("QA Operations");
  await page.locator("#modalSubmit").click();
  assert.equal(await page.locator("#editorName").textContent(),"QA Operations");
  await page.locator("#addNode").click();
  await page.locator("#nodeTitle").fill("Client application");
  assert.ok((await page.locator("#diagramNodes").textContent()).includes("Client application"));
  await page.locator("#drawerClose").click();
  await page.locator("#saveRevision").click();
  await page.locator("#versionNote").fill("Initial intake process");
  await page.locator("#modalSubmit").click();
  await page.locator("#backLibrary").click();
  assert.equal(await page.locator("#diagramCount").textContent(),"1");
  await page.reload({waitUntil:"domcontentloaded"});
  assert.ok((await page.locator("#diagramGrid").textContent()).includes("QA Operations"));
  await page.locator("#newDiagram").click();
  await page.locator("#dialogName").fill("Finance & Payments");
  await page.locator("#modalSubmit").click();
  await page.locator("#backLibrary").click();
  const card=page.locator(".diagram-card").filter({hasText:"QA Operations"});await card.click();
  await page.locator(".process-node").first().click();
  await page.locator('[data-panel="connect-diagram"]').click();
  await page.locator("#targetDiagram").selectOption({label:"Other / Finance & Payments"});
  await page.locator("#modalSubmit").click();
  assert.ok((await page.locator("#drawerContent").textContent()).includes("Finance & Payments"));
  await page.locator("[data-jump-diagram]").click();
  assert.equal(await page.locator("#editorName").textContent(),"Finance & Payments");
  await page.waitForTimeout(200);
  assert.equal(await page.locator("#shareOpen").isDisabled(),true);
  const secure=await page.evaluate(async()=>{
   const r=await fetch("/api/flow-share",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});
   return {status:r.status,body:await r.json()};
  });
  assert.equal(secure.status,503);
  assert.equal(errors.length,0,errors.join("\n"));
  console.log("PASS desktop: create, edit, checkpoint, refresh persistence, cross-diagram navigation, LIVE share disabled");

  const mobile=await browser.newContext({viewport:{width:430,height:932},deviceScaleFactor:3,isMobile:true,hasTouch:true});
  const m=await mobile.newPage();pages.push(m);
  m.on("pageerror",e=>errors.push("mobile: "+e.message));
  await m.route("https://fonts.googleapis.com/**",r=>r.abort());
  await m.route("https://fonts.gstatic.com/**",r=>r.abort());
  await m.goto(origin+"/library",{waitUntil:"domcontentloaded"});
  assert.ok(await m.locator("#newDiagram").isVisible());
  await m.locator("#newDiagram").click();
  await m.locator("#dialogName").fill("Mobile workflow");
  await m.locator("#modalSubmit").click();
  await m.locator("#addNode").click();
  await m.locator("#nodeTitle").fill("Mobile step");
  assert.ok((await m.locator("#diagramNodes").textContent()).includes("Mobile step"));
  await m.locator("#drawerClose").click();
  await m.locator("#fitCanvas").click();
  assert.ok((await m.locator("#zoomValue").textContent()).endsWith("%"));
  assert.equal(errors.length,0,errors.join("\n"));
  console.log("PASS mobile emulation: create, edit, inspector, fit at 430x932");

  const publicRoutes=["/studio","/architecture","/share"];
  for(const p of publicRoutes){
   const rr=await fetch(origin+p);
   assert.equal(rr.status,200,p+" should return HTML");
  }
  console.log("PASS preserved public static routes and read-only client page");
 } finally{for(const p of pages)await p.close().catch(()=>{});await browser.close()}
})().catch(err=>{console.error(err.stack||err);process.exitCode=1}).finally(()=>web.close());
