<template>
  <div class="box">
    <div class="item item1" v-right-click:down="onDown" v-right-click:up="onUp"></div>
    <div class="item item2" v-right-click:contextmenu="onContextmenu"></div>
    <div class="item item3" v-right-click:contextmenu.prevent="onContextmenuPrevent"></div>
    <div class="item item4" v-right-click:down.prevent="onRightClickPrevent"></div>
    <div class="item item5" v-right-click:down="onDown">
      <div class="child" v-right-click:down.stop="onRightClickStop"></div>
    </div>
    <div class="item item6" v-right-click:down.capture="onDownCapture">
      <div class="child" v-right-click:down="onDownCaptureChild"></div>
    </div>
    <div class="item item7" v-right-click:up.capture="onUpCapture">
      <div class="child" v-right-click:up="onUpCaptureChild"></div>
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HvRightClickDirective as vRightClick } from '@havue/directives'

const emits = defineEmits<{
  (name: 'right-click-down'): void
  (name: 'right-click-up'): void
  (name: 'contextmenu'): void
  (name: 'contextmenu-prevent'): void
  (name: 'right-click-prevent'): void
  (name: 'right-click-stop'): void
  (name: 'right-click-down-capture'): void
  (name: 'right-click-down-capture-child'): void
  (name: 'right-click-up-capture'): void
  (name: 'right-click-up-capture-child'): void
}>()

const downCaptureEmitQuery = ref<string[]>([])
const upCaptureEmitQuery = ref<string[]>([])

function onDown() {
  emits('right-click-down')
}

function onUp() {
  emits('right-click-up')
}

function onContextmenu() {
  emits('contextmenu')
}

function onContextmenuPrevent() {
  emits('contextmenu-prevent')
}

function onRightClickPrevent() {
  emits('right-click-prevent')
}

function onRightClickStop() {
  emits('right-click-stop')
}

function onDownCapture() {
  downCaptureEmitQuery.value.push('right-click-down-capture')
}

function onDownCaptureChild() {
  downCaptureEmitQuery.value.push('right-click-down-capture-child')
}

function onUpCapture() {
  upCaptureEmitQuery.value.push('right-click-up-capture')
}

function onUpCaptureChild() {
  upCaptureEmitQuery.value.push('right-click-up-capture-child')
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  background-color: red;

  .item {
    box-sizing: border-box;
    height: 100px;
    background-color: green;
    border: 1px solid black;
  }
}
</style>
