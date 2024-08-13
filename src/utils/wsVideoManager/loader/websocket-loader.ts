type HeartbeatConfigType = {
	once: boolean
	message: string
	interval?: number
}

type InterruptConfigType = {
	reconnect: boolean
	maxReconnectTimes: number
	delay: number
}

export type WebSocketOptionsType = {
	protocols?: string | string[]
	binaryType?: WebSocket['binaryType']
	heartbeat?: HeartbeatConfigType
	interrupt?: InterruptConfigType
}

type EventType = {
	open: Event
	message: MessageEvent
	close: CloseEvent
	error: Event
}

const defaultOptions: Required<WebSocketOptionsType> = {
	protocols: '',
	binaryType: 'arraybuffer',
	heartbeat: {
		once: false,
		message: 'heartbeat',
		interval: 5000,
	},
	interrupt: {
		reconnect: true,
		maxReconnectTimes: 3,
		delay: 3000,
	},
}

class WebSocketLoader {
	private _url: string
	private _protocols: string | string[]
	private _binaryType: WebSocket['binaryType']
	private _ws: WebSocket | null = null
	private _heartbeatConfig: HeartbeatConfigType
	private _heartbeatTimer: ReturnType<typeof setInterval> | null = null
	// 事件回调管理
	private _eventMap: Map<keyof EventType, Set<(...args: any) => void>> | null
	private _isManualClose = false
	private _interruptConfig: InterruptConfigType
	private _interruptReconnectTimes = 0
	private _interruptReconnectTimer: ReturnType<typeof setTimeout> | null = null

	constructor(url: string, options?: WebSocketOptionsType) {
		const realOptions = options ? Object.assign(defaultOptions, options) : defaultOptions

		this._url = url
		this._protocols = realOptions.protocols
		this._binaryType = realOptions.binaryType
		this._eventMap = new Map()
		this._heartbeatConfig = realOptions.heartbeat
		this._interruptConfig = realOptions.interrupt
	}

	get isConnecting() {
		return this._ws ? true : false
	}

	private triggerEvents<T extends keyof EventType>(eventName: T, event: EventType[T]) {
		if (!this._eventMap) return

		const set = this._eventMap.get(eventName)

		if (!set) return

		for (const callback of set) {
			callback(event)
		}
	}

	private bindWebSocketEvents(socket: WebSocket) {
		socket.onopen = (e: Event) => {
			this._isManualClose = false
			this._interruptReconnectTimes = 0
			this._interruptReconnectTimer && clearTimeout(this._interruptReconnectTimer)
			this.startHeartbeat()
			this.triggerEvents('open', e)
		}

		socket.onerror = (e: Event) => {
			this.stopHeartbeat()

			console.error('error: websocket error.')

			this.triggerEvents('error', e)
		}

		socket.onmessage = (e: MessageEvent) => {
			this.triggerEvents('message', e)
		}

		socket.onclose = (e: CloseEvent) => {
			if (this._isManualClose) {
				this.triggerEvents('close', e)
				return
			}

			// 非手动关闭导致连接意外中断
			if (this._interruptConfig.reconnect && this._interruptReconnectTimes < this._interruptConfig.maxReconnectTimes) {
				this._interruptReconnectTimes++

				console.warn(`websocket's connection is interrupt by accident, auto try to reconnect. try times: ${this._interruptReconnectTimes}`)

				this._interruptReconnectTimer && clearTimeout(this._interruptReconnectTimer)
				this._interruptReconnectTimer = setTimeout(() => {
					this.innerReconnect()
				}, this._interruptConfig.delay)

				return
			}

			if (this._interruptConfig.reconnect && this._interruptReconnectTimes === this._interruptConfig.maxReconnectTimes) {
				console.error(`try to reconnect ${this._interruptReconnectTimes} times, unable to establish connection.`)
				this._interruptReconnectTimes = 0
				return
			}
		}
	}

	private startHeartbeat() {
		if (this._heartbeatTimer) {
			clearInterval(this._heartbeatTimer)
			this._heartbeatTimer = null
		}

		const { message, interval, once } = this._heartbeatConfig

		// 只发一次心跳
		if (once) {
			this.sendMessage(message)
			return
		}

		this._heartbeatTimer = setInterval(() => {
			this.sendMessage(message)
		}, interval || 5000)
	}

	private stopHeartbeat() {
		if (this._heartbeatTimer) {
			clearInterval(this._heartbeatTimer)
			this._heartbeatTimer = null
		}
	}

	private innerReconnect() {
		if (this._ws) {
			this.stopHeartbeat()
			this._isManualClose = false
			this._ws = null
		}

		this._ws = this._protocols ? new WebSocket(this._url, this._protocols) : new WebSocket(this._url)
		this._ws.binaryType = this._binaryType
		this.bindWebSocketEvents(this._ws)
	}

	public open() {
		this._ws = this._protocols ? new WebSocket(this._url, this._protocols) : new WebSocket(this._url)
		this._ws.binaryType = this._binaryType
		this.bindWebSocketEvents(this._ws)
	}

	public close() {
		if (!this._ws) return

		this.stopHeartbeat()
		this._isManualClose = true
		this._ws.close()
		this._ws = null
	}

	public reconnect() {
		if (this._ws) {
			console.warn('websocket is connecting now, reconnection is unnecessary.')
			return
		}

		this._ws = this._protocols ? new WebSocket(this._url, this._protocols) : new WebSocket(this._url)
		this._ws.binaryType = this._binaryType
		this.bindWebSocketEvents(this._ws)
	}

	public destroy() {
		this._heartbeatTimer && clearInterval(this._heartbeatTimer)
		this._interruptReconnectTimer && clearTimeout(this._interruptReconnectTimer)

		if (this._ws) {
			this.close()
		}

		this._eventMap?.clear()
		this._eventMap = null
	}

	public on<T extends keyof EventType>(eventName: T, callback: (event: EventType[T]) => void) {
		if (!this._eventMap) return

		let set = this._eventMap.get(eventName)

		if (!set) {
			set = new Set()
		}

		set.add(callback)
		this._eventMap.set(eventName, set)
	}

	public off<T extends keyof EventType>(eventName: T, callback: (event: EventType[T]) => void) {
		if (!this._eventMap) return

		const set = this._eventMap.get(eventName)

		if (!set) return

		set.delete(callback)
	}

	public clear<T extends keyof EventType>(eventName: T) {
		if (!this._eventMap) return

		const set = this._eventMap.get(eventName)

		if (!set) return

		set.clear()
		this._eventMap.delete(eventName)
	}

	public sendMessage(message: string) {
		if (!this._ws) {
			console.error('error: websocket was not yet opened or was closed.')
			return
		}

		if (this._ws.readyState !== this._ws.OPEN) {
			console.error('error: can not send message, socket is not established.')
			return
		}

		this._ws.send(message)
	}
}

export default WebSocketLoader
