import { WebSocketLoader } from '../loader'
import type { WebSocketOptionsType } from '../loader/websocket-loader'
import { Render, RenderConstructorOptionType } from '../render'

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
	renderOptions: {},
}

export class WsVideoManager {
	/** socket实例对应的canvas列表 */
	private _wsCanvasMap: Map<string, Set<HTMLCanvasElement>> = new Map()
	/** websocket实例 Map */
	private _wsMap: Map<string, WebSocketLoader> = new Map()

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

		this.bindSocketEvent(url, socket)

		this._wsMap.set(url, socket)

		socket.open()
	}

	/**
	 * 销毁socket实例
	 * @param url
	 */
	private removeSocket(url: string) {
		let socket = this._wsMap.get(url)
		socket?.close()
		socket = undefined
		this._wsMap.delete(url)
	}

	/**
	 * 绑定socket事件
	 * @param socket
	 */
	private bindSocketEvent(url: string, socket: WebSocketLoader) {
		const render = new Render(this._option.renderOptions)
		render.setRenderFn((pixiCanvas: HTMLCanvasElement) => {
			const canvasList = this._wsCanvasMap.get(url)
			if (!canvasList) {
				return
			}
			;[...canvasList].forEach((canvas) => {
				const ctx = canvas.getContext('2d')
				if (!ctx) {
					return
				}
				ctx.drawImage(pixiCanvas, 0, 0, pixiCanvas.width, pixiCanvas.height, 0, 0, canvas.width, canvas.height)
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
		return this._wsMap.has(url)
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
		let canvasList = this._wsCanvasMap.get(url)
		if (!canvasList) {
			this._wsCanvasMap.set(url, new Set([canvas]))
		} else {
			canvasList.add(canvas)
		}
	}

	/**
	 * 删除canvas元素
	 * @param canvas canvas元素
	 */
	public removeCanvas(canvas: HTMLCanvasElement) {
		const entries = this._wsCanvasMap.entries()
		;[...entries].some(([url, canvasSet]) => {
			if (canvasSet.has(canvas)) {
				canvasSet.delete(canvas)
				// 已没有要使用的canvas
				if (canvasSet.size === 0) {
					this.removeSocket(url)
					this._wsCanvasMap.delete(url)
				}
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
		const entries = this._wsCanvasMap.entries()
		return [...entries].some(([_, canvasSet]) => {
			return canvasSet.has(canvas)
		})
	}

	/**
	 * 销毁
	 */
	public destroy() {
		this._wsCanvasMap.clear()
		this._wsMap.forEach((socket) => {
			socket.close()
			socket.destroy()
		})
		this._wsMap.clear()
	}
}
