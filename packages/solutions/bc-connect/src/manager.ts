// #region typedefine
/** 事件数据类型 | Event Datatypes */
export type BcConnectSendMessageType = {
  /** 事件类型 | type */
  type: string
  /** 数据 | data */
  data: any
  /** 发送事件的实例id | BroadcastChannelManager instance id */
  id: number
  /** 此消息的目标实例id | The target instance id for this message */
  targetId?: number
}

/** 事件类型 | Event types */
export enum BcConnectEventTypeEnum {
  /** 初始广播 | Initial broadcast */
  Broadcast = '__BCM_INIT__',
  /** 回复初始广播 | Reply to initial broadcast */
  Broadcast_Reply = '__BCM_INIT_REPLY__',
  /** 主节点心跳 | Master node heartbeat */
  Main_Node_Hearbeat = '__BCM_MAIN_NODE_HEARBEAT__',
  /** 回复主节点心跳 | Reply to the master node heartbeat */
  Res_Main_Node_Hearbeat = '__BCM_MAIN_NODE_HEARBEAT_REPLY__',
  /**
   * 长时间未收到主节点心跳，申请成为主节点
   * It has not received the heartbeat of the master node for a long time.
   *  Apply to become the master node
   */
  Req_Be_Main_Node = '__BCM_REQ_BE_MAIN_NODE__',
  /** 拒绝其他节点成为主节点 | Reject other nodes as master nodes */
  Res_Be_Main_Node = '__BCM_REQ_BE_MAIN_NODE_REJECT__',
  /** 当前节点类型更改 | The current node type has changed */
  Node_Type_Change = '__BCM_NODE_TYPE_CHANGE__',
  /** 其他标签页BC节点id列表更新 | Other TAB node id list updated */
  Friend_List_Update = '__BCM_FRIEND_LIST_UPDATE__'
}

/** BroadcastChannel节点类型 | BroadcastChannel node type */
export enum BcConnectNodeTypeEnum {
  Main = 'main',
  Normal = 'normal'
}
// #endregion typedefine

// 消息超时时间 | Message timeout time
const MessageTimeout = 300

/**
 * 使用BroadcastChannel与其他标签页进行通信
 * Use BroadcastChannel to communicate with other tabs
 */
export class BroadcastChannelManager {
  /** 通道名称 | Channel name */
  private _bcName: string
  /** BroadcastChannel instance */
  private _broadcastChannel: BroadcastChannel | undefined = undefined
  /** Event map */
  private _eventMap: Map<string, Array<(_: BcConnectSendMessageType) => void>>
  /** 主节点发送心跳的interval | The interval at which the master node sends the heartbeat */
  private _mainNodeMsgInterval: number | null = null
  /** 认为主节点掉线的timeout | timeout to consider the primary node to be offline */
  private _mainNodeMsgTimeoutTimer: number | null = null
  /** 更新友方列表的timeout | Update the timeout of the friend list */
  private _updateFriendListTimer: number | null = null
  /** 当前实例id | Current instance id */
  public id: number = Date.now() + Math.random()
  /** 其他广播通道id列表 | List of other broadcast channel ids */
  private _oldFrendChannelIdList: Array<number> = []
  /** 正在更新的id数组 | The id array being updated */
  private _friendChannelIdSet: Set<number> = new Set()
  /** 当前节点类型 | Current node type */
  private _nodeType: BcConnectNodeTypeEnum | undefined = undefined

  /**
   * 是否开启调试模式，会在控制台打印相关信息
   * If debug mode is enabled, it will print information to the console
   */
  private _debug: boolean = false

  constructor(name: string, debug: boolean = false) {
    this._debug = debug
    this._bcName = name
    this._eventMap = new Map()
    this._debug && console.log('BC:id:', this.id)
  }

  get nodeType() {
    return this._nodeType
  }

  get friendList() {
    return [...this._oldFrendChannelIdList]
  }

  public connect() {
    this._debug && console.log('BC:bc connect')
    this.close()
    this._broadcastChannel = new BroadcastChannel(this._bcName)
    this._bindBroadcastChannelEvent()
    this._updateFriendList()
  }

  public close() {
    this._debug && console.log('BC:bc close')
    this._broadcastChannel && this._broadcastChannel.close()
    this._broadcastChannel = undefined
    this._updateFriendListTimer && clearTimeout(this._updateFriendListTimer)
    this._updateFriendListTimer = null
    this._mainNodeMsgInterval && clearInterval(this._mainNodeMsgInterval)
    this._mainNodeMsgInterval = null
    this._mainNodeMsgTimeoutTimer && clearTimeout(this._mainNodeMsgTimeoutTimer)
    this._mainNodeMsgTimeoutTimer = null
    this._oldFrendChannelIdList = []
    this._friendChannelIdSet.clear()
    this._nodeType = undefined
  }

  /**
   * 切换节点类型 | Switching node type
   * @param {BcConnectNodeTypeEnum} type
   * @returns
   */
  private _setNodeType(type: BcConnectNodeTypeEnum) {
    if (this._nodeType === type) {
      return
    }
    this._nodeType = type
    this.emit(BcConnectEventTypeEnum.Node_Type_Change, {
      type: BcConnectEventTypeEnum.Node_Type_Change,
      data: type,
      id: this.id
    })
  }

  /** 更新广播id列表 | Update the list of broadcast ids */
  private _updateFriendList() {
    // 广播告知己方存在 | Broadcast your presence
    this.send(BcConnectEventTypeEnum.Broadcast)

    this._updateFriendListTimer && clearTimeout(this._updateFriendListTimer)

    this._updateFriendListTimer = setTimeout(() => {
      this._oldFrendChannelIdList = this._getNewFriendList()
      this._debug && console.log('BC:connect:updateFriendChannelIdList:', this._oldFrendChannelIdList)
      this.emit(BcConnectEventTypeEnum.Friend_List_Update, {
        type: BcConnectEventTypeEnum.Friend_List_Update,
        data: [...this._oldFrendChannelIdList],
        id: this.id
      })
      this._updataNodeType()
    }, MessageTimeout)
  }
  /** 绑定事件 | Bind event */
  private _bindBroadcastChannelEvent() {
    this._broadcastChannel &&
      (this._broadcastChannel.onmessage = (event) => {
        const { type, targetId } = event.data
        if (targetId && targetId !== this.id) {
          return
        }
        this.emit(type, event.data)
      })

    // 收到初始广播 | Receiving the initial broadcast
    this.on(BcConnectEventTypeEnum.Broadcast, (data) => {
      const { id } = data
      if (!this._friendChannelIdSet.has(id)) {
        this._friendChannelIdSet.add(id)
      }

      this.sendToTarget(BcConnectEventTypeEnum.Broadcast_Reply, id)
    })

    // 收到初始广播回复 | The initial broadcast reply is received
    this.on(BcConnectEventTypeEnum.Broadcast_Reply, (data) => {
      const { id } = data
      this._addFriend(id)
    })

    // 收到其他节点申请为主节点 | Others apply for the master node
    this.on(BcConnectEventTypeEnum.Req_Be_Main_Node, (data) => {
      const { id } = data
      if (id > this.id) {
        this.sendToTarget(BcConnectEventTypeEnum.Res_Be_Main_Node, id)
      }
    })

    // 收到主节点心跳回复 | Received the master node heartbeat reply
    this.on(BcConnectEventTypeEnum.Res_Main_Node_Hearbeat, (data) => {
      this._addFriend(data.id)
    })

    this._bindNodeEvent()
  }

  /** 监听节点类型切换事件 |  */
  private _bindNodeEvent() {
    const onMainNodeHearbeat = (data: BcConnectSendMessageType) => {
      this._timeoutToBeMainNode()
      this._catchOldFriend()
      this._addFriend(data.id)
      this.send(BcConnectEventTypeEnum.Res_Main_Node_Hearbeat)
    }

    this.on(BcConnectEventTypeEnum.Node_Type_Change, (info) => {
      const { data } = info
      this._mainNodeMsgInterval && clearInterval(this._mainNodeMsgInterval)
      this._debug && console.log('BC:NODE_TYPE_CHANGE：', info.data)
      if (data === BcConnectNodeTypeEnum.Main) {
        // 定时发送主节点心跳 | The heartbeat of the master node is sent periodically
        this._mainNodeMsgInterval = setInterval(() => {
          this._catchOldFriend()
          this.send(BcConnectEventTypeEnum.Main_Node_Hearbeat)
        }, MessageTimeout)
      } else if (data === BcConnectNodeTypeEnum.Normal) {
        this._timeoutToBeMainNode()
      }
      // 收到主节点心跳, 重新更新友方列表 | Update the friend list after receiving the heartbeat of the master node
      this.on(BcConnectEventTypeEnum.Main_Node_Hearbeat, onMainNodeHearbeat)
    })
  }

  /** 获取最新的节点列表 | Get the latest node list */
  private _getNewFriendList() {
    return [...this._friendChannelIdSet].sort((a, b) => a - b)
  }
  /**
   * 更新当前节点类型 | Update the current node type
   */
  private _updataNodeType() {
    this._mainNodeMsgInterval && clearInterval(this._mainNodeMsgInterval)
    if (this._oldFrendChannelIdList.length === 0 || Math.min(...this._oldFrendChannelIdList) > this.id) {
      if (this._nodeType === BcConnectNodeTypeEnum.Main) {
        return
      }
      this._setNodeType(BcConnectNodeTypeEnum.Main)
    } else {
      if (this._nodeType === BcConnectNodeTypeEnum.Normal) {
        return
      }
      this._setNodeType(BcConnectNodeTypeEnum.Normal)
    }
  }

  private _timeoutToBeMainNode() {
    this._mainNodeMsgTimeoutTimer && clearTimeout(this._mainNodeMsgTimeoutTimer)
    // 超时未收到心跳，认为主节点掉线，申请为主节点
    // If no heartbeat is received after the timeout, the master node is considered to be offline and the master node is applied
    this._mainNodeMsgTimeoutTimer = setTimeout(() => {
      this._req_beMainNode()
    }, MessageTimeout * 3)
  }

  /**
   * 保存最新的节点列表到_oldFrendChannelIdList，清空_friendChannelIdSet
   * Save the latest node list to _oldFrendChannelIdList and clear _friendChannelIdSet
   */
  private _catchOldFriend() {
    const newFriendList = this._getNewFriendList()
    if (this._oldFrendChannelIdList.join() !== newFriendList.join()) {
      this._debug && console.log('BC:updateFriendChannelIdList:', newFriendList)
      this.emit(BcConnectEventTypeEnum.Friend_List_Update, {
        type: BcConnectEventTypeEnum.Friend_List_Update,
        data: [...newFriendList],
        id: this.id
      })
      this._oldFrendChannelIdList = [...newFriendList]
    }

    if (this._nodeType === BcConnectNodeTypeEnum.Main && Math.min(...this._oldFrendChannelIdList) < this.id) {
      // 有更小的id，不再为主节点 | Has a smaller id and is no longer a master node
      this._setNodeType(BcConnectNodeTypeEnum.Normal)
    }

    this._friendChannelIdSet.clear()
  }

  /**
   * 申请成为主节点 | Apply to be a master node
   */
  private _req_beMainNode() {
    this._debug && console.log('BC:req_beMainNode')

    // 向所有节点申请成为主节点 | Apply to all nodes to become master nodes
    this.send(BcConnectEventTypeEnum.Req_Be_Main_Node)

    // 如果长时间未回复，认为自己可以当主节点
    // If there is no reply for a long time, it considers itself to be the master
    const timer = setTimeout(() => {
      this._setNodeType(BcConnectNodeTypeEnum.Main)
    }, MessageTimeout)

    // 收到拒绝回复，清空timeout
    // Clear the timeout when you receive a rejection reply
    const handleRes_beMainNode = () => {
      clearTimeout(timer)
      this.off(BcConnectEventTypeEnum.Res_Be_Main_Node, handleRes_beMainNode)
    }

    this.on(BcConnectEventTypeEnum.Res_Be_Main_Node, handleRes_beMainNode)
  }

  /**
   * add node
   * @param id id
   */
  public _addFriend(id: number) {
    if (!this._friendChannelIdSet.has(id)) {
      this._friendChannelIdSet.add(id)
    }
  }

  /**
   * 广播消息 | Send Broadcast message
   * @param type 消息类型 | Message type
   * @param data 数据 | data
   */
  public send(type: string, data?: any) {
    this._broadcastChannel?.postMessage({
      type,
      data,
      id: this.id
    })
  }

  /**
   * 给特定id的节点发送消息 | Send a message to a node with a specific id
   * @param type 消息类型 | Message type
   * @param targetId 目标节点id | Target Node id
   * @param data 数据 | data
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
   * 注册事件 | Registering events
   * @param { string } event 事件类型 | Event type
   * @param callback 回调 | callback
   * @returns void
   */
  public on(event: string, callback: (_: BcConnectSendMessageType) => void) {
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
   * 注销事件 | Remove events
   * @param { string } event 事件类型 | Event type
   * @param callback 事件回调 | callback
   * @returns
   */
  public off(event: string, callback?: (_: BcConnectSendMessageType) => void) {
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
   * 触发事件 | Triggering events
   * @param { string } event 事件类型 | Event type
   * @param data 数据 | data
   */
  public emit(event: string, data: BcConnectSendMessageType) {
    const callbacks = this._eventMap.get(event) || []

    callbacks.forEach((cb) => {
      cb(data)
    })
  }

  /**
   * 销毁 | destroy
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
    this._mainNodeMsgTimeoutTimer && clearInterval(this._mainNodeMsgTimeoutTimer)
    this._mainNodeMsgTimeoutTimer = null
    this._debug && console.log('BC:destroy')
  }
}
