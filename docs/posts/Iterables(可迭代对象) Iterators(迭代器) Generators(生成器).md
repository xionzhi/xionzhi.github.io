---
title: Iterables(可迭代对象) Iterators(迭代器) Generators(生成器)
author: xionzhi
date: '2022-12-23'
showAccessNumber: true
categories:
  - 测试
tags:
  - 标签1
  - 标签2
  - 标签3
excerpt: '在python中有许多概念在探究细节差异的时候是容易混淆的，比如:

- a container(容器)
- an iterable(可迭代对象)
- an iterator(迭代器)
- a generator(生成器)
- a generator expression(各种生成式 列表生成式和字典生成式之类)
- a {list, set, dict} comprehension(对列表集合字典的理解)'
---


> **翻译来源: [nvie.com/iterators-vs-generators](https://nvie.com/posts/iterators-vs-generators/)**


在python中有许多概念在探究细节差异的时候是容易混淆的，比如:

- a container(容器)
- an iterable(可迭代对象)
- an iterator(迭代器)
- a generator(生成器)
- a generator expression(各种生成式 列表生成式和字典生成式之类)
- a {list, set, dict} comprehension(对列表集合字典的理解)

<img src="https://xionzhi.com/content/images/2022/03/relationships.png" width="100%" alt="nvie.com/posts/iterators-vs-generators">

> ### 容器Containers

容器是储存一些数据的数据结构,他可以直接检验一个数据是否在容器中，这些容器是存储在哪丛中的，从其中的值也一般是在内存中的。在Python中以下结构属于容器：

- list, deque, …
- set, frozensets, …
- dict, defaultdict, OrderedDict, Counter, …
- tuple, namedtuple, …
- str

从实际操作上来说，当可以询问对象是否包含某个元素时，它就是一个容器：

```python
In [1]: assert 1 in [1, 2, 3]

In [2]: assert 4 not in [1, 2, 3]

In [3]: assert 1 in {1, 2, 3}

In [4]: assert 4 not in {1, 2, 3}

In [5]: assert 1 in (1, 2, 3)

In [6]: assert 4 not in (1, 2, 3)

```

字典结构可以检查key是否存在

```python
In [1]: d = {1: '1', 2: '2', 3: '3'}

In [2]: assert 1 in d

In [3]: assert 4 not in d

In [4]: assert '1' not in d

```

字符串可以用来检查一个字符串是否包含另一个字符串

```python
In [1]: s = 'foobar'

In [2]: assert 'b' in s

In [3]: assert 'x' not in s

In [4]: assert 'foo' in s

```

> ### 可迭代对象Iterables

大多数容器也是可迭代的。但在python中还有更多可迭代的数据结构。比如打开的文件、打开的套接字等。在容器大小有限的情况下，可迭代对象也可以代表无限的数据源。

可迭代对象是可以返回迭代器（目的是返回其所有元素）的任何对象，不一定是数据结构。这听起来有点绕，但是可迭代对象和迭代器之间有一个重要的区别。看下面里例子:

```python
In [1]: x = [1, 2, 3]

In [2]: y = iter(x)

In [3]: z = iter(x)

In [4]: next(y)
Out[4]: 1

In [5]: next(y)
Out[5]: 2

In [6]: next(z)
Out[6]: 1

In [7]: type(x)
Out[7]: <class 'list'>

In [8]: type(y)
Out[8]: <class 'list_iterator'>

```

x是list是可迭代的，而y和z是迭代器的两个单独实例，从可迭代的x中产生值。从示例中可以看出，y和z都是可以保持状态的

当如下代码执行时

```python
In [1]: x = [1, 2, 3]

In [2]: for elem in x:
        ...

```

实际的内部是这样运行的

<img src="https://xionzhi.com/content/images/2022/03/iterable-vs-iterator.png" width="100%" alt="nvie.com/posts/iterators-vs-generators">

当反汇编这段Python代码时，可以看到对`GET_ITER`的显式调用，这本质上就像调用iter(x)。`FOR_ITER`是一条相当于重复调用`next()`以获取每个元素的指令，但这并没有从字节码指令中显示出来，这是因为它针对解释器的速度进行了优化。

```python
In [10]: import dis

In [11]: x = [1, 2, 3]

In [12]: dis.dis('for _ in x: pass')
  1           0 SETUP_LOOP              12 (to 14)
              2 LOAD_NAME                0 (x)
              4 GET_ITER
        >>    6 FOR_ITER                 4 (to 12)
              8 STORE_NAME               1 (_)
             10 JUMP_ABSOLUTE            6
        >>   12 POP_BLOCK
        >>   14 LOAD_CONST               0 (None)
             16 RETURN_VALUE

```


> ### 迭代器Iterators

那么什么是迭代器呢？它是一个有状态的辅助对象，当你调用 `next()` 时它会产生下一个值。因此，任何具有 `__next__()` 方法的对象都是迭代器。它如何产生价值无关紧要。

所以迭代器是一个值工厂。每次您向它询问`next()`值时，它都知道如何计算它，因为它拥有内部状态。

迭代器的例子不胜枚举。所有的`itertools`函数都返回迭代器。有些产生无限序列：

```python
In [13]: from itertools import count

In [14]: counter = count(start=13)

In [15]: next(counter)
Out[15]: 13

In [16]: next(counter)
Out[16]: 14

```

从有限序列产生无限序列：

```python
In [17]: from itertools import cycle

In [18]: colors = cycle(['red', 'white', 'blue'])

In [19]: next(colors)
Out[19]: 'red'

In [20]: next(colors)
Out[20]: 'white'

In [21]: next(colors)
Out[21]: 'blue'

In [22]: next(colors)
Out[22]: 'red'

```

从无限序列产生有限序列：

```python
In [23]: from itertools import islice

In [24]: colors = cycle(['red', 'white', 'blue'])

In [25]: limited = islice(colors, 0, 4)

In [26]: for x in limited:
    ...:     print(x)
    ...: 
red
white
blue
red

```

为了更好地了解迭代器的内部原理，让我们构建一个生成斐波那契数的迭代器：

```python
In [27]: class fib:
    ...:     def __init__(self):
    ...:         self.prev = 0
    ...:         self.curr = 1
    ...: 
    ...:     def __iter__(self):
    ...:         return self
    ...: 
    ...:     def __next__(self):
    ...:         value = self.curr
    ...:         self.curr += self.prev
    ...:         self.prev = value
    ...:         return value
    ...: 
In [28]: f = fib()

In [29]: list(islice(f, 0, 10))
Out[29]: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

```

这个类既是可迭代的（因为它有`__iter__()`方法），同时他也是迭代器（因为它具有`__next__()`方法）。

此迭代器中的状态保存在`prev`和`curr`类实例变量中，并用于对迭代器的后续调用。每次调用`next()`都会做两件事情：

- 为下一次 `next()` 调用修改其状态
- 为当前调用生成结果


从外面看，迭代器就像一个懒惰的工厂，它一直处于空闲状态，直到你向它请求一个值，也就是它开始工作并产生一个值，之后它又变成空闲状态。


> ### 生成器Generators

最后来到了生成器，生成器是我最喜欢的Python语言功能。生成器是一种特殊的迭代器————**优雅的那种**

生成器允许您编写迭代器，就像上面的 Fibonacci 序列迭代器示例一样，但采用优雅简洁的语法，避免使用 `__iter__()` 和 `__next__()` 方法编写类。

让我们明确一点： 

- 任何生成器也是一个迭代器（反之亦然！） 
- 任何生成器都是一个懒惰地产生值的工厂。 

这是相同的斐波那契序列工厂，但编写为生成器：

```python
In [30]: def fib():
    ...:     prev, curr = 0, 1
    ...:     while True:
    ...:         yield curr
    ...:         prev, curr = curr, prev + curr
    ...: 

In [31]: f = fib()

In [32]: list(islice(f, 0, 10))
Out[32]: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

```

**在这里出现了一个特殊的关键词 `yield`, 他到底做了啥？**

让我们分解这里发生的事情：

首先，请注意`fib`被定义为一个普通的Python函数`def`，并没什么特殊的。但是函数体内没有`return`关键字。该函数的返回值将是一个生成器（一个迭代器、一个工厂、一个有状态的辅助对象）

当 `f = fib()` 被调用时，生成器（工厂）被实例化并返回。此时不会执行任何代码，生成器最初以空闲状态启动。明确地说：`prev, curr = 0, 1` 尚未执行。

这个生成器实例被包裹在一个 `islice()` 中。这本身也是一个迭代器，所以最初是空闲的。这时候依然什么都没有发生。

这个迭代器被包装在一个 `list()` 中，它将使用它的所有参数并从中构建一个列表。它将开始在 `islice()` 实例上调用 `next()`，然后它又将在我们的 `f` 实例上开始调用 `next()`。

在第一次调用时，代码会执行一部分：`prev, curr = 0, 1` 被执行，进入 `while True` 循环，然后遇到 `yield curr` 语句时，它将会把当前 `curr` 的值记录下来并再次把生成器变为空闲状态。

返回的值被传递给 `islice()` 方法中，因为它还没有超过`10`个值，所以又将返回值添加到列表`list()`中。

然后，它向 `islice()` 请求下一个值，后者将向 `f` 请求下一个值，这会将 `f` 从其先前状态“取消暂停”，并使用语句 `prev, curr = curr, prev + curr` 恢复。然后它重新进入 `while` 循环的下一次迭代，并点击 `yield curr` 语句，返回 `curr` 的下一个值。

循环这个过程，直到列表有`10`个元素，并且当 `list()` 向 `islice()` 询问第 `11` 个值时，`islice()` 将引发 `StopIteration` 异常，表明元素已经获取完成，之后`list` 将返回结果：列表共 `10` 个元素，即前 `10` 个斐波那契数。

当生成器没有收到第`11`个`next()`调用并且没有再被别的地方引用，他将会等待被系统垃圾回收销毁。

> ### 生成器类型 Types of Generators

Python 中有两种类型的生成器：生成器函数和生成器表达式。生成器函数是在其主体中出现关键字yield 的任何函数。我们刚刚看到了一个例子。
关键字yield的出现足以让函数成为生成器函数。

另一种类型的生成器是列表推导式的生成器等价物。对于有限的用例，它的语法非常优雅。

假设您使用此语法构建正方形列表：

```python
In [1]: numbers = [1, 2, 3, 4, 5, 6]

In [2]: [x * x for x in numbers]
Out[2]: [1, 4, 9, 16, 25, 36]
```

你可以用集合理解做同样的事情：

```python
In [3]: {x * x for x in numbers}
Out[3]: {1, 4, 36, 9, 16, 25}

In [4]: {x: x * x for x in numbers}
Out[4]: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25, 6: 36}
```

但您也可以使用生成器表达式（注意：这不是元组推导式）：

```python
In [5]: lazy_squares = (x * x for x in numbers)

In [6]: lazy_squares
Out[6]: <generator object <genexpr> at 0x10d1f5510>

In [7]: next(lazy_squares)
Out[7]: 1

In [8]: list(lazy_squares)
Out[8]: [4, 9, 16, 25, 36]
```

因为使用 `next()` 从`lazy_squares` 中读取第一个值，它的状态现在位于第二项，所以当我们通过调用 `list()` 使用它迭代完成时，只会返回部分`numbers`值平方列表。这与上面的其他示例一样是生成器（也是一个迭代器）。

> ### 总结Summary

生成器是一种牛逼的强大编程结构，在使用更少的中间变量和数据结构编写流式代码。除此之外，它们的内存和 CPU 效率会更高，并且也只要及少量的代码。

开始使用生成器：在你的代码中找到类似这样的操作

```python
def something():
    result = []
    for ... in ...:
        result.append(x)
    return result
```

```python
def iter_something():
    for ... in ...:
        yield x

# def something():  # Only if you really need a list structure
#     return list(iter_something())

```


