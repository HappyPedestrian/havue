// #region template
<template>
  <div ref="boxRef" class="mouse-pass-through">
    {{ stateText }}
    <div class="point" :style="pointStyle"></div>
  </div>
</template>
// #endregion template
<!--  -->
// #region script
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useOperateTransform } from './hooks/useOperateTransform'

const boxRef = ref()
const stateText = ref<string>('')

const originRect = ref({
  width: 1920,
  height: 1080
})

const currentPoint = reactive({
  x: 0,
  y: 0
})

const pointStyle = computed(() => {
  return {
    top: `${(100 * currentPoint.y) / originRect.value.height}%`,
    left: `${(100 * currentPoint.x) / originRect.value.width}%`
  }
})

useOperateTransform(originRect, boxRef, {
  onTap: (e) => {
    Object.assign(currentPoint, {
      x: e.x,
      y: e.y
    })
    stateText.value = '单击'
    console.log('单击', e)
  },
  onTap2: (e) => {
    Object.assign(currentPoint, {
      x: e.x,
      y: e.y
    })
    stateText.value = '双指单击'
    console.log('双指单击', e)
  },
  onDoubleTap: (e) => {
    Object.assign(currentPoint, {
      x: e.x,
      y: e.y
    })
    stateText.value = '单指双击'
    console.log('单指双击', e)
  },
  onPanMove: (e) => {
    Object.assign(currentPoint, {
      x: e.current.x,
      y: e.current.y
    })
    stateText.value = '单指滑动'
    console.log('单指滑动', e)
  },
  onPanEnd: (e) => {
    Object.assign(currentPoint, {
      x: e.current.x,
      y: e.current.y
    })
    stateText.value = '单指滑动结束'
    console.log('单指滑动结束', e)
  },
  onPan2Start: (e) => {
    Object.assign(currentPoint, {
      x: e.start.x,
      y: e.start.y
    })
    stateText.value = '双指滑动开始'
    console.log('双指滑动开始', e)
  },
  onPan2Move: (e) => {
    Object.assign(currentPoint, {
      x: e.current.x,
      y: e.current.y
    })
    stateText.value = '双指滑动'
    console.log('双指滑动', e)
  },
  onPan2End: (e) => {
    Object.assign(currentPoint, {
      x: e.current.x,
      y: e.current.y
    })
    stateText.value = '双指滑动结束'
    console.log('双指滑动结束', e)
  }
})
</script>
// #endregion script
<!--  -->
// #region style
<style lang="scss" scoped>
.mouse-pass-through {
  position: relative;
  width: 480px;
  height: 270px;
  background-color: rgb(41, 109, 86);
  overflow: hidden;

  .point {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    transform: translate(-50%, -50%);
  }
}
</style>
// #endregion style
