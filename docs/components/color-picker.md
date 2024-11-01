# 颜色选择器

<script setup>
import { ref } from 'vue'
import ColorPicker from '@/components/ColorPicker/ColorPicker.vue'

const color = ref('#ffffff')
</script>

## 示例

```vue
<template>
  <div>颜色：<input type="color" v-model="color" /></div>
  <ColorPicker v-model="color"></ColorPicker>
</template>

<script setup>
import { ref } from 'vue'
import ColorPicker from '@/components/ColorPicker/ColorPicker.vue'

const color = ref('#ffffff')
</script>
```

<div>颜色：<input type="color" v-model="color" /></div>
<ColorPicker v-model="color"></ColorPicker>
