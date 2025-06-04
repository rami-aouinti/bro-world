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
    await delay(100)
    const { data, error } = await useFetch(`${props.fetchUrl}?page=${page.value}&limit=${props.limit || 5}`, {
      key: `${props.fetchUrl}-page-${page.value}`,
      server: false,
    })

    if (data.value) {
      const result = data.value || []
      if (result.length) {
        items.value.push(...result)
        emit('loaded', items.value)
      }

      if (result.length === 0) {
        hasMore.value = false
      } else {
        page.value++
      }
    } else {
      console.error(error.value)
      hasMore.value = false
    }
  } catch (err) {
    console.error('Unexpected error in loadMore:', err)
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

  <div class="d-flex justify-center mt-4" v-if="hasMore">
    <v-btn color="primary" :loading="isLoading" @click="loadMore">
      Load more
    </v-btn>
  </div>
</template>
