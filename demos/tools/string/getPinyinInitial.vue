// #region template
<template>
  <div class="get-pinyin">
    <p>中文：<el-input v-model:model-value="inputValue"></el-input></p>
    <p>拼音首字母：{{ pinyin }}</p>
  </div>
</template>
// #endregion template
<!--  -->
// #region script
<script setup lang="ts">
import { ref, computed } from 'vue'
import { getPinyinInitial } from '@pedy/tools'

const inputValue = ref('')

const pinyin = computed(() => {
  return getPinyinInitial(inputValue.value)
})
</script>
// #endregion script
<!--  -->
// #region style
<style lang="scss" scoped>
.get-pinyin {
  padding: 15px;
  background-color: cadetblue;

  .el-input {
    width: 100px;
  }
}
</style>
// #endregion style
