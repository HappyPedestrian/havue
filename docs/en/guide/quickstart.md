# Quick Start

This section will explain how to integrate havue into your project.

## Usage

If you installed the complete bundle and aren't concerned about the final package size, you can use it this way:

```ts
import { createApp } from 'vue'
import Havue from 'havue'
import App from './App.vue'

const app = createApp(App)

app.use(Havue)
app.mount('#app')
```

After implementing the above code, you can directly use all components and directives in your project.

## Manual Import

For partial usage without global registration:

```vue
<template>
  <pd-color-picker></pd-color-picker>
</template>

<script>
import { PdColorPicker } from 'havue'
export default {
  components: { PdColorPicker },
}
</script>
```
