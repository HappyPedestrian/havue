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
import { isValidIPItemValue, getRange } from './utils/index'

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
    modelValue: string | Array<string | number> | undefined
    disabled?: boolean
  }>(),
  {
    modelValue: '...',
    disabled: false
  }
)

const inputRefs = ref()

const values = ref<string[]>([])

watch(
  () => props.modelValue,
  (value) => {
    if (!Array.isArray(value)) {
      value = value + ''
      value = value.split('.')
    }
    values.value = Array(4)
      .fill('')
      .map((_, i) => {
        const num = parseInt(value[i] + '')
        return !isValidIPItemValue(num) ? '' : num + ''
      })
  },
  {
    immediate: true
  }
)

function onIPChange() {
  const ip = values.value.map((val) => (isNaN(Number(val)) ? '' : val)).join('.')
  return emits('update:model-value', ip)
}

function handleChange(e: ChangeEvent, i: number) {
  const curValue = e.target.value
  let num = parseInt(curValue)
  // 如果无法转换为int，设置为''
  if (isNaN(num)) {
    values.value[i] = ''
    e.target.value = ''
    onIPChange()
    return e.preventDefault()
  }

  // 不在[0, 255],设置为255
  if (!isValidIPItemValue(num)) {
    num = 255
  }

  values.value[i] = num + ''
  e.target.value = num + ''
  onIPChange()

  if (String(num).length === 3 && i < 3) {
    inputRefs.value[i + 1]?.focus()
  }
}

/**
 * 监听键盘←、→、backspace、. 按下时进行处理
 * @param { InputKeyboardEvent } e
 * @param { number } i 输入框index
 */
function handleKeyDown(e: InputKeyboardEvent, i: number) {
  /* 37 = ←, 39 = →, 8 = backspace, 110 or 190 = . */
  let domId = i
  const { end } = getRange(e.target)
  switch (e.keyCode) {
    case 37:
    case 8: {
      // 左移或删除
      if (end === 0 && i > 0) {
        domId = i - 1
      }
      break
    }
    case 39: {
      // 右移
      if (end === e.target.value.length && i < 3) {
        domId = i + 1
      }
      break
    }
    case 110:
    case 190: {
      // 输入.
      e.preventDefault()
      if (i < 3) {
        domId = i + 1
      }
      break
    }
  }
  inputRefs.value[domId].focus()
}

/**
 * 处理粘贴ip字符串事件
 * @param { ClipboardEvent } e
 * @param { number } i 输入框index
 */
function handlePaste(e: ClipboardEvent, i: number) {
  if (!e.clipboardData || !e.clipboardData.getData) {
    return
  }

  const pasteData = e.clipboardData.getData('text/plain')
  if (!pasteData) {
    return
  }

  const value = pasteData.split('.').map((v) => parseInt(v))
  if (value.length !== 4 - i) {
    return
  }

  if (!value.every(isValidIPItemValue)) {
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
  background-color: #131519;
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
    background-color: #262727;

    input {
      cursor: not-allowed;
    }
  }

  .hv-ip-input-item {
    display: inline-block;
  }
}
</style>
