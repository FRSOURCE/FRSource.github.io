!function(e,t,r,n,a){var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},c="function"==typeof o[n]&&o[n],i=c.cache||{},s="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function l(t,r){if(!i[t]){if(!e[t]){var a="function"==typeof o[n]&&o[n];if(!r&&a)return a(t,!0);if(c)return c(t,!0);if(s&&"string"==typeof t)return s(t);var u=Error("Cannot find module '"+t+"'");throw u.code="MODULE_NOT_FOUND",u}p.resolve=function(r){var n=e[t][1][r];return null!=n?n:r},p.cache={};var d=i[t]=new l.Module(t);e[t][0].call(d.exports,p,d,d.exports,o)}return i[t].exports;function p(e){var t=p.resolve(e);return!1===t?{}:l(t)}}l.isParcelRequire=!0,l.Module=function(e){this.id=e,this.bundle=l,this.exports={}},l.modules=e,l.cache=i,l.parent=c,l.register=function(t,r){e[t]=[function(e,t){t.exports=r},{}]},Object.defineProperty(l,"root",{get:function(){return o[n]}}),o[n]=l;for(var u=0;u<t.length;u++)l(t[u])}({asAuK:[function(e,t,r,n){var a=e("@parcel/transformer-js/src/esmodule-helpers.js");a.defineInteropFlag(r),a.export(r,"ContactDialogCtrl",()=>i);var o=e("url:./tpl.html"),c=a.interopDefault(o);e("./_styles.scss");class i{constructor(){this.grecaptchaCallbackResolver=()=>{},i.grecaptchaScriptLoader||this.createScriptElement(),this.element=document.createElement("dialog"),this.setupDialogElement(this.element)}async setupDialogElement(e){i.templateLoader||(i.templateLoader=fetch(c.default));let t=await i.templateLoader;e.innerHTML=await t.text(),e.querySelectorAll("input,textarea").forEach(e=>{e.setAttribute("placeholder"," ")}),e.querySelector(".dialog__btn-close").addEventListener("click",this.hide.bind(this)),e.querySelector(".gform").addEventListener("submit",this.onFormSubmit.bind(this)),this.element=e}createScriptElement(){i.grecaptchaScriptLoader=new Promise(e=>{let t=document.createElement("script");t.onload=()=>{let t=document.createElement("div");t.className="grecaptcha-wrapper",document.body.appendChild(t),window.grecaptcha.ready(()=>{window.grecaptcha.render(t,{sitekey:"6LdQaM8ZAAAAAJwBCtGEYIyh9u6be1rBOlsd-FWj",size:"invisible",callback:e=>this.grecaptchaCallbackResolver(e)}),e()})},t.src="https://www.google.com/recaptcha/api.js?render=explicit",t.defer=!0,t.async=!0,document.body.appendChild(t)})}async executeGrecaptcha(){let e=await new Promise(e=>{this.grecaptchaCallbackResolver=e,window.grecaptcha.execute()});return window.grecaptcha.reset(),e}async sendContactData(e,t=0){return new Promise(async(r,n)=>{let a="https://script.google.com/macros/s/AKfycbzrISB5QwRuuwGTgkxgKp7DGENDHPcxZTcka2_LRQ0zULSf5Ec/exec?"+e,o=await this.executeGrecaptcha(),c=new XMLHttpRequest;c.open("POST",a+"&token="+encodeURIComponent(o)),c.setRequestHeader("Content-type","text/plain;charset=utf-8"),c.onreadystatechange=()=>{if(4===c.readyState){if(200===c.status){if("success"===JSON.parse(c.responseText).result)return r();++t<3?r(this.sendContactData(e,t)):n()}else n()}},c.send()})}isShown(){return"open"===this.element.getAttribute("open")}show(){requestAnimationFrame(()=>{this.element.setAttribute("open","open")})}hide(){this.element.removeAttribute("open")}async onFormSubmit(e){await i.grecaptchaScriptLoader;let t=e.currentTarget,r=t.querySelector("button");r.disabled=!0,e.preventDefault();let n=Array.prototype.slice.apply(t.querySelectorAll("input,textarea")).map(e=>encodeURIComponent(e.name)+"="+encodeURIComponent(e.value)).join("&");await this.sendContactData(n).then(()=>{r.textContent="THX!",r.classList.remove("fill"),r.classList.add("pe-n")},()=>{}),r.disabled=!1}}},{"url:./tpl.html":"eOwUw","./_styles.scss":"8QASm","@parcel/transformer-js/src/esmodule-helpers.js":"hl3dL"}],eOwUw:[function(e,t,r,n){t.exports=e("861c9b96a42c9be9").getBundleURL("iGomz")+"tpl.898fe93f.html"},{"861c9b96a42c9be9":"bDWlR"}],"8QASm":[function(){},{}]},[],0,"parcelRequire94c2");
//# sourceMappingURL=contactDialog.fe5e97e3.js.map
