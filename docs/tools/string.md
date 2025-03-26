# 字符串相关

::: info
安装请参考[工具函数安装](/tools/)。
:::

<script setup>
import StringSortFnDemo from '@/tools/string/stringSortFn.vue'
import GetPinyinInitialDemo from '@/tools/string/getPinyinInitial.vue'
import SubStrByByteLenDemo from '@/tools/string/subStrByByteLen.vue'
</script>

## 字符串排序

类型微信联系人排序

* 数字优先级最高，按照从小到大排序
* 英文和汉字按照26个字母顺序排序，同字母顺序，英文优先级比汉字高
* 特殊符号优先级最低
*
* 例子：1abc>3abc>aabc>阿abc>babc>菜菜菜菜111>！2abc

### 引入

```ts
import { stringSortFn  } from 'pedy'
// or
import { stringSortFn  } from '@pedy/tools'
```

示例：

<StringSortFnDemo></StringSortFnDemo>

::: details 点我看代码
::: code-group
<<< ../../demos/tools/string/stringSortFn.vue#template{vue:line-numbers} [template]
<<< ../../demos/tools/string/stringSortFn.vue#script{4,11-14vue:line-numbers} [script]
<<< ../../demos/tools/string/stringSortFn.vue#style{vue:line-numbers} [style]
:::

## 获取中文字符拼音首字母

传入中文字符，返回其拼音首字母

### 引入

```ts
import { getPinyinInitial  } from 'pedy'
// or
import { getPinyinInitial  } from '@pedy/tools'
```

示例：

<GetPinyinInitialDemo></GetPinyinInitialDemo>

::: details 点我看代码
::: code-group
<<< ../../demos/tools/string/getPinyinInitial.vue#template{vue:line-numbers} [template]
<<< ../../demos/tools/string/getPinyinInitial.vue#script{3,7-9vue:line-numbers} [script]
<<< ../../demos/tools/string/getPinyinInitial.vue#style{vue:line-numbers} [style]
:::

## 按byte长度裁剪字符串

一个中文占2个byte长度，有时需要根据byte长度裁剪字符，此方法提供这个功能。

### 引入

```ts
import { subStrByByteLen  } from 'pedy'
// or
import { subStrByByteLen  } from '@pedy/tools'
```

示例：

<SubStrByByteLenDemo></SubStrByByteLenDemo>

::: details 点我看代码
::: code-group
<<< ../../demos/tools/string/subStrByByteLen.vue#template{vue:line-numbers} [template]
<<< ../../demos/tools/string/subStrByByteLen.vue#script{3,8-10vue:line-numbers} [script]
<<< ../../demos/tools/string/subStrByByteLen.vue#style{vue:line-numbers} [style]
:::
