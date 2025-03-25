/**
 * 绘制视频到canvas中
 */
class CanvasDrawer {
  private _canvas: HTMLCanvasElement | null = null
  private _useGl: boolean = false
  private _ctx2d: CanvasRenderingContext2D | null = null
  private _gl: WebGLRenderingContext | null = null
  private _program: WebGLProgram | null = null
  private _positionBuffer: WebGLBuffer | null = null
  private _texCoordBuffer: WebGLBuffer | null = null
  private _texture: WebGLTexture | null = null
  private _positionLocation: number = -1
  private _texCoordLocation: number = -1
  private _textureLocation: WebGLUniformLocation | null = null
  private _glReady: boolean = false

  constructor(canvas: HTMLCanvasElement, useWebgl: boolean = false) {
    this._canvas = canvas
    this._useGl = useWebgl
    if (useWebgl) {
      this.initGl()
    } else {
      this.init2d()
    }
  }

  private init2d() {
    if (!this._canvas) return
    this._ctx2d = this._canvas.getContext('2d')
    if (!this._ctx2d) {
      return
    }
    this._ctx2d.fillStyle = 'black'
    this._ctx2d.fillRect(0, 0, this._canvas.width, this._canvas.height)
  }

  /**
   * 初始化 webgl
   */
  private initGl() {
    if (!this._canvas) return

    // 初始化 gl
    this._gl = this._canvas.getContext('webgl') || this._canvas.getContext('webgl2')
    if (!this._gl) {
      console.error('WebGL not supported')
      this._useGl = false
      this.init2d()
      return
    }

    const gl = this._gl!

    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, this.createShaderSource(gl, gl.VERTEX_SHADER))
    const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, this.createShaderSource(gl, gl.FRAGMENT_SHADER))

    if (!vertexShader || !fragmentShader) return

    const program = this.createProgram(gl, vertexShader, fragmentShader)

    if (!program) return

    // 坐标缓冲
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

    // 纹理坐标缓冲
    const texCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW)

    // 纹理
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    // 着色器变量的引用
    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
    const textureLocation = gl.getUniformLocation(program, 'u_texture')

    // 缓存数据
    this._program = program
    this._positionBuffer = positionBuffer
    this._texCoordBuffer = texCoordBuffer
    this._texture = texture
    this._positionLocation = positionLocation
    this._texCoordLocation = texCoordLocation
    this._textureLocation = textureLocation

    // 设置标志
    this._glReady = true
  }

  /**
   * 创建着色器源码
   */
  private createShaderSource(gl: WebGLRenderingContext, type: number) {
    // 顶点着色器
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(-a_position.x, -a_position.y, 0.0, 1.0);
        v_texCoord = vec2(1.0 - a_texCoord.x, a_texCoord.y);
      }
    `

    // 片段着色器
    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_texture;
      void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
      }
    `

    if (type === gl.VERTEX_SHADER) {
      return vertexShaderSource
    } else {
      return fragmentShaderSource
    }
  }

  /**
   * 创建着色器
   */
  private createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)

    if (!shader) {
      return null
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!success) {
      gl.deleteShader(shader)
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))

      return null
    }

    return shader
  }

  /**
   * 创建着色器程序
   */
  private createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = gl.createProgram()

    if (!program) {
      return null
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!success) {
      console.error('An error occurred linking the program: ' + gl.getProgramInfoLog(program))
      gl.deleteProgram(program)

      return null
    }

    return program
  }

  /**
   * 绘制
   */
  public draw(video: HTMLVideoElement) {
    if (this._useGl) {
      if (!this._glReady || !this._canvas) return
      const gl = this._gl!
      const program = this._program!
      const positionBuffer = this._positionBuffer!
      const texCoordBuffer = this._texCoordBuffer!
      const texture = this._texture!
      const positionLocation = this._positionLocation
      const texCoordLocation = this._texCoordLocation
      const textureLocation = this._textureLocation!

      // 更新视口区域
      gl.viewport(0, 0, this._canvas.width, this._canvas.height)

      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return

      // 更新纹理
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)

      // 清理画布
      gl.clear(gl.COLOR_BUFFER_BIT)

      // 使用着色器程序
      gl.useProgram(program)

      // 设置着色器变量对应的 buffer 数据
      gl.enableVertexAttribArray(positionLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      gl.enableVertexAttribArray(texCoordLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
      gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

      gl.uniform1i(textureLocation, 0)

      // 绘制(两个三角形六个顶点, 组成一个矩形)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    } else {
      const ctx = this._ctx2d
      const canvas = this._canvas
      if (!ctx || !canvas) {
        return
      }
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }
  }

  /**
   * 销毁
   */
  public destroy() {
    this._canvas = null
    this._useGl = false
    this._ctx2d = null
    this._gl = null
    this._program = null
    this._positionBuffer = null
    this._texCoordBuffer = null
    this._texture = null
    this._positionLocation = -1
    this._texCoordLocation = -1
    this._textureLocation = null
    this._glReady = false
  }
}

export { CanvasDrawer }
