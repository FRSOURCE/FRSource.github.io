import{V as m,a as l,b as i}from"./theme.paBUVA-3.js";import{d as g,g as u,o as f,b as d,w as t,I as n,r as c,m as a}from"./framework.-BNiHU1F.js";import{s as b,a as v,b as h}from"./index.t-GlVwh5.js";const r=e=>`data:image/svg+xml;charset=utf-8,${e.replace(/#/g,"%23")}`,P=g({__name:"SponsoringGrid",props:{patreonDesc:{type:String,requred:!0},githubDesc:{type:String,requred:!0},buyMeACoffeeDesc:{type:String,requred:!0}},setup(e){const s=e,p=u(()=>[{avatar:r(b.svg.replace("<svg ",'<svg style="fill:#FF424D" ')),name:"Patreon",desc:s.patreonDesc,sponsor:"https://www.patreon.com/frsource"},{avatar:r(v.svg.replace("<svg ",'<svg style="fill:#EA4AAA" ')),name:"Github Sponsors",desc:s.githubDesc,sponsor:"https://github.com/sponsors/FRSOURCE/"},{avatar:r(h.svg.replace("<svg ",'<svg style="fill:#FFDD00" ')),name:"Buy me a coffee",desc:s.buyMeACoffeeDesc,sponsor:"https://www.buymeacoffee.com/FRSOURCE"}]);return(o,y)=>(f(),d(a(i),{class:"sponsoring-page"},{default:t(()=>[n(a(m),null,{title:t(()=>[c(o.$slots,"title")]),lead:t(()=>[c(o.$slots,"desc")]),_:3}),n(a(l),{members:p.value},null,8,["members"])]),_:3}))}});export{P as _};
