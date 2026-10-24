const CACHE='pentanex-shell-v3';
const SHELL=['./','./index.html','./styles.css','./script.js','./config.js','./manifest.json','./assets/pentanex-logo.svg','./assets/pentanex-logo.png','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim()});
self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  // Lista stacji jest prywatna: nie zapisuj jej w Cache Storage, pobieraj tylko z serwera.
  if(url.pathname.endsWith('/stations.json')||url.pathname==='/stations.json'){
    event.respondWith(fetch(request,{cache:'no-store'}));
    return;
  }
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{
    if(response.ok&&request.destination!=='document'){
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(request,copy));
    }
    return response;
  }).catch(()=>{
    if(request.mode==='navigate')return caches.match('./index.html');
    return Response.error();
  })));
});
