<template>
  <v-container fluid>
    <template v-if="loadingUser">
      <LoaderPlugin  />
    </template>
    <template v-else>
      <v-row dense>
        <v-col
          v-for="plugin in plugins"
          :key="plugin.key"
          cols="12"
          sm="6"
          md="4"
        >
          <PluginList :plugin="plugin" />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PluginList from "~/components/PluginList.vue"
import LoaderPlugin from "~/components/App/Loader/Plugin/LoaderPlugin.vue";
import { ref, onMounted } from 'vue'
const { t, locale } = useI18n()

const loadingUser = ref(true)

definePageMeta({ layout: 'default', breadcrumb: 'disabled', description: 'Plugin page' })

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

onMounted(fetchPlugins)
</script>

<style scoped>
.text-end {
  direction: rtl;
  text-align: right;
}
</style>
