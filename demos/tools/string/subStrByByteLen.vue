// #region template
<template>
  <div class="sub-str">
    <p>字符串：<el-input v-model="str"></el-input></p>
    <p>裁剪byte长度：<el-input-number v-model="subByteLen"></el-input-number></p>
    <p>结果：{{ result }}</p>
  </div>
</template>
// #endregion template
<!--  -->
// #region script
<script setup lang="ts">
import { computed, ref } from 'vue'
import { subStrByByteLen } from '@pedy/tools'

const str = ref('')
const subByteLen = ref(0)

const result = computed(() => {
  return subStrByByteLen(str.value, subByteLen.value)
})
</script>
// #endregion script
<!--  -->
// #region style
<style lang="scss" scoped>
.sub-str {
  padding: 15px;
  background-color: cadetblue;

  .el-input {
    width: 300px;
  }
}
</style>
// #endregion style
