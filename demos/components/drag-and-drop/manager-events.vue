// #region template
<template>
  <div class="dnd-manager-demo">
    <div class="left-box">
      <p>Drag the block and observe global events on the right.</p>
      <Draggable :type="'box'" :data="{ width: 120, height: 60 }">
        <div class="drag-source">Drag me</div>
      </Draggable>

      <Droppable accept-drag-type="box">
        <div class="drop-area">Drop area</div>
      </Droppable>
    </div>

    <div class="right-box">
      <p>DnDManagerInstance events:</p>
      <p class="status">
        <span>Status: {{ status }}</span>
        <button class="clear-btn" type="button" @click="clearLogs">Clear logs</button>
      </p>
      <ul class="log-list">
        <li v-for="(item, index) in logs" :key="index">
          {{ item }}
        </li>
      </ul>
      <p v-if="lastPoint">Last point: ({{ lastPoint.x }}, {{ lastPoint.y }})</p>
    </div>
  </div>
</template>
// #endregion template
<!--  -->
// #region script
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { DragAndDropPoint, DnDManagerEvents } from '@havue/drag-and-drop'
import { DnDManagerInstance } from '@havue/drag-and-drop'
import { HvDraggable as Draggable, HvDroppable as Droppable } from '@havue/components'

const status = ref('idle')
const lastPoint = ref<DragAndDropPoint | null>(null)
const logs = ref<string[]>([])

const addLog = (text: string) => {
  logs.value.unshift(text)
}

const clearLogs = () => {
  logs.value = []
  status.value = 'idle'
  lastPoint.value = null
}

const handleDown: DnDManagerEvents['down'] = (point) => {
  status.value = 'down'
  lastPoint.value = point
  addLog(`down: (${point.x}, ${point.y})`)
}

const handleFirstMove: DnDManagerEvents['first-move'] = (point) => {
  status.value = 'first-move'
  lastPoint.value = point
  addLog(`first-move: (${point.x}, ${point.y})`)
}

const handleStart: DnDManagerEvents['start'] = (point) => {
  status.value = 'start'
  lastPoint.value = point
  addLog(`start: (${point.x}, ${point.y})`)
}

const handleMove: DnDManagerEvents['move'] = ({ type, point }) => {
  status.value = `move (${String(type)})`
  lastPoint.value = point
  addLog(`move: type=${String(type)}, point=(${point.x}, ${point.y})`)
}

const handleEnd: DnDManagerEvents['end'] = ({ type, point }) => {
  status.value = `end (${String(type)})`
  lastPoint.value = point
  addLog(`end: type=${String(type)}, point=(${point.x}, ${point.y})`)
}

onMounted(() => {
  DnDManagerInstance.on('down', handleDown)
  DnDManagerInstance.on('first-move', handleFirstMove)
  DnDManagerInstance.on('start', handleStart)
  DnDManagerInstance.on('move', handleMove)
  DnDManagerInstance.on('end', handleEnd)
})

onBeforeUnmount(() => {
  DnDManagerInstance.off('down', handleDown)
  DnDManagerInstance.off('first-move', handleFirstMove)
  DnDManagerInstance.off('start', handleStart)
  DnDManagerInstance.off('move', handleMove)
  DnDManagerInstance.off('end', handleEnd)
})
</script>
// #endregion script
<!--  -->
// #region style
<style scoped lang="scss">
.dnd-manager-demo {
  display: flex;
  gap: 16px;
  padding: 12px;
  background-color: rgb(20 177 177 / 20%);

  .left-box {
    flex: 1;

    .drag-source {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 60px;
      margin-bottom: 16px;
      color: #fff;
      user-select: none;
      background-color: #333;
    }

    .drop-area {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 260px;
      height: 160px;
      color: #fff;
      background-color: rgb(11 104 28);
    }
  }

  .right-box {
    flex: 1;

    .status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin: 8px 0;
      font-weight: 600;
    }

    .clear-btn {
      padding: 2px 8px;
      font-size: 12px;
      color: #333;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .log-list {
      max-height: 200px;
      padding-left: 16px;
      overflow: auto;
      font-size: 12px;
    }
  }
}
</style>
// #endregion style
