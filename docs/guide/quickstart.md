# 快速开始

本节将介绍如何在项目中使用 havue。

## 用法

如果安装的是全量包，对打包后的大小不是很在乎，可通过以下方式使用：

```ts
import { createApp } from 'vue'
import Havue from 'havue'
import App from './App.vue'

const app = createApp(App)

app.use(Havue)
app.mount('#app')
```

完成以上代码后，可以在项目中直接使用所有组件以及指令。

## 手动导入

如果不想全局注册，单独使用：

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
