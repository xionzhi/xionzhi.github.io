---
title: '关于Python默认参数的一个大坑'
author: xionzhi
date: '2023-01-05'
showAccessNumber: true
categories:
  - python
tags:
  - python
excerpt: "
定义一个玩家类`Player`, 有名字`name`和道具`items`两个属性

python
class Player:
    def __init__(self, name, items):
        self.name = name
        self.items = items


p1 = Player('王大发', [])
p2 = Player('陈不发', [])
p3 = Player('马发腾', ['金色传说'])


初始化两个玩家`p1 p2`, 此时发现大部分玩家创建时道具`items`是空的, 所以就有了以下代码
"
---




定义一个玩家类`Player`, 有名字`name`和道具`items`两个属性

```python
class Player:
    def __init__(self, name, items):
        self.name = name
        self.items = items


p1 = Player('王大发', [])
p2 = Player('陈不发', [])
p3 = Player('马发腾', ['金色传说'])
```

初始化两个玩家`p1 p2`, 此时发现大部分玩家创建时道具`items`是空的, 所以就有了以下代码

```python
class Player:
    def __init__(self, name, items=[]):
        self.name = name
        self.items = items


p1 = Player('王大发')
p2 = Player('陈不发')
p3 = Player('马发腾', ['金色传说'])

```

看起来没啥问题, 接下来给`p1 p2`都增加道具试试

```python
p1.items.append('头盔')
p2.items.append('胸甲')

# 打印p1用户的道具
print(p1.items)

['头盔', '胸甲']
```

原因: python在处理这种默认参数的时候只会`evaluate`一次, 就是p1和p2在初始化的时候用了同一个`list`, list在python中是`mutable`,
最终同一个list被append了两次


python文档中的解释如下 [docs.python.org](https://docs.python.org/3/reference/compound_stmts.html)

> Default parameter values are evaluated from left to right when the function definition is executed. This means that the expression is evaluated once, when the function is defined, and that the same “pre-computed” value is used for each call. This is especially important to understand when a default parameter value is a mutable object, such as a list or a dictionary: if the function modifies the object (e.g. by appending an item to a list), the default parameter value is in effect modified. This is generally not what was intended. A way around this is to use None as the default, and explicitly test for it in the body of the function, e.g.: 

```python
def whats_on_the_telly(penguin=None):
    if penguin is None:
        penguin = []
    penguin.append("property of the zoo")
    return penguin

```



以下例子同样适用

```python
import asyncio
from uuid import uuid4


class Player:
    async def run(self):
        tasks = []
        for i in range(3):
            tasks.append(self.attack(i))

        results = await asyncio.gather(*tasks, return_exceptions=True)
        print(results)

    @staticmethod
    async def attack(_id, _uuid4=uuid4().hex):
        f = f'id: {_id}, uuid: {_uuid4}'
        return f


if __name__ == '__main__':
    p = Player()
    asyncio.run(p.run())

"""
['id: 0, uuid: eb948174e63b4ba8953fa1049fe4aa3c', 
 'id: 1, uuid: eb948174e63b4ba8953fa1049fe4aa3c', 
 'id: 2, uuid: eb948174e63b4ba8953fa1049fe4aa3c']
"""
```

就算每次都重新实例化依旧不变

```python

import asyncio
from uuid import uuid4


class Player:
    async def attack(self, _id, _uuid4=uuid4().hex):
        print(f'id: {id(self)}')  # 打印实例内存ID
        f = f'id: {_id}, uuid: {_uuid4}'
        return f


async def run():
    tasks = []
    for i in range(3):
        tasks.append(Player().attack(i))

    results = await asyncio.gather(*tasks, return_exceptions=True)
    print(results)


if __name__ == '__main__':
    asyncio.run(run())

"""
id: 140547107748496
id: 140547107748560
id: 140547107748624

['id: 0, uuid: 5cb09a6ef04d40c68265b8313bc4f2c3', 
 'id: 1, uuid: 5cb09a6ef04d40c68265b8313bc4f2c3', 
 'id: 2, uuid: 5cb09a6ef04d40c68265b8313bc4f2c3']
"""
```

总结: 请一定要小心使用默认参数

