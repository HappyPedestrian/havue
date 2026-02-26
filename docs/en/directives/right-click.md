# Listen for Right Mouse Click

Used to add right mouse click event listeners to components.

## Installation

To install all directives, refer to [Directives Installation](./index.md).

## Import and Registration

```vue
<script>
import { HvRightClickDirective } from 'havue'
// or
import { HvRightClickDirective } from '@havue/directives'
</script>
```

**Registration**:

- **Full havue**: Using `app.use(havue)` auto-registers the directive; use `v-right-click` directly.
- **@havue/directives only**: Register manually: `app.directive('right-click', HvRightClickDirective)`.

## Directive Arguments

| Argument | Description |
| :------- | :---------- |
| `up` | Fired when right mouse button is released |
| `down` | Fired when right mouse button is pressed |
| `contextmenu` | Fired when the browser context menu event fires |

## Modifiers

| Modifier | Description |
| :------- | :---------- |
| `.stop` | Calls `event.stopPropagation()` |
| `.prevent` | Calls `event.preventDefault()` (e.g. prevent context menu) |
| `.capture` | Add listener in capture phase |

## Binding Value

Expected type: `Function`, callback receives `(e?: MouseEvent)`.

## Examples

```vue
<!-- Right button release event -->
<button v-right-click:up="doThis"></button>

<!-- Right button press event -->
<button v-right-click:down="doThis"></button>

<!-- Context menu event -->
<button v-right-click:contextmenu="doThis"></button>

<!-- Prevent context menu -->
<button v-right-click:contextmenu.prevent></button>

<!-- Listen for right button press and prevent default behavior -->
<button v-right-click:down.prevent="doThis"></button>

<!-- Listen for right button press and stop event propagation -->
<button v-right-click:down.stop="doThis"></button>
```

<script setup>
import Demo from '@/directives/right-click/index.vue'
</script>

<Demo></Demo>

::: details Click to view code
<<< ../../../demos/directives/right-click/index.vue{vue:line-numbers}
:::
