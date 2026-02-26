# 监听鼠标右键点击

用于给组件添加监听鼠标右键事件。

## 安装

安装所有指令，请参考[指令安装](./index.md)。

## 引入与注册

```vue
<script>
import { HvRightClickDirective } from 'havue'
// or
import { HvRightClickDirective } from '@havue/directives'
</script>
```

**注册方式**：

- **全量安装 havue**：通过 `app.use(havue)` 会自动注册指令，可直接使用 `v-right-click`。
- **仅安装 @havue/directives**：需手动注册：`app.directive('right-click', HvRightClickDirective)`。

## 指令参数

| 参数值 | 说明 |
| :----- | :--- |
| `up` | 右键松开时触发 |
| `down` | 右键按下时触发 |
| `contextmenu` | 浏览器右键菜单事件触发时触发 |

## 修饰符

| 修饰符 | 说明 |
| :----- | :--- |
| `.stop` | 调用 `event.stopPropagation()`，阻止冒泡 |
| `.prevent` | 调用 `event.preventDefault()`，阻止默认行为（如右键菜单） |
| `.capture` | 在捕获阶段添加事件监听器 |

## 绑定值

期望的绑定值类型：`Function`，回调参数为 `(e?: MouseEvent)`。

## 使用示例

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
<<< ../../../demos/directives/right-click/index.vue{vue:line-numbers}
:::
