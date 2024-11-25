const IS_LOG_DEBUG_INFO = true
// #region typedefine
/** 事件数据类型 */
export type SendMessageType = {
  /** 事件类型 */
  type: string
  /** 数据 */
  data: any
  /** 发送事件的实例id */
  id: number
  /** 消息是发送给目标实例id的 */
  targetId?: number
}

/** 事件类型 */
export enum EventTypeEnum {
  /** 初始广播 */
  Broadcast = 'Hello world',
  /** 回复初始广播 */
  Broadcast_Reply = 'I can hear you',
  /** 主节点心跳 */
  Main_Node_Hearbeat = '苍天还在，别立黄天',
  /** 回复主节点心跳 */
  Res_Main_Node_Hearbeat = '苍天在上，受我一拜',
  /** 长时间未收到主节点心跳，我想当主节点，你们同意吗 */
  Req_Be_Main_Node = '苍天已死，黄天当立',
  /** 排资论辈，我应是主节点，不同意 */
  Res_Be_Main_Node = '我是黄天，尔等退下',
  /** 当前BC节点类型更改 */
  Node_Type_Change = 'node type change',
  /** 其他标签页BC节点id列表更新 */
  Friend_List_Update = 'friend list update'
}

/** 当前webview BroadcastChannel节点类型 */
export enum NodeTypeEnum {
  Main = 'main',
  Normal = 'normal'
}
// #endregion typedefine

// 消息超时时间
const MessageTimeout = 300

/**
 * 使用BroadcastChannel与其他标签页进行通信
 */
export class BroadcastChannelManager {
  /** 通道名称 */
  private _bcName: string
  /** BroadcastChannel实例 */
  private _broadcastChannel: BroadcastChannel | undefined = undefined
  /** 事件map */
  private _eventMap: Map<string, Array<(_: SendMessageType) => void>>
  /** 主节点发送心跳的interval */
  private _mainNodeMsgInterval: number | null = null
  /** 认为主节点掉线的timeout */
  private _mainNoceMsgTimeoutTimer: number | null = null
  /** 当前实例id */
  public id: number = Date.now() + Math.random()
  /** 记录的友方id数组 */
  private _oldFrendChannelIdList: Array<number> = []
  /** 正在更新的右方id数组 */
  private _friendChannelIdSet: Set<number> = new Set()
  /** 当前节点类型 */
  private _nodeType: NodeTypeEnum | undefined = undefined

  constructor(name: string) {
    this._bcName = name
    this._eventMap = new Map()
    IS_LOG_DEBUG_INFO && console.log('BC:id:', this.id)
  }

  get nodeType() {
    return this._nodeType
  }

  get friendList() {
    return [...this._oldFrendChannelIdList]
  }

  public connect() {
    IS_LOG_DEBUG_INFO && console.log('BC:bc connect')
    this.close()
    this._broadcastChannel = new BroadcastChannel(this._bcName)
    this._bindBroadcastChannelEvent()
    this._updateFriendList()
  }

  public close() {
    IS_LOG_DEBUG_INFO && console.log('BC:bc close')
    this._broadcastChannel && this._broadcastChannel.close()
  }

  /**
   * 切换节点类型
   * @param {NodeTypeEnum} type
   * @returns
   */
  private _setNodeType(type: NodeTypeEnum) {
    if (this._nodeType === type) {
      return
    }
    this._nodeType = type
    this.emit(EventTypeEnum.Node_Type_Change, {
      type: EventTypeEnum.Node_Type_Change,
      data: type,
      id: this.id
    })
  }

  /** 更新友方列表 */
  private _updateFriendList() {
    // 广播告知己方存在
    this.send(EventTypeEnum.Broadcast)

    setTimeout(() => {
      this._oldFrendChannelIdList = this._getNewFriendList()
      IS_LOG_DEBUG_INFO && console.log('BC:connect:updateFriendChannelIdList:', this._oldFrendChannelIdList)
      this.emit(EventTypeEnum.Friend_List_Update, {
        type: EventTypeEnum.Friend_List_Update,
        data: [...this._oldFrendChannelIdList],
        id: this.id
      })
      this._updataNodeType()
    }, MessageTimeout)
  }
  /** 绑定事件 */
  private _bindBroadcastChannelEvent() {
    this._broadcastChannel &&
      (this._broadcastChannel.onmessage = (event) => {
        const { type, targetId } = event.data
        if (targetId && targetId !== this.id) {
          return
        }
        this.emit(type, event.data)
      })

    // 收到世界呼唤
    this.on(EventTypeEnum.Broadcast, (data) => {
      const { id } = data
      if (!this._friendChannelIdSet.has(id)) {
        this._friendChannelIdSet.add(id)
      }

      this.sendToTarget(EventTypeEnum.Broadcast_Reply, id)
    })

    // 收到友方存在
    this.on(EventTypeEnum.Broadcast_Reply, (data) => {
      const { id } = data
      this._addFriend(id)
    })

    // 收到其他申请为主节点
    this.on(EventTypeEnum.Req_Be_Main_Node, (data) => {
      const { id } = data
      if (id > this.id) {
        this.sendToTarget(EventTypeEnum.Res_Be_Main_Node, id)
      }
    })

    // 收到其他节点回复主节点心跳
    this.on(EventTypeEnum.Res_Main_Node_Hearbeat, (data) => {
      this._addFriend(data.id)
    })

    this._bindNodeEvent()
  }

  /** 监听节点类型切换事件 */
  private _bindNodeEvent() {
    const onMainNodeHearbeat = (data: SendMessageType) => {
      this._timeoutToBeMainNode()
      this._catchOldFriend()
      this._addFriend(data.id)
      this.send(EventTypeEnum.Res_Main_Node_Hearbeat)
    }

    this.on(EventTypeEnum.Node_Type_Change, (info) => {
      const { data } = info
      this._mainNodeMsgInterval && clearInterval(this._mainNodeMsgInterval)
      IS_LOG_DEBUG_INFO && console.log('BC:代理类型切换：', info.data)
      if (data === NodeTypeEnum.Main) {
        // 定时发送主节点心跳
        this._mainNodeMsgInterval = setInterval(() => {
          this._catchOldFriend()
          this.send(EventTypeEnum.Main_Node_Hearbeat)
        }, MessageTimeout)
      } else if (data === NodeTypeEnum.Normal) {
        this._timeoutToBeMainNode()
      }
      // 收到主节点心跳, 重新更新友方列表
      this.on(EventTypeEnum.Main_Node_Hearbeat, onMainNodeHearbeat)
    })
  }

  /** 获取最新的友方列表 */
  private _getNewFriendList() {
    return [...this._friendChannelIdSet].sort((a, b) => a - b)
  }
  /**
   * 更新当前节点类型
   */
  private _updataNodeType() {
    this._mainNodeMsgInterval && clearInterval(this._mainNodeMsgInterval)
    if (this._oldFrendChannelIdList.length === 0 || Math.min(...this._oldFrendChannelIdList) > this.id) {
      if (this._nodeType === NodeTypeEnum.Main) {
        return
      }
      this._setNodeType(NodeTypeEnum.Main)
    } else {
      if (this._nodeType === NodeTypeEnum.Normal) {
        return
      }
      this._setNodeType(NodeTypeEnum.Normal)
    }
  }

  private _timeoutToBeMainNode() {
    this._mainNoceMsgTimeoutTimer && clearTimeout(this._mainNoceMsgTimeoutTimer)
    // 超时未收到心跳，认为主节点掉线，申请为主节点
    this._mainNoceMsgTimeoutTimer = setTimeout(() => {
      this._req_beMainNode()
    }, MessageTimeout * 3)
  }

  /**
   * 保持记录的活跃的友方id列表
   * 清空正在记录的友方id列表
   */
  private _catchOldFriend() {
    const newFriendList = this._getNewFriendList()
    if (this._oldFrendChannelIdList.join() !== newFriendList.join()) {
      IS_LOG_DEBUG_INFO && console.log('BC:updateFriendChannelIdList:', newFriendList)
      this.emit(EventTypeEnum.Friend_List_Update, {
        type: EventTypeEnum.Friend_List_Update,
        data: [...newFriendList],
        id: this.id
      })
      this._oldFrendChannelIdList = [...newFriendList]
    }

    if (this._nodeType === NodeTypeEnum.Main && Math.min(...this._oldFrendChannelIdList) < this.id) {
      // 有更小的id，不再为主节点
      this._setNodeType(NodeTypeEnum.Normal)
    }

    this._friendChannelIdSet.clear()
  }

  /**
   * 申请成为主节点
   */
  private _req_beMainNode() {
    IS_LOG_DEBUG_INFO && console.log('BC:req_beMainNode')

    // 向所有id友方节点发送申请
    this.send(EventTypeEnum.Req_Be_Main_Node)

    // 如果长时间未回复，认为自己可以当主节点
    const timer = setTimeout(() => {
      this._setNodeType(NodeTypeEnum.Main)
    }, MessageTimeout)

    // 收到拒绝回复，清空timeout
    const handleRes_beMainNode = () => {
      clearTimeout(timer)
      this.off(EventTypeEnum.Res_Be_Main_Node, handleRes_beMainNode)
    }

    this.on(EventTypeEnum.Res_Be_Main_Node, handleRes_beMainNode)
  }

  /**
   * 添加友方
   * @param id 节点id
   */
  public _addFriend(id: number) {
    if (!this._friendChannelIdSet.has(id)) {
      this._friendChannelIdSet.add(id)
    }
  }

  /**
   * 广播消息
   * @param type 消息类型
   * @param data 数据
   */
  public send(type: string, data?: any) {
    this._broadcastChannel?.postMessage({
      type,
      data,
      id: this.id
    })
  }

  /**
   * 给特定id的节点发送消息
   * @param type 消息类型
   * @param targetId 目标节点id
   * @param data 数据
   */
  public sendToTarget(type: string, targetId: number, data?: any) {
    this._broadcastChannel?.postMessage({
      type,
      data,
      id: this.id,
      targetId
    })
  }

  /**
   * 注册事件
   * @param { string } event 事件类型
   * @param callback 回调
   * @returns void
   */
  public on(event: string, callback: (_: SendMessageType) => void) {
    const callbacks = this._eventMap.get(event)
    if (!callbacks) {
      this._eventMap.set(event, [callback])
      return
    }

    if (callbacks.includes(callback)) {
      return
    }
    callbacks.push(callback)
  }

  /**
   * 注销事件
   * @param { string } event 事件类型
   * @param callback 事件回调
   * @returns
   */
  public off(event: string, callback?: (_: SendMessageType) => void) {
    const callbacks = this._eventMap.get(event)
    if (!callbacks) {
      return
    }

    if (!callback) {
      callbacks.length = 0
      return
    }

    const index = callbacks.indexOf(callback)
    callbacks.splice(index, 1)
  }

  /**
   * 触发事件
   * @param { string } event 事件类型
   * @param data 数据
   */
  public emit(event: string, data: SendMessageType) {
    const callbacks = this._eventMap.get(event) || []

    callbacks.forEach((cb) => {
      cb(data)
    })
  }

  /**
   * 销毁
   */
  public destroy() {
    this._bcName = ''
    this._eventMap.clear()
    this._broadcastChannel?.close()
    this._broadcastChannel = undefined
    this._oldFrendChannelIdList = []
    this._friendChannelIdSet.clear()
    this.id = -1
    this._nodeType = undefined

    this._mainNodeMsgInterval && clearInterval(this._mainNodeMsgInterval)
    this._mainNodeMsgInterval = null
    this._mainNoceMsgTimeoutTimer && clearInterval(this._mainNoceMsgTimeoutTimer)
    this._mainNoceMsgTimeoutTimer = null
    IS_LOG_DEBUG_INFO && console.log('BC:destroy')
  }
}
