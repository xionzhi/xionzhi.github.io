---
title: 'Python多字段排序和分组'
author: xionzhi
date: '2023-01-05'
showAccessNumber: true
categories:
  - python
tags:
  - python
excerpt: "
inventory = [{'key': 'inventory', 'value': 3, 'store': 'A1', 'discount': 1},
             {'key': 'banana', 'value': 2, 'store': 'A1', 'discount': 1},
             {'key': 'pear', 'value': 5, 'store': 'A1', 'discount': 2},
             {'key': 'orange', 'value': 1, 'store': 'A1', 'discount': 2},
             {'key': 'litchi', 'value': 4, 'store': 'A2', 'discount': 2},
             {'key': 'grape', 'value': 6, 'store': 'A2', 'discount': 2},
             {'key': 'watermelon', 'value': 7, 'store': 'A2', 'discount': 1},
             {'key': 'plum', 'value': 8, 'store': 'A2', 'discount': 1},]
             "
---
# 

源数据

```python
inventory = [{'key': 'inventory', 'value': 3, 'store': "A1", 'discount': 1},
             {'key': 'banana', 'value': 2, 'store': "A1", 'discount': 1},
             {'key': 'pear', 'value': 5, 'store': "A1", 'discount': 2},
             {'key': 'orange', 'value': 1, 'store': "A1", 'discount': 2},
             {'key': 'litchi', 'value': 4, 'store': "A2", 'discount': 2},
             {'key': 'grape', 'value': 6, 'store': "A2", 'discount': 2},
             {'key': 'watermelon', 'value': 7, 'store': "A2", 'discount': 1},
             {'key': 'plum', 'value': 8, 'store': "A2", 'discount': 1},]
```



排序

```python
from operator import itemgetter


sorted(inventory, key=itemgetter('store', 'value'))

# order by store, value
[{'key': 'orange', 'value': 1, 'store': 'A1', 'discount': 2},
 {'key': 'banana', 'value': 2, 'store': 'A1', 'discount': 1},
 {'key': 'inventory', 'value': 3, 'store': 'A1', 'discount': 1},
 {'key': 'pear', 'value': 5, 'store': 'A1', 'discount': 2},
 {'key': 'litchi', 'value': 4, 'store': 'A2', 'discount': 2},
 {'key': 'grape', 'value': 6, 'store': 'A2', 'discount': 2},
 {'key': 'watermelon', 'value': 7, 'store': 'A2', 'discount': 1},
 {'key': 'plum', 'value': 8, 'store': 'A2', 'discount': 1}]
```



分组

```python
from itertools import groupby


_itemgetter = itemgetter('store', 'discount')
for k1, v1 in groupby(sorted(inventory, key=_itemgetter), key=_itemgetter):
    print(k1, list(v1))

# group by store, discount
('A1', 1) [{'key': 'inventory', 'value': 3, 'store': 'A1', 'discount': 1}, {'key': 'banana', 'value': 2, 'store': 'A1', 'discount': 1}]

('A1', 2) [{'key': 'pear', 'value': 5, 'store': 'A1', 'discount': 2}, {'key': 'orange', 'value': 1, 'store': 'A1', 'discount': 2}]

('A2', 1) [{'key': 'watermelon', 'value': 7, 'store': 'A2', 'discount': 1}, {'key': 'plum', 'value': 8, 'store': 'A2', 'discount': 1}]

('A2', 2) [{'key': 'litchi', 'value': 4, 'store': 'A2', 'discount': 2}, {'key': 'grape', 'value': 6, 'store': 'A2', 'discount': 2}]

```

