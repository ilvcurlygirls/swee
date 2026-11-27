/* guarda la app para usarla sin internet; con internet siempre baja la versión nueva */
const CACHE="setups-f1-67ac0166";
const FILES=["./","index.html","manifest.json","apple-touch-icon.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("setups-f1-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok||r.type==="opaque"){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||(e.request.mode==="navigate"?caches.match("index.html"):Response.error()))));
});
