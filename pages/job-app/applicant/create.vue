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
    <v-card class="mb-4 pa-3"
            rounded="xl"
            variant="text">
      <v-card-text>
        <v-row class="align-center mb-4">
          <v-col cols="5">
            <v-btn color="primary" variant="outlined" block @click="toggleUploadApplicant">
              Upload Resume
            </v-btn>
          </v-col>
          <v-col cols="2" class="text-center">
            <div class="text-subtitle-1 font-weight-medium">OR</div>
          </v-col>
          <v-col cols="5">
            <v-btn color="primary" variant="outlined" block @click="toggleCreateApplicant">
              {{ t('applicant.create') }}
            </v-btn>
          </v-col>
        </v-row>
        <CreateResume v-if="showCreateApplicant" @applicant-created="onApplicantCreated" />
        <UploadResume v-if="showUploadApplicant" @applicant-uploaded="onApplicantUploaded" />
      </v-card-text>
    </v-card>
  </v-container>

</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import CreateResume from "~/components/Job/Applicant/CreateResume.vue";
import UploadResume from "~/components/Job/Applicant/UploadResume.vue";

import { useRouter } from 'vue-router'
const router = useRouter()
const { t } = useI18n()
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
const showCreateApplicant = ref(false)
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
const toggleCreateApplicant = () => {
  showCreateApplicant.value = !showCreateApplicant.value
  showUploadApplicant.value = false
}

const showUploadApplicant = ref(false)
const toggleUploadApplicant = () => {
  showCreateApplicant.value = false
  showUploadApplicant.value = !showUploadApplicant.value
}

const onApplicantCreated = () => {
  Notify.success('Applicant created successfully')
  router.push('/job-app/applicants')
}

const onApplicantUploaded= () => {
  Notify.success('Applicant uploaded successfully')
  router.push('/job-app/applicants')
}
onMounted(async () => {
  window.scrollTo({top: 0})
  await nextTick()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
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
