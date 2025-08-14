<script setup lang="ts">
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import PdfTemplateGrid from "~/components/Resume/PdfTemplateGrid.vue";
import {CV_PRESETS} from "~/presets/cvPresets";

definePageMeta({
  layout: 'default',
  description: 'Resume page',
  title: 'Resume Builder',
  meta: [
    { name: 'description', content: 'Create and export your resume easily.' },
    { name: 'keywords', content: 'resume, cv, builder, export' },
  ],
  head: {
    title: 'Resume Builder',
    meta: [
      { name: 'description', content: 'Create and export your resume easily.' },
      { name: 'keywords', content: 'resume, cv, builder, export' },
    ],
  },
  breadcrumb: 'disabled',
  scrollToTop: true,
})
const items = [
  {
    title: "Template Gallery",
    icon: "mdi-windows",
    color: "default",
    path: "/resume"
  },
  {
    title: "My Templates",
    icon: "mdi-note",
    color: "default",
    path: "/cv/my-templates"
  },
  {
    title: "Create New Template",
    icon: "mdi-mouse",
    color: "default",
    path: "/cv/cv/new"
  },
  {
    title: "Create New CV",
    icon: "mdi-file-account",
    color: "default",
    path: "/cv/cv/new"
  },
  {
    title: "New Cover Letter",
    icon: "mdi-file-document-edit",
    color: "default",
    path: "/cv/cover/new"
  }
]
const presets = CV_PRESETS

const canTeleport = ref(false)
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-2">
          <v-list
            class="custom-list"
            nav
            :lines="false"
          >
            <MotionGroup preset="slideVisibleLeft" :duration="600">
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                :to="item.path"
                class="custom-item pa-3"
                color="primary"
              >
                <template #prepend>
                  <v-icon :icon="item.icon" :color="item.color" class="me-3"></v-icon>
                </template>

                <v-list-item-title class="text-subtitle-2 text-uppercase font-weight-bold" :class="isDark ? 'text-white' : 'text-default'">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </MotionGroup>
          </v-list>
        </div>
      </teleport>
    </client-only>
    <v-row>
      <v-col cols="12" md="12">
        <PdfTemplateGrid :presets="presets" />
      </v-col>
    </v-row>
  </v-container>
</template>


<style scoped>

.custom-list {
  background-color: transparent;
}

.custom-item {
  transition: all 0.2s ease;
  border-radius: 12px;
  padding-left: 12px;
  margin-bottom: 4px;
}

.custom-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  box-shadow: 0 3px 9px rgb(var(--v-theme-primary));
  transform: translateX(2px);
}

.router-link-exact-active {
  background-color: #e3f2fd;
  font-weight: 700;
}
</style>
