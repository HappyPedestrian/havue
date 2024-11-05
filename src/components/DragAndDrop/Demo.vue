// #region template
<template>
  <div class="dnd-demo" ref="divRef">
    <div class="left-box">
      <p>下列卡片可拖动：</p>
      <div class="top-drag-list-box">
        <Draggable :type="item.type" v-for="item in DragItems" :data="item">
          <div class="drag-box">{{ item.type }}: {{ `${item.width} * ${item.height}` }}</div>
        </Draggable>
      </div>
    </div>

    <div class="right-box">
      <p>下方为可拖放区域green：</p>
      <Droppable
        accept-drag-type="green"
        @enter="
          (...args) => {
            enteredType = 'green'
            onEnter(...args)
          }
        "
        @move="onMove"
        @leave="onLeave"
        @drop="onDrop"
      >
        <div class="drop-box">
          <div class="preview-box" v-if="enteredType === 'green'" :style="previewStyle"></div>
          <div
            class="inner-box-item"
            v-for="item in greenInnerBoxList"
            :key="item.key"
            :style="{
              top: item.y,
              left: item.x,
              width: item.width,
              height: item.height
            }"
          ></div>
        </div>
      </Droppable>

      <p>下方为可拖放区域yellow：</p>
      <Droppable
        accept-drag-type="yellow"
        @enter="
          (...args) => {
            enteredType = 'yellow'
            onEnter(...args)
          }
        "
        @move="onMove"
        @leave="onLeave"
        @drop="onDrop"
      >
        <div class="drop-box yellow">
          <div class="preview-box" v-if="enteredType === 'yellow'" :style="previewStyle"></div>
          <div
            class="inner-box-item"
            v-for="item in yellowInnerBoxList"
            :key="item.key"
            :style="{
              top: item.y,
              left: item.x,
              width: item.width,
              height: item.height
            }"
          ></div>
        </div>
      </Droppable>
    </div>
  </div>
</template>
// #endregion template
<empty></empty>
// #region script
<script setup lang="ts">
import type { Point } from './manager'
import { computed, ref, reactive } from 'vue'
import Draggable from './Draggable.vue'
import Droppable from './Droppable.vue'

type BoxType = {
  key: string | number | symbol
  x: string
  y: string
  width: string
  height: string
}

type EnteredType = 'green' | 'yellow' | ''

const divRef = ref<HTMLElement>()

const enteredType = ref<EnteredType>('')
const enteredPoint = ref({
  x: 0,
  y: 0
})
const previewData = ref()

const DragItems = reactive(
  Array(40)
    .fill(0)
    .map(() => {
      let random1 = Math.round(Math.random() * 50)
      let random2 = Math.round(Math.random() * 50)
      return {
        type: random1 % 2 === 0 ? 'green' : 'yellow',
        width: random1 + 150,
        height: random2 + 50
      }
    })
)

const greenInnerBoxList = reactive<BoxType[]>([
  {
    key: 1,
    x: '20px',
    y: '20px',
    width: '20px',
    height: '20px'
  },
  {
    key: 2,
    x: '100px',
    y: '30px',
    width: '50px',
    height: '200px'
  },
  {
    key: 3,
    x: '200px',
    y: '40px',
    width: '90px',
    height: '40px'
  }
])

const yellowInnerBoxList = reactive<BoxType[]>([
  {
    key: 4,
    x: '200px',
    y: '40px',
    width: '90px',
    height: '40px'
  }
])

const previewStyle = computed(() => {
  const preview = previewData.value || {}
  return {
    top: `${enteredPoint.value.y}px`,
    left: `${enteredPoint.value.x}px`,
    width: `${preview.width || 100}px`,
    height: `${preview.height || 50}px`
  }
})

function onEnter(point: Point, data: any) {
  enteredPoint.value = point
  previewData.value = data
}

function onMove(point: Point, data: any) {
  enteredPoint.value = point
  previewData.value = data
}

function onLeave() {
  enteredType.value = ''
  enteredPoint.value = { x: 0, y: 0 }
  previewData.value = undefined
}

function onDrop(point: Point, data: any) {
  data = data || {}
  const { width = 100, height = 50 } = data
  if (enteredType.value === 'green') {
    greenInnerBoxList.push({
      key: Date.now(),
      x: `${point.x - width / 2}px`,
      y: `${point.y - height / 2}px`,
      width: `${width}px`,
      height: `${height}px`
    })
  } else if (enteredType.value === 'yellow') {
    yellowInnerBoxList.push({
      key: Date.now(),
      x: `${point.x - width / 2}px`,
      y: `${point.y - height / 2}px`,
      width: `${width}px`,
      height: `${height}px`
    })
  }
  enteredType.value = ''
  enteredPoint.value = { x: 0, y: 0 }
  previewData.value = undefined
}
</script>
// #endregion script
<empty></empty>
// #region style
<style lang="scss" scoped>
.dnd-demo {
  width: 100%;
  height: 700px;
  background-color: rgba(20, 177, 177, 0.416);
  overflow: auto;
  display: flex;
  p {
    margin: 5px;
  }
  .left-box {
    background-color: rgba(162, 101, 22, 0.694);
    width: 30%;
    height: 100%;
    margin-right: 15px;
    overflow: auto;
    .top-drag-list-box {
      padding: 10px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 20px;
      .drag-box {
        height: 50px;
        width: 130px;
        color: white;
        background-color: black;
      }
    }
  }
  .right-box {
    flex: 1;
    .drop-box {
      position: relative;
      width: 400px;
      height: 300px;
      background-color: rgb(11, 104, 28);
      overflow: hidden;
      &.yellow {
        background-color: rgb(188, 149, 21);
      }
      .preview-box {
        position: absolute;
        background-color: rgba(127, 255, 212, 0.3);
        transform: translate(-50%, -50%);
      }
      .inner-box-item {
        position: absolute;
        background-color: rgba(143, 10, 65, 0.466);
      }
    }
  }
}
</style>
// #endregion style
