// import { Application, Sprite, UPDATE_PRIORITY } from 'pixi.js'
import MP4Box from 'mp4box'

export type RenderConstructorOptionType = {
	/** 当前播放currentTime和最新视频时长最多相差 秒数 */
	liveMaxLatency: number
	/** 最多存储的时间，用于清除在currentTime之前x秒时间节点前的buffer数据 */
	maxCache: number
}

export const DEFAULT_OPTIONS = {
	liveMaxLatency: 3,
	maxCache: 8,
}

export class Render {
	/** video元素 */
	private _videoEl: HTMLVideoElement = document.createElement('video')
	/** pixi.js 实例 */
	// private _pixiApp: Application | null = null
	/** mp4box 实例 */
	private _mp4box: MP4Box = MP4Box.createFile()
	/** 接收到的socket消息 视频数据buffer数组 */
	private _bufsQueue: ArrayBuffer[] = []
	/** MediaSource 实例 */
	private _mediaSource: MediaSource | undefined
	/** SourceBuffer 实例 */
	private _sourceBuffer: SourceBuffer | undefined
	/** 上次sourcebuffer buffer段结束时间列表 ：[100, 200]*/
	private _lastSourceBufferedEndList: Array<number> = []
	/** 用于MediaSource的mimeType */
	private _mimeType: string = ''
	public readonly _options: RenderConstructorOptionType

	private _videoOriginWidth: number = 0
	private _videoOriginHeight: number = 0
	private _maxCanvasWidth: number | undefined = undefined
	private _maxCanvasHeight: number | undefined = undefined
	/** pixi.js ticker函数 */
	public onRender: (canvas: HTMLCanvasElement | HTMLVideoElement) => void = (_: HTMLCanvasElement | HTMLVideoElement) => {}

	constructor(options: Partial<RenderConstructorOptionType> = {}) {
		this._options = options ? Object.assign({}, DEFAULT_OPTIONS, options) : DEFAULT_OPTIONS
		this._mp4box.onReady = this._onMp4boxReady.bind(this)

		// const drawTest = () => {
		// 	let canvas = document.getElementById('testCanvasId')
		// 	const ctx = canvas.getContext('2d')
		// 	ctx.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height)
		// 	requestAnimationFrame(drawTest)
		// }
		// drawTest()
	}

	/**
	 * 更新video元素宽高
	 */
	_updateVideoRect() {
		console.log('_updateVideoRect', this._maxCanvasWidth, this._maxCanvasHeight, this._videoOriginWidth, this._videoOriginHeight)
		const minWidth = this._maxCanvasWidth ? Math.min(this._videoOriginWidth, this._maxCanvasWidth) : this._videoOriginWidth
		const minHeight = this._maxCanvasHeight ? Math.min(this._videoOriginHeight, this._maxCanvasHeight) : this._videoOriginHeight

		const originRate = this._videoOriginWidth / this._videoOriginHeight

		const currentRate = minWidth / minHeight

		let width = minWidth
		let height = minHeight

		if (originRate > currentRate) {
			width = minHeight * originRate
		} else if (originRate < currentRate) {
			height = minWidth / originRate
		}

		this._videoEl.width = width
		this._videoEl.height = height
	}

	/**
	 * 设置最大的canvas宽高
	 * @param width
	 * @param height
	 */
	public setMaxCanvasRect(width: number, height: number) {
		this._maxCanvasWidth = width
		this._maxCanvasHeight = height
		this._updateVideoRect()
	}

	/**
	 * 设置pixi.js的ticker render函数
	 * @param fn
	 */
	public setRenderFn(fn: (canvas: HTMLCanvasElement | HTMLVideoElement) => void) {
		this.onRender = fn
	}

	/**
	 * 添加视频流buffer数据
	 * @param buf
	 */
	public appendMediaBuffer(buf: ArrayBuffer & { fileStart: number }) {
		if (!this._sourceBuffer) {
			buf.fileStart = 0
			this._mp4box.appendBuffer(buf)
		}
		this._bufsQueue.push(buf)
		this._catch()
	}

	/**
	 * mp4box解析完成
	 * @param info
	 */
	private _onMp4boxReady(info: any) {
		console.log('onMp4boxReady', info)
		this._mp4box.flush()
		if (!info.isFragmented) {
			console.error('not fragmented mp4')
			return
		}
		const videoTrack = info.videoTracks[0]
		this._mimeType = info.mime
		const { track_width = 640, track_height = 320 } = videoTrack || {}
		this._videoOriginWidth = track_width
		this._videoOriginHeight = track_height
		this._setupVideo()
		// this.setupPixi()
		this._setupRender()
	}

	/**
	 * canvas绘制循环
	 */
	private _setupRender() {
		const render = () => {
			this.onRender(this._videoEl)
			requestAnimationFrame(render)
		}
		render()
		this._setupMSE()
	}

	// /**
	//  * 初始化pixi实例
	//  * @param width
	//  * @param height
	//  */
	// private setupPixi() {
	// 	this._pixiApp = new Application()
	// 	const videoSprite = Sprite.from(this._videoEl)
	// 	this._pixiApp.stage.addChild(videoSprite)
	// 	this._pixiApp
	// 		.init({
	// 			resizeTo: this._videoEl,
	// 			// height: this._videoEl.height,
	// 			// width: this._videoEl.width,
	// 			backgroundColor: 0x000000,
	// 			clearBeforeRender: true,
	// 		})
	// 		.then(() => {
	// 			if (!this._pixiApp) {
	// 				return
	// 			}
	// 			document.body.appendChild(this._pixiApp.canvas)
	// 			this._pixiApp.ticker.add(
	// 				() => {
	// 					if (!this._pixiApp) {
	// 						return
	// 					}
	// 					this.onRender(this._pixiApp.canvas)
	// 				},
	// 				null,
	// 				UPDATE_PRIORITY.UTILITY
	// 			)
	// 			this._setupMSE()
	// 		})
	// }

	/**
	 * 初始化视频元素
	 */
	private _setupVideo() {
		this._updateVideoRect()
		this._videoEl.preload = 'metadata'
		this._videoEl.controls = false
		this._videoEl.muted = true
		this._videoEl.autoplay = true
		this._videoEl.loop = false
		this._videoEl.crossOrigin = 'anonymous'
		this._videoEl.playsInline = true
		// this._videoEl['webkit-playsinline'] = true
		// document.body.appendChild(this._videoEl)
	}

	/**
	 * 是否支持Media Source Extention
	 * @returns boolean
	 */
	public isSupportMSE() {
		return 'MediaSource' in window
	}

	/**
	 * 初始化MSE
	 * @returns
	 */
	private _setupMSE(): void {
		if (!this.isSupportMSE()) {
			console.error('your borwser do not support MediaSource')
			return
		}
		if (!MediaSource.isTypeSupported(this._mimeType)) {
			console.error('Unsupported MIME type or codec: ', this._mimeType)
			return
		}
		this._mediaSource = new MediaSource()
		URL.revokeObjectURL(this._videoEl.src)
		this._videoEl.src = URL.createObjectURL(this._mediaSource)

		this._mediaSource.addEventListener('sourceopen', () => {
			const sourceBuffer = (this._sourceBuffer = this._mediaSource!.addSourceBuffer(this._mimeType))
			sourceBuffer.onupdateend = () => {
				const currentTime = this._videoEl.currentTime
				if (sourceBuffer.buffered.length > 0) {
					// console.log('this._lastSourceBufferedEndList.length:', this._lastSourceBufferedEndList.length)
					let bufferedLen = sourceBuffer.buffered.length
					/** 是否需要删除sourceBuffer中的buffer段 */
					let needDelBuf = bufferedLen !== this._lastSourceBufferedEndList.length
					/** 保存此次的sourceBuffer 各段的 结尾时间 */
					let bufferedEndList: Array<number> = []

					for (let i = 0; i < bufferedLen; i++) {
						const curEnd = sourceBuffer.buffered.end(i)

						if (needDelBuf) {
							console.log(
								'buffer',
								i,
								'start:',
								sourceBuffer.buffered.start(i),
								'end:',
								sourceBuffer.buffered.end(i),
								'last',
								this._lastSourceBufferedEndList,
								'currentTime:',
								currentTime
							)
						}

						if (needDelBuf && this._lastSourceBufferedEndList.includes(curEnd)) {
							const curStart = sourceBuffer.buffered.start(i)
							if (!this._sourceBuffer!.updating) {
								this._sourceBuffer?.remove(curStart, curEnd)
							}
							continue
						}

						bufferedEndList.push(sourceBuffer.buffered.end(i))
					}

					bufferedLen = sourceBuffer.buffered.length
					const start = sourceBuffer.buffered.start(bufferedLen - 1)
					const end = sourceBuffer.buffered.end(bufferedLen - 1)
					// console.log('current burreend len: ', bufferedLen, start, end, currentTime)

					// 设置开始时间
					if (!currentTime && start) {
						this._videoEl.currentTime = start
						return
					}
					if (currentTime > end) {
						this._videoEl.currentTime = start
					}

					// 限制最低延迟时间
					if (this._options.liveMaxLatency) {
						const offsetMaxLatency = this._options.liveMaxLatency

						if (end - currentTime > offsetMaxLatency) {
							this._videoEl.currentTime = end - offsetMaxLatency
						}
					}
					// 移除当前时间之前的buffer
					if (!this._sourceBuffer!.updating && currentTime - start > this._options.maxCache) {
						this._sourceBuffer?.remove(0, currentTime - this._options.maxCache)
					}
					this._lastSourceBufferedEndList = bufferedEndList
				}
			}
		})
	}

	/**
	 * 将_bufsQueue中的数据添加到SourceBuffer中
	 * @returns
	 */
	private _catch() {
		if (!this._sourceBuffer || this._sourceBuffer.updating || !this._bufsQueue.length) {
			return
		}
		let frame = null
		if (this._bufsQueue.length > 1) {
			let freeBuffer = this._bufsQueue.splice(0, this._bufsQueue.length)
			let length = freeBuffer.map((e) => e.byteLength).reduce((a, b) => a + b, 0)
			let buffer = new Uint8Array(length)
			let offset = 0
			for (let data of freeBuffer) {
				let frame = new Uint8Array(data)
				buffer.set(frame, offset)
				offset += data.byteLength
			}
			frame = buffer
		} else {
			frame = this._bufsQueue.shift()
		}

		if (frame) {
			this._sourceBuffer.appendBuffer(frame)
		}
	}
}
