---
title: 一个测试页面VitePress
author: xionzhi
date: '2022-12-16'
showAccessNumber: true
categories:
  - 测试
tags:
  - 标签1
  - 标签2
  - 标签3
---

[[toc]]

[vitepress.vuejs.org/guide/markdown](https://vitepress.vuejs.org/guide/markdown)

### 小标题1-表单

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

### 小标题2-Emoji

:tada: :100:

[list of all emojis](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json)

### 小标题3-Containers

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

::: danger STOP
Danger zone, do not proceed
:::


### 小标题4-Containers
### 小标题5
### 小标题6
### 小标题7

Redis提供的数据类型位图BitMap，每个bit位对应0和1两个状态。虽然内部还是采用String类型存储，但Redis提供了一些指令用于直接操作BitMap，可以把它看作一个bit数组，数组的下标就是偏移量。

它的优点是内存开销小，效率高且操作简单，很适合用于签到这类场景。缺点在于位计算和位表示数值的局限。如果要用位来做业务数据记录，就不要在意value的值。


### bitmap指令说明

1. BITCOUNT

   计算给定字符串中，被设置为 1 的比特位的数量

2. BITFIELD

   在一次调用中同时对多个位范围进行操作

3. BITFIELD_RO

   BITFIELD的只读版本，redis>=6.0

4. BITOP

   对一个或多个保存二进制位的字符串 key 进行位元操作

5. BITPOS

   返回位图中第一个值为 bit 的二进制位的位置

6. GETBIT

   对 key 所储存的字符串值，获取指定偏移量上的位(bit)

7. SETBIT 

   对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)


原地右移之后最后一位则是前一天的签到状态

```python
import typing as t
from calendar import monthrange
from datetime import datetime, timedelta
from operator import rshift, lshift, irshift

from redis import Redis


class UserSign:
    def __init__(self, host=None, port=None, db=None, decode_responses=None):
        """
        now: 2022-10-20
        bitmap.len: 0 * 20
        set 2-4 14-20
        bitmap.info: 01111000000001111111 -> int10(491647)
        """
        self.host = host or 'localhost'
        self.port = port or 6379
        self.db = db or 0
        self.decode_responses = decode_responses or True
        self.redis_store = Redis(host=self.host,
                                 port=self.port,
                                 db=self.db,
                                 decode_responses=self.decode_responses)

    @staticmethod
    def _build_sign_key(uid: int, date: datetime) -> str:
        return f'u:sign:{uid}:{date.strftime("%Y%m")}'

    def do_sign(self, uid: int, date: datetime) -> int:
        """
        用户签到
        :return 之前的签到状态
        """
        offset: int = date.day - 1
        return self.redis_store.setbit(self._build_sign_key(uid, date), offset, 1)


if __name__ == '__main__':
    us = UserSign()
    _uid = 1
    _date = datetime.now()

```
