# 监听鼠标右键点击

用于给组件添加监听鼠标右键事件。

* 期望的绑定值类型：`Function`
* 参数: `"up"` | `"down"` | `"contextmenu"`
* 修饰符: `"stop"` | `"prevent"` | `"capture"`
  * `.stop` - 调用 `event.stopPropagation()`
  * `.prevent` - 调用 `event.preventDefault()`
  * `.capture` - 在捕获模式添加事件监听器

## 整体安装

安装所有指令，请参考[指令安装](./index.md)

## 引入

```vue
<script>
import { HvRightClickDirective } from 'havue'
// or 
import { HvRightClickDirective } from '@havue/directives'
</script>
```

* 示例

```vue
<!-- 右键抬起事件 -->
<button v-right-click:up="doThis"></button>

<!-- 右键按下事件 -->
<button v-right-click:down="doThis"></button>

<!-- 右键菜单事件 -->
<button v-right-click:contextmenu="doThis"></button>

<!-- 阻止右键菜单 -->
<button v-right-click:contextmenu.prevent></button>

<!-- 监听右键按下，并阻止默认行为 -->
<button v-right-click:down.prevent="doThis"></button>

<!-- 监听右键按下，并阻止事件冒泡 -->
<button v-right-click:down.stop="doThis"></button>
```

<script setup>
import Demo from '@/directives/right-click/index.vue'
</script>

<Demo></Demo>

::: details 点我看代码
<<< ../../demos/directives/right-click/index.vue#code{vue:line-numbers}
:::
