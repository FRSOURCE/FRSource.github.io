!function(e,n,t,c,r,i){var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},f="function"==typeof o.parcelRequire666c&&o.parcelRequire666c,a="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function s(t,c){if(!n[t]){if(!e[t]){var r="function"==typeof o.parcelRequire666c&&o.parcelRequire666c;if(!c&&r)return r(t,!0);if(f)return f(t,!0);if(a&&"string"==typeof t)return a(t);var i=new Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}d.resolve=function(n){return e[t][1][n]||n},d.cache={};var u=n[t]=new s.Module(t);e[t][0].call(u.exports,d,u,u.exports,this)}return n[t].exports;function d(e){return s(d.resolve(e))}}s.isParcelRequire=!0,s.Module=function(e){this.id=e,this.bundle=s,this.exports={}},s.modules=e,s.cache=n,s.parent=f,s.register=function(n,t){e[n]=[function(e,n){n.exports=t},{}]},Object.defineProperty(s,"root",{get:function(){return o.parcelRequire666c}}),o.parcelRequire666c=s;for(var u=0;u<t.length;u++)s(t[u]);var d=s(c);"object"==typeof exports&&"undefined"!=typeof module?module.exports=d:"function"==typeof define&&define.amd&&define((function(){return d}))}({"6kHkb":[function(e,n,t){self.__precacheManifest=[{url:"/",revision:"fedd248e"},{url:"/favicon.c01791c9.svg",revision:"c01791c9"},{url:"/index.48d599b1.js",revision:"48d599b1"},{url:"/ResizeObserver.78c9a85e.js",revision:"78c9a85e"},{url:"/contactDialog.93eca646.js",revision:"93eca646"},{url:"/contactDialog.8e1a4b60.css",revision:"8e1a4b60"},{url:"/index.6ec0b497.css",revision:"6ec0b497"}]},{}],"3Y3GG":[function(e,n,t){var c="frsource-cache-"+self.__precacheManifest.map((function(e){return e.revision})).join(""),r=self.__precacheManifest.map((function(e){return e.url}));r.unshift("https://www.frsource.org/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js","https://fonts.googleapis.com/css2?family=Inconsolata&display=swap","https://fonts.gstatic.com/s/inconsolata/v20/QldgNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLYxYWI2qfdm7Lpp4U8WR32kXWdycuJDA.woff","/site.webmanifest","/browserconfig.xml","/favicon.ico","/favicon-32x32.png","/robots.txt","/humans.txt"),self.addEventListener("install",(function(e){e.waitUntil(caches.open(c).then((function(e){return e.addAll(r)})))})),self.addEventListener("activate",(function(e){e.waitUntil(caches.keys().then((function(e){return Promise.all(e.filter((function(e){return e!==c})).map((function(e){return caches.delete(e)})))})))})),self.addEventListener("fetch",(function(e){e.respondWith(caches.match(e.request).then((function(n){return n||fetch(e.request).then((function(n){return caches.open(c).then((function(t){return t.put(e.request,n.clone()),n}))})).catch((function(){return console.log("Fetch failed, sorry.")}))})))}))},{}]},{},["6kHkb","3Y3GG"],"3Y3GG");
//# sourceMappingURL=serviceWorker.js.map
