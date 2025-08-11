<script setup lang="ts">
import Skills from "~/components/Job/Details/Skills.vue";

definePageMeta({
  title: 'Requests',
  icon: 'mdi-animation',
  middleware: 'auth',
  requiredRoles: ['ROLE_USER'],
})
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'
import Header from "~/components/Job/Details/Header.vue";
import LoaderRequest from "~/components/App/Loader/Job/LoaderRequest.vue";
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
const { t } = useI18n()
const localePath = useLocalePath()
const items = [
  {
    title: "Jobs",
    icon: "mdi-briefcase", // Offre d'emploi
    color: "default",
    path: "/public-job"
  },
  {
    title: "New Offer",
    icon: "mdi-briefcase-plus", // Ajouter une offre
    color: "default",
    path: "/job-app/job/create"
  },
  {
    title: "Applications",
    icon: "mdi-clipboard-text", // Liste des candidatures
    color: "default",
    path: "/job-app/applications"
  },
  {
    title: "Requests",
    icon: "mdi-account-clock", // Demandes en attente
    color: "default",
    path: "/job-app/requests"
  },
  {
    title: "Applicants",
    icon: "mdi-account-multiple", // Liste de candidats
    color: "default",
    path: "/job-app/applicants"
  },
  {
    title: "Template Gallery",
    icon: "mdi-view-grid", // Galerie de modèles
    color: "default",
    path: "/resume"
  },
  {
    title: "Create New CV",
    icon: "mdi-file-account", // CV avec icône profil
    color: "default",
    path: "/cv/cv/new"
  },
  {
    title: "New Cover Letter",
    icon: "mdi-file-document-edit", // Document avec crayon
    color: "default",
    path: "/cv/cover/new"
  },
]
const jobs = ref([])
const loading = ref(true)
const error = ref(false)

const fetchRequests = async () => {
  try {
    const { data, error: fetchError } = await useFetch('/api/job/application/requests')
    if (fetchError.value) throw new Error()
    jobs.value = data.value.data || []
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}


watch(!jobs.value, () => {
  fetchRequests()
}, { immediate: true })

onMounted(async () => {
  window.scrollTo({top: 0})
  await nextTick()
  canTeleport.value = !!document.getElementById('menu-bar-world')
  await fetchRequests()
})
</script>
<template>
  <v-container fluid>
    <teleport v-if="canTeleport" to="#menu-bar-world">
      <div class="pa-3">
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
              class="custom-item pa-2"
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
    <v-alert v-if="error" type="error" class="mt-10 mx-6">
      {{ t('job.error') }}
    </v-alert>

    <v-row v-if="loading">
      <LoaderRequest></LoaderRequest>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="job in jobs"
        :key="job.id"
        cols="12"
      >
        <v-card rounded="xl" variant="text" class="pa-4 mb-2" elevation="10">
          <Header :job="job" />
          <v-card-text>
            <Skills :job="job" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="!loading && jobs.length === 0" type="info" color="primary" class="mt-10 mx-6">
      {{ t('job.empty') }}
    </v-alert>
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
.no-style-link {
  color: inherit;
  text-decoration: none;
}
</style>
