!function(e,t,n,r,o){var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},c="function"==typeof i[r]&&i[r],s=c.cache||{},f="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function a(t,n){if(!s[t]){if(!e[t]){var o="function"==typeof i[r]&&i[r];if(!n&&o)return o(t,!0);if(c)return c(t,!0);if(f&&"string"==typeof t)return f(t);var l=Error("Cannot find module '"+t+"'");throw l.code="MODULE_NOT_FOUND",l}d.resolve=function(n){var r=e[t][1][n];return null!=r?r:n},d.cache={};var u=s[t]=new a.Module(t);e[t][0].call(u.exports,d,u,u.exports,this)}return s[t].exports;function d(e){var t=d.resolve(e);return!1===t?{}:a(t)}}a.isParcelRequire=!0,a.Module=function(e){this.id=e,this.bundle=a,this.exports={}},a.modules=e,a.cache=s,a.parent=c,a.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(a,"root",{get:function(){return i[r]}}),i[r]=a;for(var l=0;l<t.length;l++)a(t[l]);if(n){var u=a(n);"object"==typeof exports&&"undefined"!=typeof module?module.exports=u:"function"==typeof define&&define.amd?define(function(){return u}):o&&(this[o]=u)}}({hL0Rt:[function(e,t,n){(0,e("@parcel/service-worker")._register)(["/index.html","/favicon.6262c1fb.svg","/index.31276cc9.js","/ResizeObserver.es.7a0d9423.js","/contactDialog.f354e36a.js","/tpl.7f3037e4.html","/contactDialog.c43a6985.css","/index.436676f7.css"],"5ac9ded8")},{"@parcel/service-worker":"jQFOy"}],jQFOy:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"manifest",()=>o),r.export(n,"version",()=>i),r.export(n,"_register",()=>c);let o=[],i="";function c(e,t){o=e,i=t}},{"@parcel/transformer-js/src/esmodule-helpers.js":"1rDEk"}],"1rDEk":[function(e,t,n){n.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},n.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.exportAll=function(e,t){return Object.keys(e).forEach(function(n){"default"===n||"__esModule"===n||t.hasOwnProperty(n)||Object.defineProperty(t,n,{enumerable:!0,get:function(){return e[n]}})}),t},n.export=function(e,t,n){Object.defineProperty(e,t,{enumerable:!0,get:n})}},{}],bdURY:[function(e,t,n){var r=e("@parcel/service-worker");let o=["/","/index.html"],i="frsource-cache-"+r.version,c=self;(0,r.manifest).unshift("https://www.frsource.org/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js","https://fonts.googleapis.com/css2?family=Inconsolata&display=swap","https://fonts.gstatic.com/s/inconsolata/v20/QldgNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLYxYWI2qfdm7Lpp4U8WR32kXWdycuJDA.woff","/site.webmanifest","/browserconfig.xml","/favicon.ico","/favicon-32x32.png","/robots.txt","/humans.txt"),c.addEventListener("install",e=>{e.waitUntil(caches.open(i).then(e=>e.addAll(r.manifest)))}),c.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==i).map(e=>caches.delete(e)))))}),c.addEventListener("fetch",function(e){e.respondWith((async()=>{if(!e.clientId)return fetch(e.request);let t=await c.clients.get(e.clientId);if(!t)return fetch(e.request);let n=new URL(t.url);if(!o.includes(n.pathname))return fetch(e.request);let r=await caches.match(e.request).catch(()=>void 0);if(r)return r;let s=await fetch(e.request).catch(()=>void 0);if(!s)return console.log("Failed to fetch:",e),new Response;try{let t=await caches.open(i);t.put(e.request,s.clone())}catch(t){console.log("Failed to store response in cache",e,t)}return s})())})},{"@parcel/service-worker":"jQFOy"}]},["hL0Rt","bdURY"],"bdURY","parcelRequire6566");
//# sourceMappingURL=serviceWorker.js.map
