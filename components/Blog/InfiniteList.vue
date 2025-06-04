<script setup lang="ts">
import { ref, onMounted, defineExpose } from 'vue'

const props = defineProps<{
  fetchUrl: string
  limit?: number
}>()

const emit = defineEmits(['loaded'])

const items = ref<any[]>([])
const page = ref(1)
const hasMore = ref(true)
const isLoading = ref(false)
const pending = ref(true)

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true

  try {
    await delay(4)

    const response = await fetch(`${props.fetchUrl}?page=${page.value}&limit=${props.limit || 5}`)
    const result = await response.json()

    if (result && result.length) {
      items.value.push(...result)
      emit('loaded', items.value)
      page.value++
    } else {
      hasMore.value = false
    }

  } catch (err) {
    console.error('Fetch error:', err)
    hasMore.value = false
  }

  isLoading.value = false
  pending.value = false
}

onMounted(async () => {
  await loadMore()
})

defineExpose({ items, isLoading, hasMore, loadMore })
</script>

<template>
  <div v-if="pending" class="d-flex justify-center align-center" style="height: 25vh">
    <v-progress-circular :size="120" :width="10" color="primary" indeterminate />
  </div>

  <slot :items="items" :isLoading="isLoading" :hasMore="hasMore && !pending" />

  <div class="d-flex justify-center mt-4" v-if="hasMore && !pending">
    <v-btn color="primary" :loading="isLoading" @click="loadMore">
      Load more
    </v-btn>
  </div>
</template>
