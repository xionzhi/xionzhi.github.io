import{_ as s,o as n,c as a,a as p}from"./app.06916134.js";const i=JSON.parse('{"title":"关于Python默认参数的一个大坑","description":"","frontmatter":{"title":"关于Python默认参数的一个大坑","author":"xionzhi","date":"2023-01-05","showAccessNumber":true,"categories":["python"],"tags":["python"],"excerpt":" 定义一个玩家类`Player`, 有名字`name`和道具`items`两个属性\\npython class Player: def __init__(self, name, items): self.name = name self.items = items\\n\\np1 = Player(\'王大发\', []) p2 = Player(\'陈不发\', []) p3 = Player(\'马发腾\', [\'金色传说\'])\\n\\n初始化两个玩家`p1 p2`, 此时发现大部分玩家创建时道具`items`是空的, 所以就有了以下代码 "},"headers":[],"relativePath":"posts/关于Python默认参数的一个大坑.md"}'),l={name:"posts/关于Python默认参数的一个大坑.md"},o=p("",15),e=[o];function t(c,r,D,y,F,A){return n(),a("div",null,e)}const d=s(l,[["render",t]]);export{i as __pageData,d as default};
