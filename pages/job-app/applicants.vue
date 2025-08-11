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
    <v-row class="align-center justify-space-between mb-2">
      <v-col cols="12" sm="12" class="text-sm-end text-start">
        <v-btn color="primary" :to="localePath('/job-app/applicant/create')" prepend-icon="mdi-plus">
          {{ t('applicant.create') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" class="mt-10 mx-6">
      {{ t('applicant.error') }}
    </v-alert>

    <v-row v-if="loading">
      <LoaderApplicants></LoaderApplicants>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="applicant in applicants"
        :key="applicant.id"
        cols="12"
        md="6"
        lg="6"
      >
        <v-card rounded="xl" class="pa-2 mx-3" variant="text" elevation="10">
          <v-row no-gutters>
            <v-col cols="3" class="d-flex align-center justify-center">
              <v-avatar size="48">
                <NuxtImg
                  :lazy-src="'/img/person.png'"
                  loading="lazy"
                  :src="applicant.user?.photo || '/default-avatar.png'"
                  alt="Avatar"
                />
              </v-avatar>
            </v-col>

            <v-col cols="9">
              <div class="text-h6 font-weight-bold px-1">
                {{ applicant.firstName }} {{ applicant.lastName }}
              </div>
              <div class="text-body-2 mb-1 px-1">
                📧 <a :href="`mailto:${applicant.contactEmail}`" class="no-style-link">{{ applicant.contactEmail }}</a>
              </div>
              <div class="text-body-2 mb-1 px-1">
                📞 {{ applicant.phone }}
              </div>
              <div class="text-body-2 mb-1 px-1">
                📎
                <a :href="applicant.resume" target="_blank" rel="noopener" class="no-style-link">
                  {{ t('applicant.resume') }}
                </a>
              </div>
              <div class="text-caption mt-1 px-1">
                🕒 {{ $dayjs(applicant?.createdAt).format('YYYY-MM-DD HH:mm') }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="!loading && applicants.length === 0" type="info" color="primary" class="mt-10 mx-6">
      {{ t('applicant.empty') }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import LoaderApplicants from "~/components/App/Loader/Job/LoaderApplicants.vue";

definePageMeta({
  title: 'Applicants',
  icon: 'mdi-animation',
  middleware: 'auth',
  requiredRoles: ['ROLE_USER'],
})

import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'
const { $dayjs } = useNuxtApp()
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
const { t } = useI18n()
const localePath = useLocalePath()
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
const applicants = ref([])
const loading = ref(true)
const error = ref(false)

const fetchApplicants = async () => {
  try {
    const { data, error: fetchError } = await useFetch('/api/job/application/applicants')
    if (fetchError.value) throw new Error()
    applicants.value = data.value || []
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}


watch(!applicants.value, () => {
  fetchApplicants()
}, { immediate: true })



onMounted(async () => {
  window.scrollTo({top: 0})
  await nextTick()
  canTeleport.value = !!document.getElementById('menu-bar-world')
  await fetchApplicants()
})
</script>
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
