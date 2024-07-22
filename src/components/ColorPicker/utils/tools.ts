export function throttle(fn: Function, time: number = 200) {
	let timer: number | null = null
	return function (this: any) {
		const ctx = this
		const args = [...arguments]

		if (timer) {
			return
		} else {
			timer = setTimeout(() => {
				fn.apply(ctx, args)
				timer = null
			}, time)
		}
	}
}
