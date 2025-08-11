<template>

  <!-- THEME -->
  <AppDrawerCvRight v-model="drawer.education" :drawerWidth="drawerWidth">
    <Suspense>
      <template #default>
        <Education :ui="props.ui" />
      </template>
      <template #fallback>
        <SkeletonCard />
      </template>
    </Suspense>
  </AppDrawerCvRight>
  <!-- THEME -->
  <AppDrawerCvRight v-model="drawer.experience" :drawerWidth="drawerWidth">
    <Suspense>
      <template #default>
        <Experience :ui="props.ui" />
      </template>
      <template #fallback>
        <SkeletonCard />
      </template>
    </Suspense>
  </AppDrawerCvRight>
  <!-- THEME -->
  <AppDrawerCvRight v-model="drawer.skills" :drawerWidth="drawerWidth">
    <Suspense>
      <template #default>
        <Skill :ui="props.ui" />
      </template>
      <template #fallback>
        <SkeletonCard />
      </template>
    </Suspense>
  </AppDrawerCvRight>
  <!-- THEME -->
  <AppDrawerCvRight v-model="drawer.language" :drawerWidth="drawerWidth">
    <Suspense>
      <template #default>
        <Language :ui="props.ui" />
      </template>
      <template #fallback>
        <SkeletonCard />
      </template>
    </Suspense>
  </AppDrawerCvRight>

  <!-- THEME -->
  <AppDrawerCvRight v-model="drawer.interests" :drawerWidth="drawerWidth">
    <Suspense>
      <template #default>
        <Interest :ui="props.ui" />
      </template>
      <template #fallback>
        <SkeletonCard />
      </template>
    </Suspense>
  </AppDrawerCvRight>
  <!-- THEME -->
  <AppDrawerCvRight v-model="drawer.corner" :drawerWidth="drawerWidth">
    <Suspense>
      <template #default>
        <Corner :ui="props.ui" />
      </template>
      <template #fallback>
        <SkeletonCard />
      </template>
    </Suspense>
  </AppDrawerCvRight>
  <!-- THEME -->
  <AppDrawerCvRight v-model="drawer.photo" :drawerWidth="drawerWidth">
    <Suspense>
      <template #default>
        <Photo :ui="props.ui" />
      </template>
      <template #fallback>
        <SkeletonCard />
      </template>
    </Suspense>
  </AppDrawerCvRight>
  <!-- THEME -->
  <AppDrawerCvRight v-model="drawer.theme">
    <Suspense>
      <template #default>
        <Theme :ui="props.ui" />
      </template>
      <template #fallback>
        <SkeletonCard />
      </template>
    </Suspense>
  </AppDrawerCvRight>

  <!-- Floating buttons -->
  <DrawerCVButtons
    :drawer="drawer"
    :logged-in="loggedIn"
    @toggle="toggleDrawer"
  />
</template>
<script setup lang="ts">
import { ref, reactive, defineAsyncComponent, onMounted } from 'vue'
import AppDrawerCvRight from "~/components/cv/AppDrawerCvRight.vue";
import type { UiState } from '@/types/ui'
import Education from "~/components/cv/Filter/Education.vue";
import Experience from "~/components/cv/Filter/Experience.vue";
import Skill from "~/components/cv/Filter/Skill.vue";
import Language from "~/components/cv/Filter/Language.vue";
import Interest from "~/components/cv/Filter/Interest.vue";
import Corner from "~/components/cv/Filter/Corner.vue";
import Photo from "~/components/cv/Filter/Photo.vue";

const Theme = defineAsyncComponent(() => import('~/components/cv/Filter/Theme.vue'))
const SkeletonCard = defineAsyncComponent(() => import('~/components/App/AppBar/SkeletonCard.vue'))
const DrawerCVButtons = defineAsyncComponent(() => import('~/components/cv/DrawerCVButtons.vue'))
const props = defineProps<{
  drawer: Record<string, boolean>
  ui: UiState
}>()
const { user, loggedIn } = await useUserSession()
const plugins = ref<any[]>([])
const loading = ref({ plugin: true })
const drawerWidth = ref('calc(100vw - 100px)')

const drawer = reactive({
  education: false,
  experience: false,
  skills: false,
  language: false,
  interests: false,
  corner: false,
  photo: false,
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
