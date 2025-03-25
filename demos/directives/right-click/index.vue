// #region code
<template>
  <div class="box" v-right-click:contextmenu.prevent>阻止右键菜单</div>
</template>

<script setup lang="ts">
import { PdRightClickDirective as vRightClick } from '@pedy/directives'
</script>

<style lang="scss" scoped>
.box {
  width: 200px;
  height: 100px;
  color: black;
  text-align: center;
  background-color: aquamarine;
}
</style>
// #endregion code
