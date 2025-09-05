<template>
  <div class="hv-ip-input" :class="props.disabled ? 'is-disabled' : ''">
    <div class="hv-ip-input-item" v-for="(value, i) in values" :key="i">
      <input
        ref="inputRefs"
        type="text"
        :value="value"
        :disabled="props.disabled"
        @input="(e) => handleChange(e as ChangeEvent, i)"
        @keydown="(e) => handleKeyDown(e as InputKeyboardEvent, i)"
        @paste="(e) => handlePaste(e, i)"
      />
      <i v-if="i !== 3">.</i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getValidIPItemValue, getRange } from './utils/index'

interface ChangeEvent extends Event {
  target: HTMLInputElement
}

interface InputKeyboardEvent extends KeyboardEvent {
  target: HTMLInputElement
}

defineOptions({
  name: 'HvIpInput'
})

const emits = defineEmits<{
  (name: 'update:model-value', value: string): void
}>()

const props = withDefaults(
  defineProps<{
    modelValue: string | undefined
    disabled?: boolean
  }>(),
  {
    modelValue: '...',
    disabled: false
  }
)

const inputRefs = ref<Array<HTMLInputElement>>([])

const values = ref<string[]>([])

watch(
  () => props.modelValue,
  (value) => {
    value = value + ''
    const strs = value.split('.')
    values.value = Array(4)
      .fill('')
      .map((_, i) => {
        return getValidIPItemValue(strs[i] + '')
      })
  },
  {
    immediate: true
  }
)

function onIPChange() {
  const ip = values.value.map((val) => getValidIPItemValue(val)).join('.')
  return emits('update:model-value', ip)
}

function handleChange(e: ChangeEvent, i: number) {
  const curValue = e.target.value
  const num = getValidIPItemValue(curValue)

  values.value[i] = num
  e.target.value = num
  onIPChange()
  if (num === '') {
    return e.preventDefault()
  }

  if (String(num).length === 3 && i < 3) {
    inputRefs.value[i + 1]?.focus()
  }
}

/**
 * 监听键盘←、→、backspace、. 按下时进行处理 | Listen to the keyboard ←, →, backspace, and. When pressed
 * @param { InputKeyboardEvent } e
 * @param { number } i 输入框index | Input field index
 */
function handleKeyDown(e: InputKeyboardEvent, i: number) {
  /* 37 = ←, 39 = →, 8 = backspace, 110 or 190 = . */
  let domId = i
  const { end } = getRange(e.target)
  switch (e.keyCode) {
    case 37:
    case 8: {
      // 左移或删除 | Move left or delete
      if (end === 0 && i > 0) {
        domId = i - 1
      }
      break
    }
    case 39: {
      // 右移 | Move right
      if (end === e.target.value.length && i < 3) {
        domId = i + 1
      }
      break
    }
    case 110:
    case 190: {
      // 输入'.' | input '.'
      e.preventDefault()
      if (i < 3) {
        domId = i + 1
      }
      break
    }
  }
  const inputEl = inputRefs.value[domId]
  inputEl.focus()
  // 确保删除或者左右移动连续，避免切换input focus，光标位置会保持在上一次聚焦位置的问题
  // Make sure to delete or move left and right continuously to avoid the problem of switching input focus, the cursor position will remain at the last focus position
  if (domId < i) {
    const len = inputEl.value.length
    inputEl.selectionStart = inputEl.selectionEnd = len
  } else if (domId > i) {
    inputEl.selectionStart = inputEl.selectionEnd = 0
  }
}

/**
 * 处理粘贴ip字符串事件 | Handle the paste ip string event
 * @param { ClipboardEvent } e
 * @param { number } i 输入框index | Input field index
 */
function handlePaste(e: ClipboardEvent, i: number) {
  if (!e.clipboardData || !e.clipboardData.getData) {
    return
  }

  const pasteData = e.clipboardData.getData('text/plain')
  if (!pasteData) {
    return
  }

  const value = pasteData.split('.').map((v) => getValidIPItemValue(v))
  if (value.length !== 4 - i) {
    return
  }

  if (!value.every((item) => item !== '')) {
    return
  }

  value.forEach((val, j) => {
    values.value[i + j] = val + ''
  })

  onIPChange()
  return e.preventDefault()
}
</script>

<style lang="scss" scoped>
.hv-ip-input {
  display: inline-block;
  padding: 6px 8px;
  font-size: 14px;
  line-height: 19px;
  outline: none;
  border: 1px solid #373d48;
  border-radius: 4px;

  input {
    width: 30px;
    text-align: center;
    outline: none;
    background-color: transparent;
    border: none;
  }

  &.is-disabled {
    cursor: not-allowed;

    input {
      cursor: not-allowed;
    }
  }

  .hv-ip-input-item {
    display: inline-block;
  }
}
</style>
