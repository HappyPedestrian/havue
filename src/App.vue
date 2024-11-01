<script setup lang="ts">
// import { ref } from 'vue'
// import ColorPicker from './components/ColorPicker/ColorPicker.vue'
import VideoPlayerDemo from './components/VideoPlayer/Demo.vue'
// import MousePassThrough from './components/MousePassThrough/MousePassThrough.vue'
// import FFMpegTest from './components/FFMpegTest/FFMpegTest.vue'
// import DragAndScaleDemo from './components/DragAndScale/Demo.vue'

// const color = ref('#ffffff')
</script>

<template>
  <!-- <div>颜色：<input type="color" v-model="color" /></div> -->
  <!-- <ColorPicker v-model="color"></ColorPicker> -->
  <!-- <div class="video-list">
    <VideoPlayer
      v-for="i in 10"
      :key="i"
      url="ws://192.168.1.83:8000/vo/3.live.mp4"
      :width="i * 32"
      :height="i * 16"
    ></VideoPlayer>
  </div> -->
  <!-- <div class="video-list">
		<VideoPlayer
			v-for="i in 1"
			:key="i"
			url="ws://10.168.11.200:8080/record/2.mp4.live.mp4"
			type="video"
			:width="640"
			:height="320"
		></VideoPlayer>
	</div> -->
  <!-- <div class="mouse-pass-box">
		<MousePassThrough :width="1920" :height="1080"></MousePassThrough>
	</div> -->
  <!-- <FFMpegTest></FFMpegTest> -->
  <VideoPlayerDemo></VideoPlayerDemo>
  <!-- <DragAndScaleDemo></DragAndScaleDemo> -->
</template>

<style lang="scss" scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.video-list {
  height: auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .video-player {
    height: 100px;
    width: 180px;
  }
}
.mouse-pass-box {
  width: 1280px;
  height: 640px;
  background-color: aliceblue;
}
</style>
