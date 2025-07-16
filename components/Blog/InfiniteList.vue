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

const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return
  isLoading.value = true

  try {
    const response = await fetch(`${props.fetchUrl}?page=${page.value}&limit=${props.limit || 5}`)
    const result = await response.json()

    if (result.data && result.data.length) {
      pending.value = false
      items.value.push(...result.data)
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
  <div v-if="pending">
    <v-col cols="12" md="12" lg="12" v-for="n in 6" :key="n">
      <v-skeleton-loader
        type="card"
        class="pa-4 rounded-xl"
        height="200"
        rounded="xl"
      />
    </v-col>
  </div>

  <slot :items="items" :isLoading="isLoading" :hasMore="hasMore && !pending" />

  <div class="d-flex justify-center mt-4" v-if="hasMore && !pending">
    <v-btn color="primary" :loading="isLoading" @click="loadMore">
      Load more
    </v-btn>
  </div>
</template>
