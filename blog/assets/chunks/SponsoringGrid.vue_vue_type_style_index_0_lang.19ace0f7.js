import{e as m,f as u,o as f,g as d,w as r,b as n,r as c,u as e,V as v,h as _,i as b,s as y}from"../app.e7ee2f8e.js";const a=s=>`data:image/svg+xml;charset=utf-8,${s.replace(/#/g,"%23")}`,D=m({__name:"SponsoringGrid",props:{patreonDesc:{type:String,requred:!0},githubDesc:{type:String,requred:!0},buyMeACoffeeDesc:{type:String,requred:!0}},setup(s){const t=s,{siPatreon:p,siBuymeacoffee:l,siGithubsponsors:i}=y,g=u(()=>[{avatar:a(p.svg.replace("<svg ",'<svg style="fill:#FF424D" ')),name:"Patreon",desc:t.patreonDesc,sponsor:"https://www.patreon.com/frsource"},{avatar:a(i.svg.replace("<svg ",'<svg style="fill:#EA4AAA" ')),name:"Github Sponsors",desc:t.githubDesc,sponsor:"https://github.com/sponsors/FRSOURCE/"},{avatar:a(l.svg.replace("<svg ",'<svg style="fill:#FFDD00" ')),name:"Buy me a coffee",desc:t.buyMeACoffeeDesc,sponsor:"https://www.buymeacoffee.com/FRSOURCE"}]);return(o,h)=>(f(),d(e(b),{class:"sponsoring-page"},{default:r(()=>[n(e(v),null,{title:r(()=>[c(o.$slots,"title")]),lead:r(()=>[c(o.$slots,"desc")]),_:3}),n(e(_),{members:e(g)},null,8,["members"])]),_:3}))}});export{D as _};