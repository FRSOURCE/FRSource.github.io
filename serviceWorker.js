!function(e,t,n,r,o){var c="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},i="function"==typeof c[r]&&c[r],s=i.cache||{},f="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function a(t,n){if(!s[t]){if(!e[t]){var o="function"==typeof c[r]&&c[r];if(!n&&o)return o(t,!0);if(i)return i(t,!0);if(f&&"string"==typeof t)return f(t);var l=new Error("Cannot find module '"+t+"'");throw l.code="MODULE_NOT_FOUND",l}d.resolve=function(n){var r=e[t][1][n];return null!=r?r:n},d.cache={};var u=s[t]=new a.Module(t);e[t][0].call(u.exports,d,u,u.exports,this)}return s[t].exports;function d(e){var t=d.resolve(e);return!1===t?{}:a(t)}}a.isParcelRequire=!0,a.Module=function(e){this.id=e,this.bundle=a,this.exports={}},a.modules=e,a.cache=s,a.parent=i,a.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(a,"root",{get:function(){return c[r]}}),c[r]=a;for(var l=0;l<t.length;l++)a(t[l]);if(n){var u=a(n);"object"==typeof exports&&"undefined"!=typeof module?module.exports=u:"function"==typeof define&&define.amd&&define((function(){return u}))}}({hYvVh:[function(e,t,n){(0,e("@parcel/service-worker")._register)(["/index.html","/favicon.6262c1fb.svg","/index.aed75cb4.js","/ResizeObserver.es.3162562e.js","/contactDialog.afd3ce7a.js","/tpl.1f9b693a.html","/contactDialog.c43a6985.css","/index.4c40f079.css"],"118ff161")},{"@parcel/service-worker":"bqGow"}],bqGow:[function(e,t,n){var r=e("@parcel/transformer-js/src/esmodule-helpers.js");r.defineInteropFlag(n),r.export(n,"manifest",(()=>o)),r.export(n,"version",(()=>c)),r.export(n,"_register",(()=>i));let o=[],c="";function i(e,t){o=e,c=t}},{"@parcel/transformer-js/src/esmodule-helpers.js":"biJ6h"}],biJ6h:[function(e,t,n){n.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},n.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.exportAll=function(e,t){return Object.keys(e).forEach((function(n){"default"===n||"__esModule"===n||t.hasOwnProperty(n)||Object.defineProperty(t,n,{enumerable:!0,get:function(){return e[n]}})})),t},n.export=function(e,t,n){Object.defineProperty(e,t,{enumerable:!0,get:n})}},{}],bdURY:[function(e,t,n){var r=e("@parcel/service-worker");const o=["/","/index.html"],c="frsource-cache-"+r.version,i=self;r.manifest.unshift("https://www.frsource.org/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js","https://fonts.googleapis.com/css2?family=Inconsolata&display=swap","https://fonts.gstatic.com/s/inconsolata/v20/QldgNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLYxYWI2qfdm7Lpp4U8WR32kXWdycuJDA.woff","/site.webmanifest","/browserconfig.xml","/favicon.ico","/favicon-32x32.png","/robots.txt","/humans.txt"),i.addEventListener("install",(e=>{e.waitUntil(caches.open(c).then((e=>e.addAll(r.manifest))))})),i.addEventListener("activate",(e=>{e.waitUntil(caches.keys().then((e=>Promise.all(e.filter((e=>e!==c)).map((e=>caches.delete(e)))))))})),i.addEventListener("fetch",(function(e){e.respondWith((async()=>{if(!e.clientId)return fetch(e.request);const t=await i.clients.get(e.clientId);if(!t)return fetch(e.request);const n=new URL(t.url);if(!o.includes(n.pathname))return fetch(e.request);const r=await caches.match(e.request).catch((()=>{}));if(r)return r;const s=await fetch(e.request).catch((()=>{}));if(!s)return console.log("Failed to fetch:",e),new Response;try{(await caches.open(c)).put(e.request,s.clone())}catch(t){console.log("Failed to store response in cache",e,t)}return s})())}))},{"@parcel/service-worker":"bqGow"}]},["hYvVh","bdURY"],"bdURY","parcelRequire6566");
//# sourceMappingURL=serviceWorker.js.map
