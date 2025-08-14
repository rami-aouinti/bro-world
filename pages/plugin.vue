<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <BasisMinibar></BasisMinibar>
      </teleport>
    </client-only>
    <template v-if="loadingUser">
      <LoaderPlugin  />
    </template>
    <template v-else>
      <v-row dense>
        <v-col
          v-for="plugin in plugins"
          class="mb-2"
          :key="plugin.key"
          cols="12"
          sm="6"
          md="4"
        >
          <PluginList :plugin="plugin" @open="openPlugin(plugin)" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PluginList from "~/components/PluginList.vue"
import LoaderPlugin from "~/components/App/Loader/Plugin/LoaderPlugin.vue";
import { ref, onMounted, nextTick, watch } from 'vue'
import BasisMinibar from "~/components/App/BasisMinibar.vue";
const { t, locale } = useI18n()

const loadingUser = ref(true)
const canTeleport = ref(false)

definePageMeta({
  layout: 'default',
  breadcrumb: 'disabled',
  title: 'Plugins',
  description: 'Explore and manage plugins to enhance your application functionality.',
  meta: [
    { name: 'description', content: 'Explore and manage plugins to enhance your application functionality.' },
    { name: 'keywords', content: 'plugins, extensions, functionality' },
  ],
  head: {
    title: 'Plugins',
    meta: [
      { name: 'description', content: 'Explore and manage plugins to enhance your application functionality.' },
      { name: 'keywords', content: 'plugins, extensions, functionality' },
    ],
  },
  scrollToTop: true,
})

const plugins = ref<any[]>([])
const fetchPlugins = async () => {
  const { data } = await useFetch('/api/plugin/')
  if (data.value) {
    plugins.value = data.value
    loadingUser.value = false
  }
}
watch(!plugins.value, () => {
  fetchPlugins()
}, { immediate: true })

function openPlugin(plugin: any) {
  // on suppose plugin.key (ou plugin.slug)
  navigateTo(`/plugins/${plugin.key}`)
}
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  await fetchPlugins
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})
</script>
