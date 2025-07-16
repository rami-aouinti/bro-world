<template>
  <!-- WORLD -->
  <AppDrawerRight v-model="drawer.world" :drawerWidth="drawerWidth">
    <WorldDrawerContent
      v-model:dialogCreateWorld="dialogCreateWorld"
      :plugins="plugins"
      :loading="loading.plugin"
      :logged-in="loggedIn"
    />
  </AppDrawerRight>

  <!-- MEDIA -->
  <AppDrawerRight v-model="drawer.media" :drawerWidth="drawerWidth">
    <Suspense>
      <template #default><Media /></template>
      <template #fallback><SkeletonCard /></template>
    </Suspense>
  </AppDrawerRight>

  <!-- NEWS -->
  <AppDrawerRight v-model="drawer.news" :drawerWidth="drawerWidth">
    <Suspense>
      <template #default><Weather /></template>
      <template #fallback><SkeletonCard /></template>
    </Suspense>
    <Suspense>
      <template #default><News /></template>
      <template #fallback><SkeletonCard /></template>
    </Suspense>
  </AppDrawerRight>

  <!-- THEME -->
  <AppDrawerRight v-model="drawer.theme" :drawerWidth="drawerWidth">
    <Suspense>
      <template #default><AppSettings /></template>
      <template #fallback><SkeletonCard /></template>
    </Suspense>
  </AppDrawerRight>

  <!-- Floating buttons -->
  <DrawerButtons
    :drawer="drawer"
    :logged-in="loggedIn"
    @toggle="toggleDrawer"
  />
</template>
<script setup lang="ts">
import { ref, reactive, defineAsyncComponent, onMounted } from 'vue'
import AppDrawerRight from "~/components/App/AppBar/AppDrawerRight.vue";

const Media = defineAsyncComponent(() => import('~/pages/home/dashboard/Media.vue'))
const News = defineAsyncComponent(() => import('~/pages/home/dashboard/News.vue'))
const Weather = defineAsyncComponent(() => import('~/pages/home/dashboard/Weather.vue'))
const AppSettings = defineAsyncComponent(() => import('~/components/App/AppSettings.vue'))
const WorldDrawerContent = defineAsyncComponent(() => import('~/components/App/AppBar/WorldDrawerContent.vue'))
const SkeletonCard = defineAsyncComponent(() => import('~/components/App/AppBar/SkeletonCard.vue'))
const DrawerButtons = defineAsyncComponent(() => import('~/components/App/AppBar/DrawerButtons.vue'))

const { user, loggedIn } = useUserSession()
const dialogCreateWorld = ref(false)
const plugins = ref<any[]>([])
const loading = ref({ plugin: true })
const drawerWidth = ref('calc(100vw - 100px)')

const drawer = reactive({
  world: false,
  media: false,
  news: false,
  theme: false,
  visible: true
})

const toggleDrawer = (name: keyof typeof drawer) => {
  for (const key in drawer) {
    drawer[key] = false
  }
  drawer[name] = true
}

const fetchPlugins = async () => {
  if (!loggedIn.value) return
  try {
    const data = await $fetch('/api/plugin/profile/get')
    if (data) plugins.value = data
  } catch (e) {
    console.error('Erreur fetch plugins:', e)
  } finally {
    loading.value.plugin = false
  }
}

onMounted(fetchPlugins)

</script>
