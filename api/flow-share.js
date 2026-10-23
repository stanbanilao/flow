/* FLOW 4.1 — stateless server-enforced expiring snapshot links.
 * AES-256-GCM + Brotli; secret is held only in Vercel FLOW_SHARE_SECRET.
 * Does not provide revocation, view limits, owner authentication or central diagram storage.
 */
const crypto=require("node:crypto");
const zlib=require("node:zlib");
const MAX_INPUT=45000,MAX_TOKEN=12000,MAX_AGE=30*24*60*60*1000,MIN_AGE=15*60*1000;
function send(res,status,data){
 res.statusCode=status;
 res.setHeader("Content-Type","application/json; charset=utf-8");
 res.setHeader("Cache-Control","no-store, private, max-age=0");
 res.setHeader("X-Content-Type-Options","nosniff");
 res.end(JSON.stringify(data));
}
function key(){
 const raw=process.env.FLOW_SHARE_SECRET;
 if(!raw||raw.length<40)return null;
 return crypto.createHash("sha256").update(raw,"utf8").digest();
}
function validateSnapshot(x){
 if(!x||typeof x!=="object"||typeof x.name!=="string"||!Array.isArray(x.nodes)||!Array.isArray(x.links))throw Error("Invalid diagram snapshot");
 if(x.name.length>120||x.nodes.length>90||x.links.length>250)throw Error("Snapshot is too large");
 const allowedKind=new Set(["process","decision","start","end","system"]);
 const ids=new Set();
 const nodes=x.nodes.map(n=>{
  if(!n||typeof n.id!=="string"||n.id.length>110||ids.has(n.id))throw Error("Invalid or duplicate node ID");
  ids.add(n.id);
  if(typeof n.title!=="string"||n.title.length>140||n.title.length===0)throw Error("Invalid process title");
  const kind=allowedKind.has(n.kind)?n.kind:"process";
  return{id:n.id,title:n.title,kind,description:String(n.description||"").slice(0,850),owner:String(n.owner||"").slice(0,130),x:Math.min(2750,Math.max(0,Math.round(Number(n.x)||0))),y:Math.min(1850,Math.max(0,Math.round(Number(n.y)||0)))};
 });
 const links=x.links.map(l=>{
  if(!l||typeof l.from!=="string"||!ids.has(l.from))throw Error("Invalid connection origin");
  if(l.to!==undefined&&l.to!==null&&(!ids.has(l.to)))throw Error("Invalid connection destination");
  return{id:String(l.id||"").slice(0,110),from:l.from,to:l.to||null,type:["sequence","decision","cross"].includes(l.type)?l.type:"sequence",label:String(l.label||"").slice(0,80),toDiagram:l.toDiagram?String(l.toDiagram).slice(0,110):null};
 });
 return{name:x.name.slice(0,120),industry:String(x.industry||"Other").slice(0,65),nodes,links};
}
function requireSameOrigin(req){
 const origin=req.headers.origin,host=req.headers.host;
 if(!origin)return true; // Non-browser POST is still possible. This is not an authentication mechanism.
 try{return new URL(origin).host===host}catch(err){return false}
}
module.exports=async function handler(req,res){
 // LIVE safety gate: do not expose anonymous snapshot issuance on a public custom domain.
 if(process.env.VERCEL_ENV==="production")return send(res,503,{error:"Client snapshot sharing is disabled on LIVE until owner authentication is available"});
 const secret=key();
 if(!secret)return send(res,503,{error:"Expiring links are not configured for this deployment"});
 if(req.method==="POST"){
  if(!requireSameOrigin(req))return send(res,403,{error:"Cross-origin share generation is not permitted"});
  if(req.headers["content-type"]&&!String(req.headers["content-type"]).includes("application/json"))return send(res,415,{error:"Send JSON"});
  let data=req.body;
  try{
   if(typeof data==="string"){if(data.length>MAX_INPUT)throw Error("Request too large");data=JSON.parse(data)}
   if(!data||JSON.stringify(data).length>MAX_INPUT)throw Error("Request too large");
   const duration=Number(data.durationMinutes);
   if(!Number.isInteger(duration)||duration<15||duration>43200)throw Error("Expiry must be between 15 minutes and 30 days");
   const snap=validateSnapshot(data.diagram);
   const payload={v:1,created:Date.now(),exp:Date.now()+duration*60000,snapshot:snap};
   const plain=zlib.brotliCompressSync(Buffer.from(JSON.stringify(payload),"utf8"));
   const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv("aes-256-gcm",secret,iv);
   const encrypted=Buffer.concat([cipher.update(plain),cipher.final()]);
   const token=Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString("base64url");
   if(token.length>MAX_TOKEN)return send(res,413,{error:"Snapshot too large for secure link. Reduce the number of steps."});
   return send(res,201,{token,expiresAt:new Date(payload.exp).toISOString(),readPath:"/share?token="+token});
  }catch(err){return send(res,400,{error:err.message||"Unable to create share link"})}
 }
 if(req.method==="GET"){
  const token=String(req.query?.token||"");
  if(token.length<40||token.length>MAX_TOKEN||!/^[\w-]+$/.test(token))return send(res,400,{error:"Invalid client link"});
  try{
   const buf=Buffer.from(token,"base64url");
   if(buf.length<29)return send(res,400,{error:"Invalid client link"});
   const iv=buf.subarray(0,12),tag=buf.subarray(12,28),encrypted=buf.subarray(28);
   const cipher=crypto.createDecipheriv("aes-256-gcm",secret,iv);
   cipher.setAuthTag(tag);
   const decompressed=zlib.brotliDecompressSync(Buffer.concat([cipher.update(encrypted),cipher.final()]),{maxOutputLength:MAX_INPUT});
   const payload=JSON.parse(decompressed.toString("utf8"));
   if(payload.v!==1||!Number.isFinite(payload.exp)||!Number.isFinite(payload.created))throw Error("Invalid client link");
   if(payload.exp<=Date.now())return send(res,410,{error:"This client link has expired"});
   if(payload.exp-payload.created>MAX_AGE||payload.exp-payload.created<MIN_AGE||payload.created>Date.now()+60000)throw Error("Invalid expiry window");
   const snapshot=validateSnapshot(payload.snapshot);
   return send(res,200,{diagram:snapshot,expiresAt:new Date(payload.exp).toISOString()});
  }catch(err){return send(res,403,{error:"This link is invalid or cannot be opened"})}
 }
 res.setHeader("Allow","GET, POST");return send(res,405,{error:"Method not allowed"});
};
