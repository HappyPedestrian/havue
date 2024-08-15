import type { WebSocketOptionsType } from '../loader/websocket-loader'
import { WebSocketLoader } from '../loader'
import { Render, RenderConstructorOptionType, DEFAULT_OPTIONS as RENDER_DEFAULT_OPTIONS } from '../render'

export type WsVideoManaCstorOptionType = {
	/** WebSocketLoader 实例配置 */
	wsOptions?: WebSocketOptionsType
	/** Render 实例配置 */
	renderOptions?: Partial<RenderConstructorOptionType>
}

const DEFAULT_OPTIONS: WsVideoManaCstorOptionType = {
	wsOptions: {
		binaryType: 'arraybuffer' as WebSocket['binaryType'],
	},
	renderOptions: RENDER_DEFAULT_OPTIONS,
}

type WsInfoType = {
	/** 需要绘制的canvas列表 */
	canvasSet: Set<HTMLCanvasElement>
	/** WebSocketLoader 实例 */
	socket: WebSocketLoader
	/** socket连接渲染render实例 */
	render: Render | undefined
}

export class WsVideoManager {
	/** socket连接 渲染相关对应信息 */
	private _wsInfoMap: Map<string, WsInfoType> = new Map()

	private _option: WsVideoManaCstorOptionType = {}

	constructor(options?: WsVideoManaCstorOptionType) {
		this._option = options ? Object.assign({}, DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS
	}

	/**
	 * 添加socket实例
	 * @param url
	 * @returns
	 */
	private addSocket(url: string) {
		if (this.isSocketExist(url)) {
			return
		}
		const socket = new WebSocketLoader(url, this._option.wsOptions)

		this._wsInfoMap.set(url, {
			socket,
			canvasSet: new Set(),
			render: undefined,
		})

		this.bindSocketEvent(url, socket)

		socket.open()
	}

	/**
	 * 销毁socket实例
	 * @param url
	 */
	private removeSocket(url: string) {
		let wsInfo = this._wsInfoMap.get(url)
		if (wsInfo) {
			let { socket } = wsInfo
			socket?.close()
			this._wsInfoMap.delete(url)
		}
	}

	/**
	 * 绑定socket事件
	 * @param url 连接地址
	 * @param socket WebSocketLoader实例
	 */
	private bindSocketEvent(url: string, socket: WebSocketLoader) {
		const render = new Render(this._option.renderOptions)
		const wsInfo = this._wsInfoMap.get(url)
		if (!wsInfo) {
			return
		}
		wsInfo.render = render

		render.setRenderFn((pixiCanvas: HTMLCanvasElement | HTMLVideoElement) => {
			const canvasSet = wsInfo.canvasSet

			if (!canvasSet || !canvasSet.size) {
				return
			}
			;[...canvasSet].forEach((canvas) => {
				const ctx = canvas.getContext('2d')
				if (!ctx) {
					return
				}
				ctx.drawImage(pixiCanvas, 0, 0, canvas.width, canvas.height)
			})
		})

		socket.on('message', (event: WebSocketEventMap['message']) => {
			render.appendMediaBuffer(event.data)
		})
	}

	/**
	 * url对应的 socket实例是否已存在
	 * @param url
	 * @returns boolean
	 */
	private isSocketExist(url: string): boolean {
		return this._wsInfoMap.has(url)
	}

	/**
	 * 添加url对应socket，以及需要绘制的canvas元素
	 * @param canvas canvas元素
	 * @param url socket url地址
	 */
	public addCanvas(canvas: HTMLCanvasElement, url: string) {
		this.addSocket(url)
		if (this.isCanvasExist(canvas)) {
			throw new Error('the canvas allready exsist! please remove it before add')
		}
		const wsInfo = this._wsInfoMap.get(url)
		if (!wsInfo) {
			return
		}
		const { canvasSet } = wsInfo
		if (!canvasSet) {
			wsInfo.canvasSet = new Set([canvas])
		} else {
			canvasSet.add(canvas)
		}

		this.updateCanvasMaxRect(wsInfo)
	}

	/**
	 * 更新canvas的最大宽高
	 * @param wsInfo
	 * @returns
	 */
	updateCanvasMaxRect(wsInfo: WsInfoType) {
		const { canvasSet, render } = wsInfo
		if (!render) {
			return
		}
		let maxCanvasWidth = 0
		let maxCanvasHeight = 0
		canvasSet.forEach((canvas) => {
			const { width, height } = canvas
			maxCanvasWidth = Math.max(maxCanvasWidth, width)
			maxCanvasHeight = Math.max(maxCanvasHeight, height)
		})

		render.setMaxCanvasRect(maxCanvasWidth, maxCanvasHeight)
	}

	/**
	 * 删除canvas元素
	 * @param canvas canvas元素
	 */
	public removeCanvas(canvas: HTMLCanvasElement) {
		const entries = this._wsInfoMap.entries()
		;[...entries].some(([url, wsInfo]) => {
			const { canvasSet } = wsInfo
			if (canvasSet.has(canvas)) {
				canvasSet.delete(canvas)
				if (canvasSet.size === 0) {
					this.removeSocket(url)
				}
				this.updateCanvasMaxRect(wsInfo)
				return true
			}
		})
	}

	/**
	 * 返回canvas是否已经添加过
	 * @param canvas
	 * @returns boolean
	 */
	public isCanvasExist(canvas: HTMLCanvasElement): boolean {
		const entries = this._wsInfoMap.entries()
		return [...entries].some(([_, info]) => {
			return info.canvasSet.has(canvas)
		})
	}

	/**
	 * 销毁
	 */
	public destroy() {
		this._wsInfoMap.forEach((wsInfo) => {
			const { socket } = wsInfo
			socket.close()
			socket.destroy()
		})
		this._wsInfoMap.clear()
	}
}
