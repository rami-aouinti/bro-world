<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import type { DataTableHeaders } from '~/plugins/vuetify'
import ReusableDataTable from '~/components/Admin/ReusableDataTable.vue'
definePageMeta({
  title: 'Posts',
  icon: 'mdi-settings',
  requiresAdmin: true,
  drawerIndex: 3,
})
import { usePostStore } from '~/stores/admin/blog/postStore'
const postStore = usePostStore()
const loading = ref(true)
const search = ref('')
const posts = ref<any[]>([])
const headers: DataTableHeaders = [
  { title: 'ID', key: 'id', type: 'text', list: false, show: true ,create: false, edit: false },
  { title: 'Title', key: 'title', type: 'text', list: true, show: true ,create: true, edit: true },
  { title: 'Date', key: 'publishedAt', type: 'date', list: true, show: true ,create: true, edit: true },
  { title: '', key: 'actions', list: false, show: false ,create: false, edit: false,  sortable: false, align: 'end' },
]
async function fetchPosts() {
  try {
    const data = await postStore.fetchPosts()
    if (data) {
      posts.value = data
    }
    loading.value = false
  } catch (e) {
    console.error('Failed to load configurations :', e)
  }
}
watch(loading, () => {
  fetchPosts()
}, { immediate: true })
onMounted(await fetchPosts)
</script>
<template>
  <v-container fluid>
    <client-only>
      <teleport to="#app-bar">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          density="compact"
          class="mr-2"
          rounded="xl"
          flat
          variant="solo"
          style="width: 250px"
        />
      </teleport>
    </client-only>

    <ReusableDataTable
      label="Posts Management"
      :headers="headers"
      urlCreate="/api/admin/configuration/create/configuration"
      urlEdit="/api/admin/configuration/edit/configuration"
      urlDelete="/api/admin/configuration/delete/configuration"
      :items="posts || []"
      :loading="loading"
      :create="true"
      :search="search"
      @refresh="fetchPosts"
    />
  </v-container>
</template>
