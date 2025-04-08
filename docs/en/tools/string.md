# String Related

::: info
For installation, please refer to [Tool Functions Installation](/en/tools/).
:::

<script setup>
import StringSortFnDemo from '@/tools/string/stringSortFn.vue'
import GetPinyinInitialDemo from '@/tools/string/getPinyinInitial.vue'
import SubStrByByteLenDemo from '@/tools/string/subStrByByteLen.vue'
</script>

## String Sorting

WeChat contact-like sorting rules:

* Numbers have highest priority, sorted in ascending order
* English and Chinese characters sorted alphabetically, with English having higher priority than Chinese when same initial exists
* Special symbols have lowest priority
*
* Example: 1abc > 3abc > aabc > 阿abc > babc > 菜菜菜菜111 > !2abc

### Import

```ts
import { stringSortFn } from 'havue'
// or
import { stringSortFn } from '@havue/tools'
```

Examples

<StringSortFnDemo></StringSortFnDemo>

::: details Click to view code
::: code-group
<<< ../../../demos/tools/string/stringSortFn.vue#template{vue:line-numbers} [template]
<<< ../../../demos/tools/string/stringSortFn.vue#script{4,11-14vue:line-numbers} [script]
<<< ../../../demos/tools/string/stringSortFn.vue#style{vue:line-numbers} [style]
:::

## Get Chinese Character Pinyin Initial

Returns the pinyin initial of Chinese characters.

### Import

```ts
import { getPinyinInitial  } from 'havue'
// or
import { getPinyinInitial  } from '@havue/tools'
```

Examples

<GetPinyinInitialDemo></GetPinyinInitialDemo>

::: details Click to view code点我看代码
::: code-group
<<< ../../../demos/tools/string/getPinyinInitial.vue#template{vue:line-numbers} [template]
<<< ../../../demos/tools/string/getPinyinInitial.vue#script{3,7-9vue:line-numbers} [script]
<<< ../../../demos/tools/string/getPinyinInitial.vue#style{vue:line-numbers} [style]
:::

## Substring by Byte Length

Chinese characters occupy 2 bytes. This method provides byte-length based string truncation.

### Import

```ts
import { subStrByByteLen  } from 'havue'
// or
import { subStrByByteLen  } from '@havue/tools'
```

Examples

<SubStrByByteLenDemo></SubStrByByteLenDemo>

::: details Click to view code
::: code-group
<<< ../../../demos/tools/string/subStrByByteLen.vue#template{vue:line-numbers} [template]
<<< ../../../demos/tools/string/subStrByByteLen.vue#script{3,8-10vue:line-numbers} [script]
<<< ../../../demos/tools/string/subStrByByteLen.vue#style{vue:line-numbers} [style]
:::
