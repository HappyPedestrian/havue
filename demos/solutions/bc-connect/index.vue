// #region template
<template>
  <div class="brdCnl-box">
    <div class="left-box">
      <div class="title">Node id list</div>
      <div class="friend-item" v-for="friend in friendList" :key="friend">{{ friend }}</div>
    </div>
    <div class="right-box">
      <div class="current-info">Current tab node id: {{ currentBcId }}</div>
      <div class="current-info">current tab node type: {{ currentBcNodeType }}</div>
      <div class="options-box">
        <div class="form-item"><span class="label">Message:</span><input v-model="message" /></div>
        <button class="borad-btn" @click="handleBroadMessage">广播(Broadcast)</button>
        <div class="form-item"><span class="label">Target node id:</span><input v-model="targetId" /></div>
        <button class="sigle-btn" @click="handleBroadOneMessage">Single talk</button>
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
import type { BcConnectSendMessageType } from '@havue/bc-connect'
import { ref, onMounted, onBeforeUnmount } from 'vue'
// import { BroadcastChannelManager, BcConnectEventTypeEnum } from '@havue/bc-connect'
import { BroadcastChannelManager, BcConnectEventTypeEnum } from '@havue/solutions'

let bcManager: BroadcastChannelManager | null = null

const currentBcId = ref()
const currentBcNodeType = ref()

const friendList = ref<Array<number>>([])
const message = ref()
const targetId = ref()

const recieveMessageList = ref<Array<BcConnectSendMessageType>>([])

function handleBroadMessage() {
  if (!message.value) {
    alert('Please enter message')
    return
  }
  bcManager?.send('test-message', message.value)
}

function handleBroadOneMessage() {
  if (!message.value) {
    alert('Please enter message')
    return
  }
  if (!targetId.value) {
    alert('Please enter target id')
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
  bcManager.on(BcConnectEventTypeEnum.Friend_List_Update, (info) => {
    friendList.value = info.data || []
  })
  bcManager.on(BcConnectEventTypeEnum.Node_Type_Change, (info) => {
    currentBcNodeType.value = info.data
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
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 600px;
  color: black;
  background-color: #4d797c;

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
      background-color: rgb(100 148 237);
    }
  }

  .right-box {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 5px 10px;
    background-color: #4e7c4d;

    .current-info {
      padding: 3px 5px;
      background-color: #a8b9be;
    }

    .message-box {
      flex: 1;
      margin-top: 10px;
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
      display: flex;
      align-items: center;
      margin: 5px 20px;

      .label {
        display: inline-block;
        width: 100px;
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
      width: 100%;
      color: black;
      background-color: #a8b9be;
    }
  }
}
</style>
// #endregion style
