<template>
  <div class="ffmpeg-test">
    <div class="loaded-box" v-loading="loading">
      <div>{{ loading ? 'loading' : '' }}</div>
      <video ref="videoRef" controls></video><br />
      <button @click="transcode">Transcode webm to mp4</button>
      <p>{{ messageRef }}</p>
      <p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
    </div>
    <button @click="load">Load ffmpeg-core (~31 MB)</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import videoUrl from '../../assets/Big_Buck_Bunny_180_10s.webm'
import workerUrl from '../../../node_modules/@ffmpeg/ffmpeg/dist/esm/worker.js?url'
import ffmpegCoreJsUrl from '@/utils/ffmpeg/ffmpeg-core.js?url'
import ffmpegCoreWasmUrl from '@/utils/ffmpeg/ffmpeg-core.wasm?url'

// const videoURL = 'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/video-15s.avi'

const loading = ref(false)
const messageRef = ref('')
const videoRef = ref()
// const ffmpegRef = ref(new FFmpeg())
const ffmpeg = new FFmpeg()

async function load() {
  try {
    console.log('load begin')
    loading.value = true
    ffmpeg.on('log', ({ message }) => {
      messageRef.value = message
      console.log(message)
    })
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      classWorkerURL: workerUrl,
      coreURL: await toBlobURL(ffmpegCoreJsUrl, 'text/javascript'),
      wasmURL: await toBlobURL(ffmpegCoreWasmUrl, 'application/wasm')
    })

    console.log('ffmpeg:', ffmpeg)
  } catch (error) {
    console.error('error:', error)
  } finally {
    console.log('load end')

    loading.value = false
  }
}

const transcode = async () => {
  await ffmpeg.writeFile(
    'input.webm',
    // await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm')
    await fetchFile(videoUrl)
  )
  await ffmpeg.exec(['-i', 'input.webm', 'output.mp4'])
  // const data = await ffmpeg.readFile('output.mp4')
  // await ffmpeg.exec([
  //   '-i',
  //   'rtsp://192.168.1.128:10054/live/8roJ8fRNR',
  //   '-c:v',
  //   'libx264',
  //   '-c:a',
  //   'aac',
  //   '-t',
  //   '10',
  //   'output.mp4'
  // ])
  // await ffmpeg.exec(['-i', 'input.webm', '-c:v', 'copy', '-c:a', 'copy', '-t', '5', 'output.mp4'])
  // await ffmpeg.exec(['-i', 'input.webm', '-c:v', 'copy', '-c:a', 'copy', '-t', '5', 'output.mp4'])
  // await ffmpeg.exec(['-rtsp_transport', 'tcp', '-i', 'rtsp://localhost:10054/live/CmqWYEgNR', '-t', '5', 'output.mp4'])
  const data = await ffmpeg.readFile('output.mp4')
  console.log('data:', data)
  videoRef.value.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
}
</script>

<style lang="scss">
.ffmpeg-test {
  button {
    background-color: black;
  }
}
</style>

<!-- <template>
  <video :src="video" controls />
  <br />
  <button @click="transcode">Start</button>
  <p>{{ message }}</p>
</template>

<script lang="ts">
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { defineComponent, ref } from 'vue'
import workerUrl from '../../../node_modules/@ffmpeg/ffmpeg/dist/esm/worker.js?url'
import ffmpegCoreJsUrl from '@/utils/ffmpeg/ffmpeg-core.js?url'
import ffmpegCoreWasmUrl from '@/utils/ffmpeg/ffmpeg-core.wasm?url'

const videoURL = 'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/video-15s.avi'

export default defineComponent({
  name: 'App',
  setup() {
    const ffmpeg = new FFmpeg()
    const message = ref('Click Start to Transcode')
    let video = ref('')

    async function transcode() {
      try {
        message.value = 'Loading ffmpeg-core.js'
        ffmpeg.on('log', ({ message: msg }) => {
          message.value = msg
        })
        await ffmpeg.load({
          classWorkerURL: workerUrl,
          coreURL: await toBlobURL(ffmpegCoreJsUrl, 'text/javascript'),
          wasmURL: await toBlobURL(ffmpegCoreWasmUrl, 'application/wasm')
        })
        console.log('ffmgeg:', ffmpeg)
        message.value = 'Start transcoding'
        await ffmpeg.writeFile('test.avi', await fetchFile(videoURL))
        await ffmpeg.exec(['-i', 'test.avi', 'test.mp4'])
        message.value = 'Complete transcoding'
        const data = await ffmpeg.readFile('test.mp4')
        video.value = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' }))
      } catch (error) {
        console.log('transcode error:', error)
      } finally {
        console.log('transcode end')
      }
    }
    return {
      video,
      message,
      transcode
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->
