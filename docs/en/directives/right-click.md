# Listen for Right Mouse Click

Used to add right mouse click event listeners to components.

* Expected binding value type: `Function`
* Arguments: `"up"` | `"down"` | `"contextmenu"`
* Modifiers: `"stop"` | `"prevent"` | `"capture"`
  * `.stop` - Calls `event.stopPropagation()`
  * `.prevent` - Calls `event.preventDefault()`
  * `.capture` - Adds event listener in capture mode

## Global Installation

To install all directives, refer to [Directives Installation](./index.md).

## Import

```vue
<script>
import { HvRightClickDirective } from 'havue'
// or 
import { HvRightClickDirective } from '@havue/directives'
</script>
```

* Examples

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
<<< ../../../demos/directives/right-click/index.vue#code{vue:line-numbers}
:::
