<script setup lang="ts">
import Social from "~/components/Job/Resume/Social.vue";
import Profile from "~/components/Job/Resume/Profile.vue";
import Preview from "~/components/Job/Resume/Preview.vue";
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import PdfTemplateGrid from "~/components/Resume/PdfTemplateGrid.vue";

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
    title: "Create New CV",
    icon: "mdi-file-account", // Icône de CV/profil
    color: "default",
    path: "/setting"
  },
  {
    title: "Create New Lettre de motivation",
    icon: "mdi-file-document-edit", // Document avec crayon (édition)
    color: "default",
    path: "/calendar"
  },
  {
    title: "My Cvs",
    icon: "mdi-briefcase", // Valise → carrière/emploi
    color: "default",
    path: "/ecommerce/order"
  },
  {
    title: "Lettre de motivation",
    icon: "mdi-file-document", // Document simple (lecture)
    color: "default",
    path: "/resume"
  },
]

const canTeleport = ref(false)
const data = ref({
  n: "",
  d: "",
  i: "",
  f: "",
  t: "",
  ig: "",
  gh: "",
  tg: "",
  l: "",
  e: "",
  w: "",
  y: "",
  ls: [],
});
const publish = `1?data=${encodeData(data.value)}`;
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
const downloadPdf = async () => {
  const res = await useFetch('/api/resume/export-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: publish })
  })

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'resume.pdf'
  link.click()

  URL.revokeObjectURL(url)
}
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  canTeleport.value = !!document.getElementById('menu-bar-world')
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
        <PdfTemplateGrid />
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
