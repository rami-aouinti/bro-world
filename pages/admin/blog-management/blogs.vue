<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import type { DataTableHeaders } from '~/plugins/vuetify'
import ReusableDataTable from '~/components/Admin/ReusableDataTable.vue'
definePageMeta({
  title: 'Blogs',
  icon: 'mdi-settings',
  requiresAdmin: true,
  drawerIndex: 2,
})
import { useBlogStore } from '~/stores/admin/blog/blogStore'
const blogStore = useBlogStore()
const loading = ref(true)
const search = ref('')
const blogs = ref<any[]>([])
const headers: DataTableHeaders = [
  { title: 'ID', key: 'id', type: 'text', list: false, show: true ,create: false, edit: false },
  { title: 'Logo', key: 'logo', type: 'image', list: true, show: true, create: true, edit: true },
  { title: 'Title', key: 'title', type: 'text', list: true, show: true ,create: true, edit: true },
  { title: 'Subtitle', key: 'blogSubtitle', type: 'text', list: true, show: true ,create: true, edit: true },
  { title: '', key: 'actions', list: false, show: false ,create: false, edit: false,  sortable: false, align: 'end' },
]
async function fetchBlogs() {
  try {
    const data = await blogStore.fetchBlogs()
    if (data) {
      blogs.value = data
    }
    loading.value = false
  } catch (e) {
    console.error('Failed to load configurations :', e)
  }
}
watch(loading, () => {
  fetchBlogs()
}, { immediate: true })
onMounted(fetchBlogs)
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
      label="Blog Management"
      :headers="headers"
      urlCreate="/api/admin/configuration/create/configuration"
      urlEdit="/api/admin/configuration/edit/configuration"
      urlDelete="/api/admin/configuration/delete/configuration"
      :items="blogs || []"
      :loading="loading"
      :create="true"
      :search="search"
      @refresh="fetchBlogs"
    />
  </v-container>
</template>
