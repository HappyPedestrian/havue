// #region template
<template>
  <div class="str-sort">
    <p>列表项:</p>
    <div class="orgin">
      <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
        {{ tag }}
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputValue"
        class="input"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showInput"> + New Tag </el-button>
    </div>
    <p>排序后:</p>
    <div class="after">
      <el-tag v-for="tag in sortedTags" :key="tag" :disable-transitions="false">
        {{ tag }}
      </el-tag>
    </div>
  </div>
</template>
// #endregion template
<!--  -->
// #region script
<script setup lang="ts">
import { nextTick, ref, computed } from 'vue'
import type { InputInstance } from 'element-plus'
import { stringSortFn } from '@havue/tools'

const inputValue = ref('')
const dynamicTags = ref(['aabc', '1abc', '阿abc', '3abc', '！2abc', '菜菜菜菜111', 'babc'])
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()

const sortedTags = computed(() => {
  const arr = [...dynamicTags.value]
  return arr.sort(stringSortFn)
})

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>
// #endregion script
<!--  -->
// #region style
<style lang="scss" scoped>
.str-sort {
  padding: 15px;
  background-color: cadetblue;

  .el-tag {
    margin-right: 5px;
  }

  .el-input {
    width: 100px;
  }
}
</style>
// #endregion style
