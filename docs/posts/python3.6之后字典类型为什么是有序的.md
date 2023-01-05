---
title: 'python3.6之后字典类型为什么是有序的'
author: xionzhi
date: '2023-01-05'
showAccessNumber: true
categories:
  - python
tags:
  - python
excerpt: "有序字典设计使用基于[**Raymond Hettinger**](https://mail.python.org/pipermail/python-dev/2012-December/123028.html) 提出的`More compact dictionaries with faster iteration`， 最开始由 [**PyPy**](https://morepypy.blogspot.com/2015/01/faster-more-memory-efficient-and-more.html) 实现。`dict()`与 `Python 3.5` 相比，新版本的内存使用量减少了`20%` 到 `25%`，从 `Python 3.8` 开始，字典还支持反向迭代`reversed`。"
---




有序字典设计使用基于[**Raymond Hettinger**](https://mail.python.org/pipermail/python-dev/2012-December/123028.html) 提出的`More compact dictionaries with faster iteration`， 最开始由 [**PyPy**](https://morepypy.blogspot.com/2015/01/faster-more-memory-efficient-and-more.html) 实现。`dict()`与 `Python 3.5` 相比，新版本的内存使用量减少了`20%` 到 `25%`，从 `Python 3.8` 开始，字典还支持反向迭代`reversed`。

字典迭代方式
```python
tel = {'jack': 4098, 'guido': 4127, 'irv': 4127}

# 所有key value
for k, v in tel.items()

# 所有value
for v in tel.values()

# 所有key
for k in tel.keys()

# 反向reversed
for k, v in reversed(tel.items())
```

在之前版本中(python3.5)，PyPy字典以及CPython字典的实现如下（简化视图）
```c++
/* python3.5 */
struct dict {
   long num_items;
   dict_entry* items;   /* pointer to array */
}

struct dict_entry {
   long hash;
   PyObject* key;
   PyObject* value;
}

/* 新的字典设计 */
struct dict {
    long num_items;
    variable_int* sparse_array;
    dict_entry* compact_array;
}

struct dict_entry {
    long hash;
    PyObject* key;
    PyObject* value;
}
```

通俗来说就是增加一个SparseArray，类似于HashMap，用来储存哈希值、键指针、和值指针

```python
d = {'timmy': 'red', 'barry': 'green', 'guido': 'blue'}

# 3.5
entries = [['--', '--', '--'],
           [-8522787127447073495, 'barry', 'green'],
           ['--', '--', '--'],
           ['--', '--', '--'],
           ['--', '--', '--'],
           [-9092791511155847987, 'timmy', 'red'],
           ['--', '--', '--'],
           [-6480567542315338377, 'guido', 'blue']]

# 3.6+
indices =  [None, 1, None, None, None, 0, None, 2]
entries =  [[-9092791511155847987, 'timmy', 'red'],
            [-8522787127447073495, 'barry', 'green'],
            [-6480567542315338377, 'guido', 'blue']]
```

以上是如何进行的呢?

```python
hash('timmy')  # -9092791511155847987

-9092791511155847987 % 8  # 5
```

把`indices`这个一维数组里面，下标为5的位置修改为0。

这里的0是什么意思呢？0是二维数组`entries`的索引。现在`entries`里面的第一项，就是我们刚刚添加的这个键值对的三个数据：`timmy`的hash值、指向`timmy`的指针和指向`red`的指针。

所以`indices`里面填写的数字0，就是刚刚我们插入的这个键值对的数据在二维数组里面的行索引。

最后总结

- key必须是可以hash的，数字字符元组都是可以的，自定义类型要满足(1.支持hash()，2.可以\_\_eq\_\_()判断相等，3. `a==b is True and hash(a)==hash(b) is True`)
- 字典是比较损耗内存的(空间换时间)
- key查询速度非常快
- 字典中添加新的key可能会导致容量膨胀，导致哈希表中键的顺序发生变化。因此，不要在遍历时的同时修改字典。

参考：<br>
[[Python-Dev] More compact dictionaries with faster iteration](https://mail.python.org/pipermail/python-dev/2012-December/123028.html)<br>
[[docs.python.org] New dict implementation](https://docs.python.org/3/whatsnew/3.6.html#whatsnew36-compactdict)<br/>
[[docs.python.org] Table of Contents Dictionaries](https://docs.python.org/3.11/tutorial/datastructures.html#dictionaries)<br />
[[PyPy]Faster, more memory efficient and more ordered dictionaries on PyPy](https://morepypy.blogspot.com/2015/01/faster-more-memory-efficient-and-more.html)

