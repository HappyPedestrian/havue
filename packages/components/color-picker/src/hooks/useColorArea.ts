import type ColorConstruct from 'color'
import { ref, onMounted } from 'vue'
import Color from 'color'
import { hexToColor } from '../utils/color'

export function useColorArea() {
  const colorAreaCanvas = ref<HTMLCanvasElement>()
  /** canvas绘制宽度 */
  const canvasWidth = 255 * 6 + 1
  /** canvas绘制高度 */
  const canvasHeight = 256

  // 有颜色透明度属性，不是纯的rgb，有误差
  // let imageData: Uint8ClampedArray = [] as unknown as Uint8ClampedArray

  /**
   * 绘制canvas颜色区域
   * @returns
   */
  function drawColorArea(): void {
    if (!colorAreaCanvas.value) {
      return
    }
    const canvas = colorAreaCanvas.value

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // const colorStopList = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000']

    // for (let i = 0; i < colorStopList.length - 1; i++) {
    // 	const colorGradient = ctx.createLinearGradient(i * 255, 0, (i + 1) * 255, 0)
    // 	colorGradient.addColorStop(0, colorStopList[i])
    // 	colorGradient.addColorStop(1, colorStopList[i + 1])
    // 	ctx.fillStyle = colorGradient
    // 	ctx.fillRect(i * 255, 0, 255, canvasHeight)
    // }

    const colorGradient = ctx.createLinearGradient(0, 0, canvasWidth, 0)

    colorGradient.addColorStop(0, '#FF0000')
    colorGradient.addColorStop(1 / 6, '#FFFF00')
    colorGradient.addColorStop(1 / 3, '#00FF00')
    colorGradient.addColorStop(1 / 2, '#00FFFF')
    colorGradient.addColorStop(2 / 3, '#0000FF')
    colorGradient.addColorStop(5 / 6, '#FF00FF')
    colorGradient.addColorStop(1, '#FF0000')

    ctx.fillStyle = colorGradient

    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    const whiteGradient = ctx.createLinearGradient(0, canvasHeight, 0, 0)

    whiteGradient.addColorStop(0, 'rgb(255 255 255 / 100%)')
    whiteGradient.addColorStop(1, 'rgb(255 255 255 / 0%)')

    ctx.fillStyle = whiteGradient

    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  function getCoordinateByHex(hex: string) {
    const color = hexToColor(hex)
    return getCoordinateByColor(color)
  }

  /**
   * 该颜色在canvas中的位置
   * @param color ColorConstruct
   * @returns
   */
  function getCoordinateByColor(color: ColorConstruct) {
    const { r, g, b } = color.rgb().object()
    const colorItems = [
      {
        type: 'r',
        value: r
      },
      {
        type: 'g',
        value: g
      },
      {
        type: 'b',
        value: b
      }
    ]

    colorItems.sort((a, b) => b.value - a.value)

    const maxColor = colorItems[0]
    const secondColor = colorItems[1]
    const curColorType = maxColor.type + secondColor.type

    let coordinateX = 0
    const coordinateY = colorItems[2].value
    // debugger
    if (curColorType === 'rg' || curColorType === 'gr') {
      // 红绿
      coordinateX = 255
      if (secondColor.type === 'r') {
        coordinateX += 255 - getSecondColorDistance(coordinateY, secondColor.value)
      } else {
        coordinateX -= 255 - getSecondColorDistance(coordinateY, secondColor.value)
      }
    } else if (curColorType === 'gb' || curColorType === 'bg') {
      // 蓝绿
      coordinateX = 255 * 3
      if (secondColor.type === 'g') {
        coordinateX += 255 - getSecondColorDistance(coordinateY, secondColor.value)
      } else {
        coordinateX -= 255 - getSecondColorDistance(coordinateY, secondColor.value)
      }
    } else if (curColorType === 'rb' || curColorType === 'br') {
      // 红蓝
      coordinateX = 255 * 5
      if (secondColor.type === 'b') {
        coordinateX += 255 - getSecondColorDistance(coordinateY, secondColor.value)
      } else {
        coordinateX -= 255 - getSecondColorDistance(coordinateY, secondColor.value)
      }
    }

    return {
      x: coordinateX,
      y: coordinateY
    }
  }

  /**
   * 目标颜色：['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000']
   * 计算横向x，即颜色值（第二大的r/g/b值）在canvas中距离目标颜色的横向距离
   *  求x?
   *  已知：
   *  gap = 255 - x // gap为255 减去 在顶部距离目标颜色x处的颜色值
   *  scale = y / 255 // y为第三大的r/g/b值
   *  ∵
   *  gap * scale + x = target
   *  ∴
   *  x = (255 * target - 255 * y) / (255 - y)
   * @param y
   * @param target
   * @returns number
   */
  function getSecondColorDistance(y: number, target: number): number {
    return y === 255 ? 255 : (255 * target - 255 * y) / (255 - y)
  }

  /**
   * 根据canvas父级元素区域坐标获取在canvas中的颜色
   * @param x
   * @param y
   * @param width 坐标系宽度
   * @param height 坐标系高度
   * // 绘制的canvas颜色有偏差，且存在透明度（rgba），不为纯的rgb， 不使用imagedata，手动计算
   */
  function getColorByCoordinate(x: number, y: number, width: number, height: number): ColorConstruct {
    if (!colorAreaCanvas.value) {
      return Color()
    }
    const scaleX = canvasWidth / width
    const scaleY = canvasHeight / height
    x = Math.round(Math.min(x * scaleX, canvasWidth - 1))
    y = Math.round(Math.min(y * scaleY, canvasHeight - 1))
    const color = getBaseColorFromCoodinage(x, y)
    return color
  }

  /**
   * 根据在canvas中的坐标，计算该位置的颜色值
   * @param { number } x
   * @param { number } y
   * @returns number
   */
  function getBaseColorFromCoodinage(x: number, y: number) {
    /** r值 */
    let r = 0
    /** g值 */
    let g = 0
    /** b值 */
    let b = 0
    /** 颜色最大值 */
    const COLOR_GAP = 255

    /** 红色为255的区间 */
    const redRange = numberInGap(x, 0, COLOR_GAP) || numberInGap(x, COLOR_GAP * 5, COLOR_GAP * 6)

    /** 绿色为255的区间 */
    const greenRange = numberInGap(x, COLOR_GAP, COLOR_GAP * 3)

    /** 蓝色为255的区间 */
    const blueRange = numberInGap(x, COLOR_GAP * 3, COLOR_GAP * 5)

    if (redRange) {
      r = 255
    } else if (x <= COLOR_GAP * 2) {
      r = Math.max(2 * COLOR_GAP - x, 0)
    } else if (x >= COLOR_GAP * 4) {
      r = Math.max(x - COLOR_GAP * 4, 0)
    }

    if (greenRange) {
      g = 255
    } else if (x < COLOR_GAP) {
      g = Math.max(x, 0)
    } else {
      g = Math.max(COLOR_GAP * 4 - x, 0)
    }

    if (blueRange) {
      b = 255
    } else if (x < COLOR_GAP * 3) {
      b = Math.max(x - COLOR_GAP * 2, 0)
    } else {
      b = Math.max(COLOR_GAP * 6 - x, 0)
    }

    const rGap = COLOR_GAP - r
    const gGap = COLOR_GAP - g
    const bGap = COLOR_GAP - b

    const scale = y / COLOR_GAP

    r += rGap * scale
    g += gGap * scale
    b += bGap * scale

    return Color.rgb(r, g, b)
  }

  /**
   * 数值是否在区间内
   * @param { number } num
   * @param { number } begin
   * @param { number } end
   * @returns boolean
   */
  function numberInGap(num: number, begin: number, end: number) {
    return num >= begin && num <= end
  }

  onMounted(() => {
    drawColorArea()
  })

  return {
    canvasWidth,
    canvasHeight,
    colorAreaCanvas,
    drawColorArea,
    getCoordinateByColor,
    getCoordinateByHex,
    getColorByCoordinate
  }
}
