!function(e,t,i,n,r){var a="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},s="function"==typeof a.parcelRequire&&a.parcelRequire,o="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function u(i,n){if(!t[i]){if(!e[i]){var r="function"==typeof parcelRequire&&parcelRequire;if(!n&&r)return r(i,!0);if(s)return s(i,!0);if(o&&"string"==typeof i)return o(i);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}c.resolve=function(t){return e[i][1][t]||t},c.cache={};var h=t[i]=new u.Module(i);e[i][0].call(h.exports,c,h,h.exports,this)}return t[i].exports;function c(e){return u(c.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=t,u.parent=s,u.register=function(t,i){e[t]=[function(e,t){t.exports=i},{}]},a.parcelRequire=u;for(var h=0;h<i.length;h++)u(i[h])}({"2Gtqg":[function(e,t,i){"use strict";function n(e,t,i,n,r,a,s){try{var o=e[a](s),u=o.value}catch(e){return void i(e)}o.done?t(u):Promise.resolve(u).then(n,r)}function r(e){return function(){var t=this,i=arguments;return new Promise((function(r,a){var s=e.apply(t,i);function o(e){n(s,r,a,o,u,"next",e)}function u(e){n(s,r,a,o,u,"throw",e)}o(void 0)}))}}function a(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function s(e,t,i){return t&&a(e.prototype,t),i&&a(e,i),e}function o(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}Object.defineProperty(i,"__esModule",{value:!0}),i.LogoCtrl=void 0;var u=function(){function e(t,i,n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),o(this,"lastVisibleItem",-1),o(this,"resizeObserver",new window.ResizeObserver(this.onResize.bind(this))),this.logo=t,this.canvas=i,this.itemsToReveal=n,this.onFinish=r,this.ctx=this.canvas.getContext("2d"),this.resizeObserver.observe(t),this.resizeObserver.observe(i)}var t,i,n,a,u;return s(e,null,[{key:"randInt",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return Math.random()*(t-e)+e}},{key:"randIntNormalDistributed",value:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,i=0,n=0;0===i;)i=Math.random();for(;0===n;)n=Math.random();var r=Math.abs(Math.sqrt(-2*Math.log(i))*Math.cos(2*Math.PI*n))+.1;return(r>3.8?1:r>1?r%1:r>.1&&r<.4?r+.5*Math.random():r<0?0:r)*(t-e)+e}},{key:"asyncTimeout",value:function(e){return new Promise((function(t){return setTimeout(t,e)}))}}]),s(e,[{key:"onResize",value:(u=r(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.refreshSvgImage();case 2:this.imgSize=this.logo.querySelector("g").getBoundingClientRect(),this.canvasSize={width:this.canvas.offsetWidth,height:this.canvas.offsetHeight},this.canvas.width=this.canvasSize.width*e.dpi,this.canvas.height=this.canvasSize.height*e.dpi,this.ctx.scale(e.dpi,e.dpi);case 7:case"end":return t.stop()}}),t,this)}))),function(){return u.apply(this,arguments)})},{key:"init",value:(a=r(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.onResize();case 2:this.glitchTimeouted(),setTimeout(this.progressReveal.bind(this),2500);case 4:case"end":return e.stop()}}),e,this)}))),function(){return a.apply(this,arguments)})},{key:"glitchImg",value:function(){var t=this.imgSize.width*e.dpi,i=this.imgSize.height*e.dpi,n=Math.max(this.canvas.clientHeight/this.logo.clientHeight,this.canvas.clientWidth/this.logo.clientWidth);Math.random()<.2?this.logo.style.visibility="hidden":(this.logo.style.visibility=null,this.logo.style.transform=Math.random()<.7?"translate(".concat(e.randIntNormalDistributed(-10,10),"%, ").concat(e.randIntNormalDistributed(-10,10),"%)"):"none");for(var r=0;r<e.randInt(1,13);++r){var a=e.randIntNormalDistributed(0,1),s=e.randIntNormalDistributed(0,1),o=e.randIntNormalDistributed(0,1),u=e.randIntNormalDistributed(0,1);this.ctx.drawImage(this.img,a*t,s*i,o*t*n,u*i*n,e.randIntNormalDistributed(0,this.canvasSize.width-this.imgSize.width),e.randIntNormalDistributed(0,this.canvasSize.height-this.imgSize.height),o*this.imgSize.width,u*this.imgSize.height)}}},{key:"glitchTimeouted",value:(n=r(regeneratorRuntime.mark((function t(){var i=this;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.logo.style.visibility=null,t.next=3,Promise.all(new Array(Math.round(e.randInt(.5,3.4))).fill(0).map(r(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.asyncTimeout(e.randInt(550,2500));case 2:return i.glitchImg(),t.next=5,e.asyncTimeout(e.randInt(50,e.maxGlitchTime));case 5:case"end":return t.stop()}}),t)})))));case 3:this.ctx.clearRect(0,0,this.canvasSize.width,this.canvasSize.height),this.glitchTimeouted();case 5:case"end":return t.stop()}}),t,this)}))),function(){return n.apply(this,arguments)})},{key:"progressReveal",value:(i=r(regeneratorRuntime.mark((function t(){var i;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.lastVisibleItem!==this.itemsToReveal.length-1){t.next=2;break}return t.abrupt("return",null===(i=this.onFinish)||void 0===i?void 0:i.call(this));case 2:return this.itemsToReveal[++this.lastVisibleItem].style.visibility=null,t.next=5,this.refreshSvgImage();case 5:setTimeout(this.progressReveal.bind(this),e.randInt(200,700));case 6:case"end":return t.stop()}}),t,this)}))),function(){return i.apply(this,arguments)})},{key:"refreshSvgImage",value:(t=r(regeneratorRuntime.mark((function e(){var t,i,n=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=new Image,e.next=3,new Promise((function(e){t.onload=e.bind(void 0,t);var i=(new XMLSerializer).serializeToString(n.logo);t.src="data:image/svg+xml; charset=utf8, "+encodeURIComponent(i)}));case 3:return i=e.sent,e.abrupt("return",this.img=i);case 5:case"end":return e.stop()}}),e,this)}))),function(){return t.apply(this,arguments)})}]),e}();i.LogoCtrl=u,o(u,"maxGlitchTime",600),o(u,"dpi",window.devicePixelRatio)},{}]},{},[]);
//# sourceMappingURL=logo.ctrl.538986eb.js.map
