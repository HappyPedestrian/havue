// #region template
<template>
  <div class="brdCnl-box">
    <div class="left-box">
      <div class="title">其他标签页实例id 列表</div>
      <div class="friend-item" v-for="friend in friendList">{{ friend }}</div>
    </div>
    <div class="right-box">
      <div class="current-id">当前标签页实例 id: {{ currentBcId }}</div>
      <div class="options-box">
        <div class="form-item"><span class="label">发送消息:</span><input v-model="message" /></div>
        <button class="borad-btn" @click="handleBroadMessage">广播</button>
        <div class="form-item"><span class="label">目标id:</span><input v-model="targetId" /></div>
        <button class="sigle-btn" @click="handleBroadOneMessage">单发</button>
      </div>
      <div class="message-box">
        <div class="message-item" v-for="message in recieveMessageList" :key="message.id">
          <div class="id">id:{{ message.id }}</div>
          <div class="data">data: {{ message.data }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
// #endregion template
<!--  -->
// #region script
<script setup lang="ts">
import type { SendMessageType } from './manager'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { BroadcastChannelManager, EventTypeEnum } from './manager'

let bcManager: BroadcastChannelManager | null = null

const currentBcId = ref()

const friendList = ref<Array<number>>([])
const message = ref()
const targetId = ref()

const recieveMessageList = ref<Array<SendMessageType>>([])

function handleBroadMessage() {
  if (!message.value) {
    alert('请输入消息')
    return
  }
  bcManager?.send('test-message', message.value)
}

function handleBroadOneMessage() {
  if (!message.value) {
    alert('请输入消息')
    return
  }
  if (!targetId.value) {
    alert('请输入目标id')
    return
  }
  bcManager?.sendToTarget('test-message', Number(targetId.value), message.value)
}

onMounted(() => {
  if (!bcManager) {
    bcManager = new BroadcastChannelManager('bc_test')
  }

  currentBcId.value = bcManager.id
  friendList.value = bcManager.friendList
  bcManager.connect()
  bcManager.on('test-message', (info) => {
    recieveMessageList.value.push(info)
  })
  bcManager.on(EventTypeEnum.Friend_List_Update, (info) => {
    friendList.value = info.data || []
  })
})

onBeforeUnmount(() => {
  bcManager?.close()
  bcManager?.destroy()
  bcManager = null
})
</script>
// #endregion script
<!--  -->
// #region style
<style lang="scss" scoped>
.brdCnl-box {
  width: 100%;
  height: 600px;
  display: flex;
  box-sizing: border-box;
  background-color: #4d797c;
  color: black;
  .left-box {
    width: 30%;
    overflow: auto;
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .friend-item {
      padding: 6px 10px;
      margin: 5px;
      background-color: rgb(100, 148, 237);
    }
  }

  .right-box {
    padding: 5px 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #4e7c4d;

    .current-id {
      padding: 3px 5px;
      background-color: #a8b9be;
    }
    .message-box {
      margin-top: 10px;
      flex: 1;
      overflow: auto;
      background-color: antiquewhite;
      .message-item {
        padding: 5px;
        margin: 5px;
        background-color: #8cbba9;
        .id {
          font-weight: bold;
        }
        .message {
          color: #44b15c;
        }
      }
    }

    .form-item {
      margin: 5px 20px;
      display: flex;
      align-items: center;
      .label {
        display: inline-block;
        width: 80px;
        text-align: right;
      }
      input {
        flex: 1;
        padding: 5px;
        font-size: 16px;
        color: #fff;
        background-color: black;
      }
    }
    button {
      color: black;
      width: 100%;
      background-color: #a8b9be;
    }
  }
}
</style>
// #endregion style
