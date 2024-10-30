export function throttle<T extends (...args: any[]) => any>(fn: T, time: number = 200) {
  let timer: number | null = null
  return function (this: any, ...args: Parameters<T>) {
    const ctx = this

    if (timer) {
      return
    } else {
      timer = window.setTimeout(() => {
        fn.apply(ctx, args)
        timer = null
      }, time)
    }
  }
}
