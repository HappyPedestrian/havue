// #region template
<template>
  <div ref="operateBoxRef" class="mouse-pass-through">
    {{ stateText }}
    <div class="point" :style="pointStyle"></div>
  </div>
</template>
// #endregion template
<!--  -->
// #region script
<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
// import { useGestrue2Mouse } from '@pedy/use-gesture-2-mouse'
import { useGestrue2Mouse } from '@pedy/hooks'

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

const { operateBoxRef } = useGestrue2Mouse(originRect, undefined, {
  onMouseEvent: (e, button) => {
    Object.assign(currentPoint, {
      x: e.x,
      y: e.y
    })

    if (button) {
      stateText.value =
        button === 'left' ? '左键' : button === 'right' ? '右键' : button === 'middle' ? '鼠标中键' : '未按下键'
    }

    console.log(stateText.value, e)
  },
  onMouseWheel(e, deltaY) {
    Object.assign(currentPoint, {
      x: e.x,
      y: e.y
    })
    nextTick(() => {
      stateText.value = `滚动：deltaY:${deltaY}`
    })

    console.log(stateText.value, e)
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
  overflow: hidden;
  background-color: rgb(41 109 86);

  .point {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
// #endregion style
