import{_ as c,o as i,c as n,b as e,t as a,d as _,F as h,r as g,e as l,f as o}from"./app.95cb799f.js";const p={props:{title:{type:String,required:!0},excerpt:{type:String,required:!0},tags:{type:Array,required:!0},author:{type:String,required:!0},date:{type:String,required:!0},href:{type:String,required:!0}},methods:{truncateText(r,s){return r.length>s?r.substring(0,s)+"...":r}}},m={class:"post"},f={class:"post-header"},x={class:"post-title"},v=["href"],y={class:"post-excerpt"},b={class:"post-meta"},S=["href"],q=["datetime"];function N(r,s,t,u,B,C){return i(),n("article",m,[e("header",f,[e("h2",x,[e("a",{href:t.href},a(t.title),9,v)])]),e("section",y,[e("p",null,a(t.excerpt),1)]),e("footer",b,[e("a",{class:"author-thumb",href:"/author/"+t.author},a(t.author),9,S),_(" on "),(i(!0),n(h,null,g(t.tags,(P,V)=>(i(),n("span"))),256)),e("time",{class:"post-date",datetime:t.date},a(t.date),9,q)])])}const d=c(p,[["render",N]]),D=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"index.md"}'),z={name:"index.md"},F=Object.assign(z,{setup(r){return(s,t)=>{const u=l("home");return i(),n("div",null,[o(d,{title:"mongo聚合aggregate将数据分组group两次",excerpt:"源数据下载 github 需求说明 每个uid 统计vin每天去重后的数量 1. 将数据格式化处理 时间处理到每天 2. 第一次分组 用uid进行分组 3. 取出第一次分组后的数据 4. 第二次分组 用uid和时间进行分组 取出vin去重",author:"xionzhi",tags:"111",href:"/posts/test",date:"2022-08-01"}),o(d,{title:"mongo聚合aggregate将数据分组group两次",excerpt:"源数据下载 github 需求说明 每个uid 统计vin每天去重后的数量 1. 将数据格式化处理 时间处理到每天 2. 第一次分组 用uid进行分组 3. 取出第一次分组后的数据 4. 第二次分组 用uid和时间进行分组 取出vin去重",author:"xionzhi",tags:"111",href:"/posts/test",date:"2022-08-01"}),o(d,{title:"mongo聚合aggregate将数据分组group两次",excerpt:"源数据下载 github 需求说明 每个uid 统计vin每天去重后的数量 1. 将数据格式化处理 时间处理到每天 2. 第一次分组 用uid进行分组 3. 取出第一次分组后的数据 4. 第二次分组 用uid和时间进行分组 取出vin去重",author:"xionzhi",tags:"[1, 2]",href:"/posts/test",date:"2022-08-01"}),o(u)])}}});export{D as __pageData,F as default};