import{d,o as i,A as _,B as u,C as m,z as o,r as $,I as C,_ as f,c as l,t as r,F as T,u as k,l as v,w as j,b as s,h as M,p as S,k as V,E as p,D as b,L as z,a2 as F,M as O,N as Z,K as w,a3 as U,a4 as G,a5 as K,a6 as q,a7 as J,a8 as Q,a9 as W,aa as X,ab as Y,ac as tt,ad as et,ae as at,af as nt,ag as st,ah as ot}from"./chunks/framework.aaffc6dd.js";import{c as I,d as it,e as rt,L as ct,t as lt}from"./chunks/theme.1f16e17c.js";import{m as _t}from"./chunks/members.830c9d90.js";import"./chunks/index.b910889f.js";const P="/blog/code.webp",dt="/blog/code_320.webp",ut="/blog/code_400.webp",pt={class:"tile__inner"},ht=d({__name:"Tile",props:{title:String,description:String,tag:{type:String,default:"div"},link:String,linkText:String},setup(t){return(e,n)=>(i(),_(C(t.tag),{class:"tile"},{default:u(()=>[t.link?(i(),_(I,{key:0,class:"tile__link",href:t.link,"no-icon":"",title:`${t.linkText}: ${t.title}`},null,8,["href","title"])):m("",!0),o("div",pt,[$(e.$slots,"default",{},void 0,!0)])]),_:3}))}});const mt=f(ht,[["__scopeId","data-v-f5a290e9"]]),ft=["textContent"],gt={key:0,class:"link-text c-secondary font-secondary"},vt=d({__name:"TileTextContent",props:{titleTag:{type:String,default:"h2"},title:String,description:String,linkText:String},setup(t){return(e,n)=>(i(),l(T,null,[(i(),_(C(t.titleTag),{class:"title font-secondary",textContent:r(t.title)},null,8,["textContent"])),o("p",{class:"desc",textContent:r(t.description)},null,8,ft),t.linkText?(i(),l("p",gt,r(t.linkText)+" > ",1)):m("",!0)],64))}});const yt=f(vt,[["__scopeId","data-v-342105d5"]]),xt={class:"avatar"},wt=["src","alt"],kt={key:0,class:"author__name"},At=d({__name:"AuthorInfo",props:{author:String,onlyAvatar:Boolean},setup(t){const e=t,{localeIndex:n}=k(),a=v(()=>_t.find(({id:c})=>c===e.author));return j(a,c=>{if(!c)throw new Error(`Cannot find author with id: ${e.author}`)},{immediate:!0}),(c,y)=>s(a)?(i(),_(I,{key:0,href:"/team",class:"author",title:s(n)==="root"?`Read more about the author: ${s(a).name}`:`Dowiedz się więcej nt. autora artykułu: ${s(a).name}`},{default:u(()=>[o("span",xt,[o("img",{class:"avatar__img",src:s(a).avatar,width:"40",height:"40",alt:s(n)==="root"?`Photo of article author: ${s(a).name}`:`Na zdjęciu autor artykułu: ${s(a).name}`},null,8,wt)]),t.onlyAvatar?m("",!0):(i(),l("span",kt,r(s(a).name),1))]),_:1},8,["title"])):m("",!0)}});const D=f(At,[["__scopeId","data-v-e9f59387"]]),$t={class:"article__content"},Ct={class:"info-box"},Tt=["datetime"],St={key:0,class:"img"},Vt=d({__name:"Article",props:{author:null,title:null,description:null,link:null,linkText:null,image:null,creationDate:null},setup(t){const e=t,n=v(()=>new Date(e.creationDate)),a=v(()=>n.value.toISOString()),c=M("");return S(()=>{V(()=>{c.value=n.value.toLocaleDateString(window.navigator.language)})}),(y,g)=>(i(),_(mt,b(y.$props,{tag:"article",class:["article",{"article--with-img":t.image}]}),{default:u(()=>[o("div",$t,[o("div",Ct,[p(D,{author:t.author,"only-avatar":!t.image},null,8,["author","only-avatar"]),o("time",{class:"creation-date",datetime:s(a)},r(c.value),9,Tt)]),p(yt,{title:t.title,description:t.description,"link-text":t.linkText,"title-tag":"h4"},null,8,["title","description","link-text"])]),t.image?(i(),l("div",St,[p(it,{image:t.image},null,8,["image"])])):m("",!0)]),_:1},16,["class"]))}});const bt=f(Vt,[["__scopeId","data-v-7c1e12d1"]]),It={class:"layout-container"},Pt={class:"articles"},Dt=d({__name:"Articles",props:{articles:Array},setup(t){return(e,n)=>(i(),l("section",It,[$(e.$slots,"prefix",{},void 0,!0),o("div",Pt,[(i(!0),l(T,null,z(t.articles,(a,c)=>(i(),_(bt,b({key:a.title},a,{image:a.image&&c%4===0?a.image:void 0}),null,16,["image"]))),128))])]))}});const Lt=f(Dt,[["__scopeId","data-v-5c3a19f1"]]),Ht=t=>(O("data-v-8932d278"),t=t(),Z(),t),Bt=dt+" 320w, "+ut+" 400w, "+P+" 640w",Et={class:"layout-container"},Nt={class:"hero"},Rt={key:0,class:"hero__text-wrapper"},jt={class:"hero__text"},Mt={class:"hero__text"},zt={class:"c-secondary"},Ft={class:"c-tertiary"},Ot={class:"c-primary"},Zt={style:{height:"0",width:"0"},"aria-hidden":"true"},Ut=Ht(()=>o("clipPath",{id:"frs_code_clipPath",clipPathUnits:"objectBoundingBox"},[o("path",{d:"M.6471.2587.5328.1925.2544.3533.2544.4623.3774.5333C.361.5345.346.54.346.559.346.5809.365.5872.3887.5953.405.6008.4187.6044.4187.6125.4187.6186.4134.6224.3971.6222.3749.6222.3663.617.3663.5998H.3409C.3409.628.356.6445.3962.6445.4307.6446.4443.6314.4443.6121.4443.5889.4126.5799.392.5729.374.5669.3714.565.3714.5599.3714.5541.3786.5516.3899.5516.4037.5516.4143.5554.4143.5675H.4367L.8111.7836.925.7176.9255.6086.8559.5685.9255.5282.9255.4194.8113.3533.6471.448.5775.4078.6471.3675ZM.291.4041A.1665.1665 90 01.291.7776.1665.1665 90 01.291.4041M.291.3744A.2165.2165 90 10.291.8075.2165.2165 90 00.291.3744M.1425.531H.2225V.5533H.168V.5855L.2188.5824V.6049L.168.608V.643H.1425V.531ZM.2351.531H.2785C.3051.531.3284.5373.3284.5622.3284.5807.3134.5859.2999.5874V.5938H.3162C.325.5938.3297.5985.3297.6072V.643H.3044V.6036H.2606V.643H.235V.531ZM.2785.5814C.2935.5814.3029.5814.3029.5674.3029.5533.2938.5533.2785.5533H.2605V.5814H.2785Z"})],-1)),Gt=[Ut],Kt=["alt"],qt=["textContent"],Jt={class:"header-info"},Qt=d({__name:"Layout",setup(t){const{localeIndex:e,page:n,frontmatter:a,isDark:c}=k(),y=v(()=>{var x;return(x=n.value.articles[e.value])==null?void 0:x.map(({title:A,author:H,description:B,path:E,image:N,creationDate:R})=>({title:A,author:H,description:B,image:N,creationDate:R,link:E,linkText:e.value==="root"?"Read the full article":"Przeczytaj cały artykuł"}))}),g=v(()=>a.value.frs_hero.text.split(" "));return(x,A)=>(i(),_(ct,null,F({"doc-before":u(()=>[o("div",Jt,[p(D,{author:s(n).frontmatter.author},null,8,["author"]),p(rt)])]),_:2},[s(n).frontmatter.showNewestArticles?{name:"home-features-before",fn:u(()=>[o("div",Et,[o("div",Nt,[s(a).frs_hero?(i(),l("hgroup",Rt,[o("h1",jt,r(s(a).frs_hero.name),1),o("h2",Mt,[o("span",zt,r(s(g)[0]+" "),1),o("span",Ft,r(s(g)[1]+" "),1),o("span",Ot,r(s(g)[2])+" "+r(s(g)[3]),1)])])):m("",!0),(i(),l("svg",Zt,Gt)),o("img",{class:"hero_image",src:P,srcset:Bt,sizes:`
                            (min-width: 960px) 400px,
                            (min-width: 640px) 200px,
                            160px
                        `,alt:s(a).frs_hero.image.alt},null,8,Kt)])]),p(Lt,{articles:s(y)},{prefix:u(()=>[o("h3",{class:"section-title font-secondary",textContent:r(s(e)==="root"?"Newest articles":"Najnowsze artykuły")},null,8,qt)]),_:1},8,["articles"])]),key:"0"}:void 0]),1024))}});const Wt=f(Qt,[["__scopeId","data-v-8932d278"]]),Xt={...lt,Layout:Wt};function L(t){if(t.extends){const e=L(t.extends);return{...e,...t,async enhanceApp(n){e.enhanceApp&&await e.enhanceApp(n),t.enhanceApp&&await t.enhanceApp(n)}}}return t}const h=L(Xt),Yt=d({name:"VitePressApp",setup(){const{site:t}=k();return S(()=>{V(()=>{document.documentElement.lang=t.value.lang,document.documentElement.dir=t.value.dir})}),G(),K(),q(),h.setup&&h.setup(),()=>J(h.Layout)}});async function te(){const t=ae(),e=ee();e.provide(Q,t);const n=W(t.route);return e.provide(X,n),e.component("Content",Y),e.component("ClientOnly",tt),Object.defineProperties(e.config.globalProperties,{$frontmatter:{get(){return n.frontmatter.value}},$params:{get(){return n.page.value.params}}}),h.enhanceApp&&await h.enhanceApp({app:e,router:t,siteData:et}),{app:e,router:t,data:n}}function ee(){return at(Yt)}function ae(){let t=w,e;return nt(n=>{let a=st(n);return t&&(e=a),(t||e===a)&&(a=a.replace(/\.js$/,".lean.js")),w&&(t=!1),ot(()=>import(a),[])},h.NotFound)}w&&te().then(({app:t,router:e,data:n})=>{e.go().then(()=>{U(e.route,n.site),t.mount("#app")})});export{te as createApp};