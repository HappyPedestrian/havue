<template>
  <div class="ip-input-demo">
    <HvIpInput v-model="ip"></HvIpInput>
    <p>disabled:</p>
    <HvIpInput :model-value="ip" disabled></HvIpInput>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HvIpInput } from '@havue/components'

const ip = ref('')
</script>

<style lang="scss"></style>
