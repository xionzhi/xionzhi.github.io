---
title: 'Python Redis BitMap储存用户签到'
author: xionzhi
date: '2023-01-05'
showAccessNumber: true
categories:
  - python
tags:
  - python
excerpt: "Redis提供的数据类型位图BitMap，每个bit位对应0和1两个状态。虽然内部还是采用String类型存储，但Redis提供了一些指令用于直接操作BitMap，可以把它看作一个bit数组，数组的下标就是偏移量。

它的优点是内存开销小，效率高且操作简单，很适合用于签到这类场景。缺点在于位计算和位表示数值的局限。如果要用位来做业务数据记录，就不要在意value的值。
"
---



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



### 关于签到实现

如果按年存储，Key的格式为 u:sign:{uid}:{yyyy}，value最大长度为46字节(368位)闰年天数为366天。

如果每月要重置连续签到次数，最简单的方式是按用户每月存一条签到数据。Key的格式为 u:sign:{uid}:{yyyyMM}，而Value则采用长度为4个字节的(32位)最大月份天数是31天。

BitMap的每一位代表一天的签到，1表示已签，0表示未签。

```tex
# 偏移量OFFSET是从0开始的 实际操作日期减1

# 设置2022年10月21日签到
SETBIT u:sign:1:202210 20 1

# 查询2022年10月21日是否签到
GETBIT u:sign:1:202210 20

# 统计10月的总签到次数
BITCOUNT u:sign:1:202210

# 获取10月的签到详情
BITFIELD u:sign:1:202210 GET u31 0
BITFIELD_RO u:sign:1:202210 GET u31 0

# 获取10月最早签到日期 未签到日期
BITPOS u:sign:1:202210 1
BITPOS u:sign:1:202210 0

```



### python代码实现

bit数据右移1位再左移1位可以得到什么？

```tex
# 二进制数据511
111111111

# 右移1位
011111111

# 再左移1位
111111110

# 右移再左移与原数据不同，可以得到最后一位数据是1，即已签到
```



未签到状态

```tex
# 二进制数据510
111111110

# 右移1位
011111111

# 再左移1位
111111110

# 右移再左移与原数据不同，可以得到最后一位数据是0，即已未签到
```



原地右移之后最后一位则是前一天的签到状态

```python
"""
redis bitmap 用户签到

Python 3.8.13
redis==4.3.4
redis_version:7.0.4
"""

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

    def check_sign(self, uid: int, date: datetime) -> int:
        """
        检查签到
        :return 当前的签到状态
        """
        offset: int = date.day - 1
        return self.redis_store.getbit(self._build_sign_key(uid, date), offset)

    def get_sign_count(self, uid: int, date: datetime) -> int:
        """
        签到次数
        :return 当前的签到次数
        """
        return self.redis_store.bitcount(self._build_sign_key(uid, date))

    def get_continuous_sign_count(self, uid: int, date: datetime) -> int:
        """
        BITFIELD 命令可以在一次调用中同时对多个位范围进行操作
        连续签到次数
        :return 当月连续签到次数
        """
        sign_count: int = 0

        bf = self.redis_store.bitfield(self._build_sign_key(uid, date))
        bf.get(f'u{date.day}', 0)  # 取1号到当天的签到状态
        result: t.List[int] = bf.execute()

        if not result:
            return sign_count

        v: int = result[0]
        for i in range(date.day):
            if lshift(rshift(v, 1), 1) == v:  # (v >> 1 << 1)
                if i > 0:  # 右移然后左移等于自己 即低位为0 且非当天说明连续签到中断
                    break
            else:
                sign_count += 1

            v = irshift(v, 1)  # v >>= 1  # 原地右移 往前查询

        return sign_count

    def get_first_sign_date(self, uid: int, date: datetime) -> t.Union[datetime, None]:
        """
        获取当月首次签到日期
        :return: 首次签到日期
        """
        pos: int = self.redis_store.bitpos(self._build_sign_key(uid, date), 1)
        return None if pos < 0 else date - timedelta(days=date.day - pos - 1)

    def get_sign_info_v2(self, uid: int, date: datetime) -> t.Dict:
        """
        获取当月签到情况, 多次IO速度慢逻辑简单
        :return: Key为签到日期，Value为签到状态的Map
        """
        sign_map: dict = {}
        for i in range(monthrange(date.year, date.month)[1]):
            i_date = date.replace(day=1) + timedelta(days=i)
            sign_map[i_date.strftime('%Y%m%d')] = self.check_sign(uid, i_date)

        return sign_map

    def get_sign_info(self, uid: int, date: datetime) -> t.Dict:
        """
        获取当月签到情况
        :return: Key为签到日期，Value为签到状态的Map
        """
        sign_map: dict = {}
        month_day: int = monthrange(date.year, date.month)[1]

        bf = self.redis_store.bitfield(self._build_sign_key(uid, date))
        bf.get(f'u{month_day}', 0)  # 取整月的签到状态
        result: t.List[int] = bf.execute()

        if not result:
            return sign_map

        v: int = result[0]
        for i in range(month_day, 0, -1):
            sign_map[(date + timedelta(i - date.day)).strftime('%Y%m%d')] = \
                lshift(rshift(v, 1), 1) != v
            v = irshift(v, 1)  # v >>= 1

        return sign_map


if __name__ == '__main__':
    us = UserSign()
    _uid = 1
    _date = datetime.now()

    # 签到 now 20
    # for i in range(2, 6):  # set 1 - 5
    #     r_date = _date.replace(day=i)
    #     print(r_date, us.do_sign(_uid, r_date))
    #
    # for i in range(14, _date.day + 1):  # set 5 - now
    #     r_date = _date.replace(day=i)
    #     print(r_date, us.do_sign(_uid, r_date))

    # 签到判断
    # print(us.check_sign(_uid, _date))

    # 当月总签到数
    # print(us.get_sign_count(_uid, _date))

    # 当月最早签到日期
    # print(us.get_first_sign_date(_uid, _date))

    # 当月连续签到次数
    # print(us.get_continuous_sign_count(_uid, _date))

    # 当月签到详情
    # print(us.get_sign_info(_uid, _date))

    # 当月签到详情v2
    # print(us.get_sign_info_v2(_uid, _date))

```



