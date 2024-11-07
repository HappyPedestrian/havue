<template>
  <NotFound v-if="page.isNotFound"></NotFound>
  <!-- <Content v-else /> -->
  <DefaultTheme.Layout v-else></DefaultTheme.Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import NotFound from './components/NotFound.vue'
const { page } = useData()
</script>
