!function(e,t,n,i,r){var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},a="function"==typeof o.parcelRequirea1dd&&o.parcelRequirea1dd,c=a.cache||{},s="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function l(t,n){if(!c[t]){if(!e[t]){var i="function"==typeof o.parcelRequirea1dd&&o.parcelRequirea1dd;if(!n&&i)return i(t,!0);if(a)return a(t,!0);if(s&&"string"==typeof t)return s(t);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}d.resolve=function(n){var i=e[t][1][n];return null!=i?i:n},d.cache={};var f=c[t]=new l.Module(t);e[t][0].call(f.exports,d,f,f.exports,this)}return c[t].exports;function d(e){var t=d.resolve(e);return!1===t?{}:l(t)}}l.isParcelRequire=!0,l.Module=function(e){this.id=e,this.bundle=l,this.exports={}},l.modules=e,l.cache=c,l.parent=a,l.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(l,"root",{get:function(){return o.parcelRequirea1dd}}),o.parcelRequirea1dd=l;for(var f=0;f<t.length;f++)l(t[f])}({eNH8f:[function(e,t,n){self.__precacheManifest=[{url:"/",revision:"8bf912d6"},{url:"/favicon.6262c1fb.svg",revision:"6262c1fb"},{url:"/index.fc61389c.js",revision:"fc61389c"},{url:"/ResizeObserver.es.20cab196.js",revision:"20cab196"},{url:"/contactDialog.829e520a.js",revision:"829e520a"},{url:"/tpl.629790be.html",revision:"629790be"},{url:"/contactDialog.56bcb493.css",revision:"56bcb493"},{url:"/index.a9389734.css",revision:"a9389734"}]},{}]},["eNH8f"]);const CACHE_NAME="frsource-cache-"+self.__precacheManifest.map((e=>e.revision)).join(""),urlsToCache=self.__precacheManifest.map((e=>e.url));urlsToCache.unshift("https://www.frsource.org/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js","https://fonts.googleapis.com/css2?family=Inconsolata&display=swap","https://fonts.gstatic.com/s/inconsolata/v20/QldgNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLYxYWI2qfdm7Lpp4U8WR32kXWdycuJDA.woff","/site.webmanifest","/browserconfig.xml","/favicon.ico","/favicon-32x32.png","/robots.txt","/humans.txt"),self.addEventListener("install",(e=>{e.waitUntil(caches.open(CACHE_NAME).then((e=>e.addAll(urlsToCache))))})),self.addEventListener("activate",(e=>{e.waitUntil(caches.keys().then((e=>Promise.all(e.filter((e=>e!==CACHE_NAME)).map((e=>caches.delete(e)))))))})),self.addEventListener("fetch",(function(e){e.respondWith(caches.match(e.request).then((t=>t||fetch(e.request).then((t=>caches.open(CACHE_NAME).then((n=>(n.put(e.request,t.clone()),t))))).catch((()=>console.log("Fetch failed, sorry."))))))}));
//# sourceMappingURL=serviceWorker.js.map
