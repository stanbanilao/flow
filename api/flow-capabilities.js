/* FLOW release capability contract. Never returns secret data. */
module.exports=function handler(req,res){
 res.setHeader("Content-Type","application/json; charset=utf-8");
 res.setHeader("Cache-Control","no-store,private");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(req.method!=="GET"){res.statusCode=405;res.setHeader("Allow","GET");return res.end(JSON.stringify({error:"Method not allowed"}))}
 const enabled=process.env.VERCEL_ENV!=="production"&&typeof process.env.FLOW_SHARE_SECRET==="string"&&process.env.FLOW_SHARE_SECRET.length>=40;
 return res.end(JSON.stringify({version:"4.1",browserDrafts:true,ownerAuthentication:false,centralStorage:false,expiringShares:enabled,earlyRevocation:false,clientPortalAccess:false}));
};
