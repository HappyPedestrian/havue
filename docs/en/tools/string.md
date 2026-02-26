# String Related

::: info
For installation, please refer to [Tool Functions Installation](/en/tools/).
:::

<script setup>
import StringSortFnDemo from '@/tools/string/stringSortFn.vue'
import GetPinyinInitialDemo from '@/tools/string/getPinyinInitial.vue'
import SubStrByByteLenDemo from '@/tools/string/subStrByByteLen.vue'
</script>

## String sorting stringSortFn

WeChat contact-like sorting rules:

* Numbers have highest priority, sorted in ascending order
* English and Chinese sorted by 26-letter order; English before Chinese for same initial
* Special symbols have lowest priority
* Example order: `1abc` > `3abc` > `aabc` > 阿abc > `babc` > 菜菜菜菜111 > `!2abc`

### Import

```ts
import { stringSortFn } from 'havue'
// or
import { stringSortFn } from '@havue/tools'
```

### Signature

`stringSortFn(a: string, b: string, ignoreSpecialChar?: boolean): number`

| Parameter            | Description                                                | Type      | Default  |
| :------------------- | :--------------------------------------------------------- | :-------- | :------- |
| a                    | First string                                               | `string`  | —        |
| b                    | Second string                                              | `string`  | —        |
| ignoreSpecialChar    | Ignore non-alphanumeric when comparing                    | `boolean` | `false`  |

**Returns**: Same as `Array.sort` comparator (negative / zero / positive).

### Examples

<StringSortFnDemo></StringSortFnDemo>

::: details Click to view code
::: code-group
<<< ../../../demos/tools/string/stringSortFn.vue#template{vue:line-numbers} [template]
<<< ../../../demos/tools/string/stringSortFn.vue#script{4,11-14vue:line-numbers} [script]
<<< ../../../demos/tools/string/stringSortFn.vue#style{vue:line-numbers} [style]
:::

## Get Chinese pinyin initial getPinyinInitial

Returns the pinyin initial (uppercase A–Z) for Chinese characters. Returns the original string for non-Chinese or empty input.

### Import

```ts
import { getPinyinInitial } from 'havue'
// or
import { getPinyinInitial } from '@havue/tools'
```

### Signature

`getPinyinInitial(str: string): string`

| Parameter | Description   | Type     | Default |
| :-------- | :------------ | :------- | :------ |
| str       | Chinese string | `string` | —       |

**Returns**: Uppercase initial letter, or original string if not Chinese.

### Examples

<GetPinyinInitialDemo></GetPinyinInitialDemo>

::: details Click to view code
::: code-group
<<< ../../../demos/tools/string/getPinyinInitial.vue#template{vue:line-numbers} [template]
<<< ../../../demos/tools/string/getPinyinInitial.vue#script{3,7-9vue:line-numbers} [script]
<<< ../../../demos/tools/string/getPinyinInitial.vue#style{vue:line-numbers} [style]
:::

## Substring by byte length subStrByByteLen

Truncates a string to at most the given UTF-8 byte length. Useful for byte-limited input or display.

### Import

```ts
import { subStrByByteLen } from 'havue'
// or
import { subStrByByteLen } from '@havue/tools'
```

### Signature

`subStrByByteLen(str: string, byteLen: number): string`

| Parameter  | Description              | Type     | Default |
| :--------- | :----------------------- | :------- | :------ |
| str        | Original string          | `string` | —       |
| byteLen    | Max byte length (UTF-8)  | `number` | —       |

**Returns**: Substring not exceeding `byteLen` bytes.

### Examples

<SubStrByByteLenDemo></SubStrByByteLenDemo>

::: details Click to view code
::: code-group
<<< ../../../demos/tools/string/subStrByByteLen.vue#template{vue:line-numbers} [template]
<<< ../../../demos/tools/string/subStrByByteLen.vue#script{3,8-10vue:line-numbers} [script]
<<< ../../../demos/tools/string/subStrByByteLen.vue#style{vue:line-numbers} [style]
:::
