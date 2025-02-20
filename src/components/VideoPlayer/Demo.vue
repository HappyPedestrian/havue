// #region template
<template>
  <div>
    <div class="form-box">
      <div class="form-item"><span class="label">websocket url:</span><input v-model="url" /></div>
      <div class="form-item"><span class="label">width:</span><input v-model="width" /></div>
      <div class="form-item"><span class="label">height:</span><input v-model="height" /></div>
    </div>
    <div class="video-player" :style="{ width: `${width}px`, height: `${height}px` }">
      <canvas ref="canvasRef" :width="width" :height="height"></canvas>
    </div>
  </div>
</template>
// #endregion template
<!--  -->
// #region script
<script setup lang="ts">
import { ref } from 'vue'
import { useVideoPlay } from '@/utils/wsVideoManager/hooks/useVideoPlay'

const url = ref('')
const width = ref(640)
const height = ref(320)

const canvasRef = ref()

useVideoPlay({
  wsUrl: url,
  isReady: true,
  target: canvasRef
})
</script>
// #endregion script
<!--  -->
// #region style
<style lang="scss" scoped>
.form-box {
  padding: 15px;
  background: #25465845;

  .form-item {
    margin-bottom: 5px;

    .label {
      display: inline-block;
      width: 120px;
      margin-right: 20px;
      text-align: right;
    }

    input {
      padding: 1px 8px;
      border: 1px solid gray;
    }
  }
}

.video-player {
  background: #578895;

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
// #endregion style
