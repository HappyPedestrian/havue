// #region template
<template>
  <div class="sub-str">
    <p>string：<el-input v-model="str"></el-input></p>
    <p>byte length：<el-input-number v-model="subByteLen"></el-input-number></p>
    <p>result：{{ result }}</p>
  </div>
</template>
// #endregion template
<!--  -->
// #region script
<script setup lang="ts">
import { computed, ref } from 'vue'
import { subStrByByteLen } from '@havue/tools'

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
