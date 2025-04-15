<template>
  <div class="dnd-demo">
    <HvDraggable class="drag1" type="test1" immediate="all" data="data1"></HvDraggable>
    <HvDraggable class="drag2" type="test2" immediate="all" data="data2"></HvDraggable>
    <HvDroppable class="drop" acceptDragType="test1" immediate="all"></HvDroppable>
  </div>
</template>
<script setup lang="ts">
// import type { DragAndDropPoint, DragAndDropDragType } from '@havue/drag-and-drop'
// import { computed, ref, reactive } from 'vue'
import { HvDraggable, HvDroppable } from '@havue/drag-and-drop'
</script>
<style lang="scss" scoped>
.dnd-demo {
  position: relative;

  .drag1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    background-color: red;
  }

  .drag2 {
    position: absolute;
    top: 100px;
    left: 0;
    width: 100px;
    height: 100px;
    background-color: green;
  }

  .drop {
    position: absolute;
    top: 0;
    left: 100px;
    width: 500px;
    height: 400px;
    background-color: gray;
  }
}
</style>
