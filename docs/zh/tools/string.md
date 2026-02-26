# 字符串相关

::: info
安装请参考[工具函数安装](/zh/tools/)。
:::

<script setup>
import StringSortFnDemo from '@/tools/string/stringSortFn.vue'
import GetPinyinInitialDemo from '@/tools/string/getPinyinInitial.vue'
import SubStrByByteLenDemo from '@/tools/string/subStrByByteLen.vue'
</script>

## 字符串排序 stringSortFn

适用于类似微信联系人的排序规则：

* 数字优先级最高，按从小到大排序
* 英文和汉字按 26 个字母顺序排序，同字母时英文优先于汉字
* 特殊符号优先级最低
* 示例顺序：`1abc` > `3abc` > `aabc` > `阿abc` > `babc` > `菜菜菜菜111` > `！2abc`

### 引入

```ts
import { stringSortFn } from 'havue'
// or
import { stringSortFn } from '@havue/tools'
```

### 函数签名

`stringSortFn(a: string, b: string, ignoreSpecialChar?: boolean): number`

| 参数名              | 说明                                   | 类型      | 默认值   |
| :------------------ | :------------------------------------- | :-------- | :------- |
| a                   | 待比较字符串一                         | `string`  | —        |
| b                   | 待比较字符串二                         | `string`  | —        |
| ignoreSpecialChar   | 是否忽略特殊字符后再比较（仅比较字母数字） | `boolean` | `false`  |

**返回值**：与 `Array.sort` 比较函数约定一致。负数表示 a 排在 b 前，正数表示 a 排在 b 后，0 表示相等。

### 示例

<StringSortFnDemo></StringSortFnDemo>

::: details 点我看代码
::: code-group
<<< ../../../demos/tools/string/stringSortFn.vue#template{vue:line-numbers} [template]
<<< ../../../demos/tools/string/stringSortFn.vue#script{4,11-14vue:line-numbers} [script]
<<< ../../../demos/tools/string/stringSortFn.vue#style{vue:line-numbers} [style]
:::

## 获取中文字符拼音首字母 getPinyinInitial

传入中文字符，返回其拼音首字母（大写 A–Z）。非中文或空字符串时返回原字符串。

### 引入

```ts
import { getPinyinInitial } from 'havue'
// or
import { getPinyinInitial } from '@havue/tools'
```

### 函数签名

`getPinyinInitial(str: string): string`

| 参数名 | 说明       | 类型     | 默认值 |
| :----- | :--------- | :------- | :----- |
| str   | 中文字符串 | `string` | —      |

**返回值**：拼音首字母大写，或非中文时原样返回。

### 示例

<GetPinyinInitialDemo></GetPinyinInitialDemo>

::: details 点我看代码
::: code-group
<<< ../../../demos/tools/string/getPinyinInitial.vue#template{vue:line-numbers} [template]
<<< ../../../demos/tools/string/getPinyinInitial.vue#script{3,7-9vue:line-numbers} [script]
<<< ../../../demos/tools/string/getPinyinInitial.vue#style{vue:line-numbers} [style]
:::

## 按字节长度裁剪字符串 subStrByByteLen

按 UTF-8 字节长度截取字符串，不超过指定字节数。常用于按字节限制输入或展示长度。

### 引入

```ts
import { subStrByByteLen } from 'havue'
// or
import { subStrByByteLen } from '@havue/tools'
```

### 函数签名

`subStrByByteLen(str: string, byteLen: number): string`

| 参数名   | 说明               | 类型     | 默认值 |
| :------- | :----------------- | :------- | :----- |
| str      | 原始字符串         | `string` | —      |
| byteLen  | 最大字节长度（UTF-8） | `number` | —      |

**返回值**：截取后不超过 `byteLen` 字节的字符串。

### 示例

<SubStrByByteLenDemo></SubStrByByteLenDemo>

::: details 点我看代码
::: code-group
<<< ../../../demos/tools/string/subStrByByteLen.vue#template{vue:line-numbers} [template]
<<< ../../../demos/tools/string/subStrByByteLen.vue#script{3,8-10vue:line-numbers} [script]
<<< ../../../demos/tools/string/subStrByByteLen.vue#style{vue:line-numbers} [style]
:::
