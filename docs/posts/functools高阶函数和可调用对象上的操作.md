---
title: 'functools高阶函数和可调用对象上的操作'
author: xionzhi
date: '2023-01-05'
showAccessNumber: true
categories:
  - python
tags:
  - python
excerpt: "一个为函数提供缓存功能的装饰器，缓存 *maxsize* 组传入参数，在下次以相同参数调用时直接返回上一次的结果。用以节约高开销或I/O函数的调用时间。

```python
@lru_cache
def test_lru_cache(self, a=None, b=None):
  time.sleep(1)
  return f'{a}: {b}: {time.time()}'

print(tf.test_lru_cache(a=1, b=2))
print(tf.test_lru_cache(a=1, b=2))
print(tf.test_lru_cache(a=1, b=2))
print(tf.test_lru_cache(a=1, b=2))

# 1: 2: 1663580739.8764858
# 1: 2: 1663580739.8764858
# 1: 2: 1663580739.8764858
# 1: 2: 1663580739.8764858
```
"
---




**lru_cache**

一个为函数提供缓存功能的装饰器，缓存 *maxsize* 组传入参数，在下次以相同参数调用时直接返回上一次的结果。用以节约高开销或I/O函数的调用时间。

```python
@lru_cache
def test_lru_cache(self, a=None, b=None):
  time.sleep(1)
  return f'{a}: {b}: {time.time()}'

print(tf.test_lru_cache(a=1, b=2))
print(tf.test_lru_cache(a=1, b=2))
print(tf.test_lru_cache(a=1, b=2))
print(tf.test_lru_cache(a=1, b=2))

# 1: 2: 1663580739.8764858
# 1: 2: 1663580739.8764858
# 1: 2: 1663580739.8764858
# 1: 2: 1663580739.8764858
```

[LRU(最久未使用算法)缓存](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) 在最近的调用是即将到来的调用的最佳预测值时性能最好（例如，新闻服务器上最热门文章倾向于每天更改）。 缓存的大小限制可确保缓存不会在长期运行进程如网站服务器上无限制地增长。

由于使用了字典存储缓存，所以该函数的固定参数和关键字参数必须是可哈希的。

```python
print(tf.test_lru_cache(a=[1], b=[2]))

# TypeError: unhashable type: 'list'
```

不同模式的参数可能被视为不同从而产生多个缓存项，例如, f(a=1, b=2) 和 f(b=2, a=1) 因其参数顺序不同，可能会被缓存两次。

```python
print(tf.test_lru_cache(a=1, b=2))
print(tf.test_lru_cache(b=2, a=1))

# 1: 2: 1663580928.2219331
# 1: 2: 1663580929.226149
```

如果指定了 *user_function*，它必须是一个可调用对象。 这允许 *lru_cache* 装饰器被直接应用于一个用户自定义函数，让 *maxsize* 保持其默认值 128:

```python
@lru_cache
def count_vowels(sentence):
    return sum(sentence.count(vowel) for vowel in 'AEIOUaeiou')
```

如果 *maxsize* 设为 `None`，LRU 特性将被禁用且缓存可无限增长。



**cache**

> 需要python3.9及以上版本

简单轻量级未绑定函数缓存。 有时称为 ["memoize"](https://en.wikipedia.org/wiki/Memoization)。返回值与 `lru_cache(maxsize=None)` 相同，创建一个查找函数参数的字典的简单包装器。 因为它不需要移出旧值，所以比带有大小限制的`lru_cache`更小更快。

```python
@cache
def factorial(n):
    return n * factorial(n-1) if n else 1
  
factorial(10)  # 因为没有缓存，进行了11次递归
factorial(5)  # 直接从缓存中获得结果
factorial(12)  # 只需要递归2次，其他10次从缓存获取
```

当然这个`cache`是线程安全的，可以在多线程中使用



**reduce**

将两个参数的 *function* 从左至右积累地应用到 *iterable* 的条目，以便将该可迭代对象缩减为单一的值。 例如，`reduce(lambda x, y: x+y, [1, 2, 3, 4, 5])` 是计算 `((((1+2)+3)+4)+5)` 的值。 左边的参数 *x* 是积累值而右边的参数 *y* 则是来自 *iterable* 的更新值。 如果存在可选项 *initializer*，它会被放在参与计算的可迭代对象的条目之前，并在可迭代对象为空时作为默认值。 如果没有给出 *initializer* 并且 *iterable* 仅包含一个条目，则将返回第一项。

```python
from functools import reduce
from sqlalchemy import or_

from service import db
from service.models import UsersModel

clauses = [UsersModel.user_name == 'AAA',
           UsersModel.email == 'AAA@haha.com',
           UsersModel.phone_number == '123456']

# 用户名或邮箱地址或者手机号寻找用户
query = db.session.query(UsersModel.id). \
    filter(UsersModel.status == 1, 
           reduce(or_, clauses))

"""
SELECT users.id AS users_id
FROM users
WHERE users.`status` = 1
AND (
  users.user_name = 'AAA' 
  OR users.email = 'AAA@haha.com' 
  OR users.phone_number = '123456'
)
"""
```

**wraps**

这是一个便捷函数，用于在定义包装器函数时发起调用 [`update_wrapper()`](https://docs.python.org/zh-cn/3/library/functools.html#functools.update_wrapper) 作为函数装饰器。 它等价于 `partial(update_wrapper, wrapped=wrapped, assigned=assigned, updated=updated)`。 例如:

```python
from functools import wraps
def my_decorator(f):
    @wraps(f)
    def wrapper(*args, **kwds):
        print('Calling decorated function')
        return f(*args, **kwds)
    return wrapper

@my_decorator
def example():
    """Docstring"""
    print('Called example function')

example()
# Calling decorated function
# Called example function

example.__name__  # example
example.__doc__  # Docstring
```

如果不使用这个装饰器工厂函数，则 example 函数的名称将变为 `'wrapper'`，并且 `example()` 原本的文档字符串将会丢失。

**partial**

返回一个新的 [部分对象](https://docs.python.org/zh-cn/3/library/functools.html#partial-objects)，当被调用时其行为类似于 *func* 附带位置参数 *args* 和关键字参数 *keywords* 被调用。 如果为调用提供了更多的参数，它们会被附加到 *args*。 如果提供了额外的关键字参数，它们会扩展并重载 *keywords*。 大致等价于:

```python
def partial(func, /, *args, **keywords):
    def newfunc(*fargs, **fkeywords):
        newkeywords = {**keywords, **fkeywords}
        return func(*args, *fargs, **newkeywords)
    newfunc.func = func
    newfunc.args = args
    newfunc.keywords = keywords
    return newfunc
```

[`partial()`](https://docs.python.org/zh-cn/3/library/functools.html#functools.partial) 会被“冻结了”一部分函数参数和/或关键字的部分函数应用所使用，从而得到一个具有简化签名的新对象。 例如，[`partial()`](https://docs.python.org/zh-cn/3/library/functools.html#functools.partial) 可用来创建一个行为类似于 [`int()`](https://docs.python.org/zh-cn/3/library/functions.html#int) 函数的可调用对象，其中 *base* 参数默认为二：

```
from functools import partial
basetwo = partial(int, base=2)
basetwo('11')  # 3

# 等价于如下，区别就在于base=2被提前固定了
int('11', base=2)

# 另一个例子
def say_hello(greet, your_name):
    print(greet, your_name)

hello_greet = partial(say_hello, 'Hello')  # greet = 'Hello'
hello_greet('xionzhi')  # Hello xionzhi

hi_greet = partial(say_hello, 'Hi')
hi_greet('xionzhi')  # Hi xionzhi
```



参考：<br>

[[docs.python.org] functools --- 高阶函数和可调用对象上的操作](https://docs.python.org/zh-cn/3/library/functools.html)

[[python3-cookbook] 7.8 减少可调用对象的参数个数](https://python3-cookbook.readthedocs.io/zh_CN/latest/c07/p08_make_callable_with_fewer_arguments.html)

