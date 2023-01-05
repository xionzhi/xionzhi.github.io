---
title: 'Python标准运算符替代函数'
author: xionzhi
date: '2023-01-05'
showAccessNumber: true
categories:
  - python
tags:
  - python
excerpt: "
from operator import *

# 1. 绝对值
abs(100)  # 100
abs(-100)  # 100
abs(2j + 1)  # 2.23606797749979, 返回复数的绝对值 (a^2+b^2)**0.5

# 2. 加法
add(100, 1)  # 101, a + b

# 3. 按位与
and_(True, [1])  # 1, a & b
and_({1,2,3}, {2,3,4})  # {2, 3}, 

# 4. 连接
concat('abc', '123')  # abc123, seq1 + seq2
concat([1, 2], [3])  # [1,2,3]

# 5. 包含检测
contains([1, 2], 1)  # True, obj in seq
"
---




```python
from operator import *

# 1. 绝对值
abs(100)  # 100
abs(-100)  # 100
abs(2j + 1)  # 2.23606797749979, 返回复数的绝对值 (a^2+b^2)**0.5

# 2. 加法
add(100, 1)  # 101, a + b

# 3. 按位与
and_(True, [1])  # 1, a & b
and_({1,2,3}, {2,3,4})  # {2, 3}, 

# 4. 连接
concat('abc', '123')  # abc123, seq1 + seq2
concat([1, 2], [3])  # [1,2,3]

# 5. 包含检测
contains([1, 2], 1)  # True, obj in seq

# 6. 频次计数
countOf([1, 2, 3, 1], 1)  # 2, sum((i for i in [1,2,3,1] if i == 1))

# 7. 切片移除
seq = ['a', 'b', 'c']
delitem(seq, 0)  # seq -> ['b', 'c'], del test[0]
delitem(seq, slice(0, 2))  # seq -> ['c']

# 8. 相等
eq('test', 'test')  # True, ? -> a == b

# 9. 整除
floordiv(10, 3)  # 3, a // b

# 10. 大于等于
ge(2, 1)  # True, a >= b
ge(2, 2)  # True

# 11. 切片取值
getitem(['a', 'b', 'c'], 0)  # 'a', test[0]
getitem(['a', 'b', 'c'], slice(0, 2))  # ['a', 'b']

# 12. 大于
gt(2, 1)  # True a > b
gt(2, 2)  # False

# 13. 原地加
test = ['a', 'b', 'c']
test2 = iadd(test, ['e'])  # test += ['e'], test -> ['a','b','c','e'], id(test2) == id(test)
test1 = add(test, ['e'])  # diff add, test -> ['a','b','c'], id(test) != id(test1)

# 14. 原地按位与
a, b = {1,2,3}, {2,3,4}
a1 = iand(a, b)  # a &= b, a -> {2, 3}, diff and_ id(a1) == id(a)

# 15. 原地连接
a, b = 'abc', '123'
iconcat(a, b)  # a += b, a -> 'abc123'

# 16. 原地整除
a, b = 10, 3
ifloordiv(a, b)  # a //= b, a -> 3

# 17. 原地左移
a, b = 5, 3  # bin(5) -> '0b101', bin(3) -> '0b11' 
ilshift(a, b)  # a <<= b, a -> '0b101000'
lshift(0, 100)  # 0

# 18. 原地矩阵乘法
a, b = np.array([[1, 2], [3, 4]]), np.array([[11, 12], [13, 14]])
imatmul(a, b)  # a -> array([[37, 40],[85, 92]]), a =@ b

# 19. 原地求余
a, b = 10, 3
imod(a, b)  # a %= b, 1

# 20. 原地乘法
a, b = 2, 3
imul(a, b)  # a *= b, 6

# 21. 整数返回
# https://docs.python.org/3/reference/datamodel.html#object.__index__
index(True)  # a.__index__(), 1
a = np.int8(101)
type(a)  # <class 'numpy.int8'>
index(a)  # 8
type(index(a))  # <class 'int'>

# 22. 索引查询
indexOf([1,2,3,4], 2)  # 1, first index of b in a

# 23. 按位求反
inv(1)  # -2, ~1, bin(1), bin(-2) -> '0b1', '-0b10', 0000000000000001, 1111111111111110
invert(1)  # ~a = (-a - 1)

# 24. 原地按位或
a, b = False, True
ior(a, b)  # a |= b, a -> True

# 25. 原地取幂
a, b = 2, 10
ipow(a, b)  # 1024, a **= b

# 26. 原地右移
a, b = 10, 1  # bin(10) -> '0b1010', bin(1) -> '0b1' 
irshift(a, b)  # a >>= b, a -> '0b101', 5
rshift(1024, 1)  # 512

# 27. 原地减法
a, b = 3, 1
isub(a, b)  # a -> 2. a -= b

# 28. 标识检测
a = [1, 2, 3]
b = a
c = list(a)
is_(a, b)  # True, a is b
is_(a, c)  # False
is_(True, True)  # True

# 29. 标识检测
is_not(True, True)  # False, a is not b, not (a is b)

# 30. 原地除法
a, b = 10, 4
itruediv(a, b)  # 2.5, a /= b

# 31. 原地按位异或
a, b = 8, 9  # 0b1000, 0b1001
ixor(a, b)  # a -> 1, 0b1, a ^= b

# 32. 小于等于
le(1, 1)  # True
le(2, 1)  # False

# 33. 长度返回
length_hint('abc')  # 3
length_hint(None, 2)  # 2, not length return 2

# 34. 左移
a, b = 5, 3  # bin(5) -> '0b101', bin(3) -> '0b11' 
lshift(a, b)  # a << b, a -> '0b101000'
lshift(0, 100)  # 0

# 35. 小于
lt(1, 2)  # True
lt(1, 1)  # False

# 36. 矩阵乘法
a, b = np.array([[1, 2], [3, 4]]), np.array([[11, 12], [13, 14]])
matmul(a, b)  # a -> array([[37, 40],[85, 92]]), a @ b

# 37. 求余
a, b = 10, 3
mod(a, b)  # a % b, 1

# 38. 乘法
mul(3, 2)  # 6, a * b

# 39. 不等
ne(1, 2)  # False, a != b

# 40. 值取反
neg(1)  # -1, -a

# 41. 逻辑取反
not_(True)  # False, not True
not_([])  # True
not_('')  # True

# 42. 按位或
a, b = False, True
or_(a, b)  # a | b, True

# 43. 正数
pos(True)  # 1, +a

# 44. 取幂
a, b = 2, 10
pow(a, b)  # 1024, a ** b

# 45. 左移
a, b = 5, 3  # bin(5) -> '0b101', bin(3) -> '0b11' 
lshift(a, b)  # a << b, a -> '0b101000'
lshift(0, 100)  # 0

# 46. 切片赋值
seq = []
setitem(seq, slice(0, 3), [1,2,3])  # seq -> seq
setitem(seq, slice(i, j), values)

# 47. 减法
sub(10, 2)  # 8, a - b

# 48. 除法
truediv(10. 4)  # 2.5, a / b

# 49. 真值检测
truth([])  # False
truth(0)  # False
truth(None)  # False
truth('string')  # True

# 50. 按位异或
a, b = 8, 9  # 0b1000, 0b1001
xor(a, b)  # 0b1, a ^ b

```



## attrgetter

返回一个可从操作数中获取 *attr* 的可调用对象。 如果请求了一个以上的属性，则返回一个属性元组。 属性名称还可包含点号。 例如：

- 在 `f = attrgetter('name')` 之后，调用 `f(b)` 将返回 `b.name`。
- 在 `f = attrgetter('name', 'date')` 之后，调用 `f(b)` 将返回 `(b.name, b.date)`。
- 在 `f = attrgetter('name.first', 'name.last')` 之后，调用 `f(b)` 将返回 `(b.name.first, b.name.last)`。

```python
def attrgetter(*items):
    if any(not isinstance(item, str) for item in items):
        raise TypeError('attribute name must be a string')
    if len(items) == 1:
        attr = items[0]
        def g(obj):
            return resolve_attr(obj, attr)
    else:
        def g(obj):
            return tuple(resolve_attr(obj, attr) for attr in items)
    return g

def resolve_attr(obj, attr):
    for name in attr.split("."):
        obj = getattr(obj, name)
    return obj
```



## itemgetter

返回一个使用操作数的 [`__getitem__()`](https://docs.python.org/zh-cn/3.8/library/operator.html#operator.__getitem__) 方法从操作数中获取 *item* 的可调用对象。 如果指定了多个条目，则返回一个查找值的元组。 例如：

- 在 `f = itemgetter(2)` 之后，调用 `f(r)` 将返回 `r[2]`。
- 在 `g = itemgetter(2, 5, 3)` 之后，调用 `g(r)` 将返回 `(r[2], r[5], r[3])`。

```python
def itemgetter(*items):
    if len(items) == 1:
        item = items[0]
        def g(obj):
            return obj[item]
    else:
        def g(obj):
            return tuple(obj[item] for item in items)
    return g
```



排序用法

```python
inventory = [('apple', 3), ('banana', 2), ('pear', 5), ('orange', 1)]
sorted(inventory, key=itemgetter(1))
# [('orange', 1), ('banana', 2), ('apple', 3), ('pear', 5)]

inventory = [{'key': 'inventory', 'value': 3},
             {'key': 'banana', 'value': 2},
             {'key': 'pear', 'value': 5},
             {'key': 'orange', 'value': 1}]
sorted(inventory, key=itemgetter('value'))
# [{'key': 'orange', 'value': 1},
#  {'key': 'banana', 'value': 2},
#  {'key': 'inventory', 'value': 3},
#  {'key': 'pear', 'value': 5}]

```



分组用法

```python
from itertools import groupby

inventory = [{'key': 'inventory', 'value': 3, 'store': "A1"},
             {'key': 'banana', 'value': 2, 'store': "A1"},
             {'key': 'pear', 'value': 5, 'store': "A2"},
             {'key': 'orange', 'value': 1, 'store': "A2"},
             {'key': 'litchi', 'value': 4, 'store': "A3"},]
for k1, v1 in groupby(sorted(inventory, key=itemgetter('store')), key=itemgetter('store')):
  print(k1, list(v1))

# A1 [{'key': 'inventory', 'value': 3, 'store': 'A1'}, {'key': 'banana', 'value': 2, 'store': 'A1'}]
# A2 [{'key': 'pear', 'value': 5, 'store': 'A2'}, {'key': 'orange', 'value': 1, 'store': 'A2'}]
# A3 [{'key': 'litchi', 'value': 4, 'store': 'A3'}]


```





切片取值

```python
itemgetter(1)('ABCDEFG')
# B

itemgetter(1, 3, 5)('ABCDEFG')
# ('B', 'D', 'F')

itemgetter(slice(2, None))('ABCDEFG')
# 'CDEFG'

soldier = dict(rank='captain', name='dotterbart')
itemgetter('rank')(soldier)
# 'captain'
```





## methodcaller

返回一个在操作数上调用 *name* 方法的可调用对象。 如果给出额外的参数和/或关键字参数，它们也将被传给该方法。 例如：

- 在 `f = methodcaller('name')` 之后，调用 `f(b)` 将返回 `b.name()`。
- 在 `f = methodcaller('name', 'foo', bar=1)` 之后，调用 `f(b)` 将返回 `b.name('foo', bar=1)`。

```python
def methodcaller(name, /, *args, **kwargs):
    def caller(obj):
        return getattr(obj, name)(*args, **kwargs)
    return caller
```



