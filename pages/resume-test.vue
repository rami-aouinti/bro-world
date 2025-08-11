<script setup lang="ts">
import { CV_PRESETS } from '@/presets/cvPresets'
import CvA4 from "~/components/cv/CvA4.vue";
import PersonalGrid from "~/components/cv/PersonalGrid.vue";
import SectionHeader from "~/components/cv/SectionHeader.vue";
import ExperienceList from "~/components/cv/ExperienceList.vue";
import EducationList from "~/components/cv/EducationList.vue";
import {useCvModel} from "~/composables/useCvModel";
import SkillsBlock from "~/components/cv/SkillsBlock.vue";
import InterestsBlock from "~/components/cv/InterestsBlock.vue";
import LanguagesBlock from "~/components/cv/LanguagesBlock.vue";
import {exportCvAsPdf} from "~/utils/pdf";
import Signature from "~/components/cv/Signature.vue";
const presets = CV_PRESETS
const chosen = ref(CV_PRESETS[1])
const fonts = ['Inter','Roboto','Open Sans','Lato','Merriweather','Georgia','Times New Roman']
const fontSizes = ['12px','13px','14px','15px','16px','18px']
import { computed, onMounted } from 'vue'
import { defaultUi } from '@/types/ui/defaults'
import type { UiState } from '@/types/ui/types'
import DrawerCVManager from "~/components/cv/DrawerCVManager.vue";
const items = [
  {
    title: "Template Gallery",
    icon: "mdi-windows", // Icône de CV/profil
    color: "default",
    path: "/resume"
  },
  {
    title: "Create New CV",
    icon: "mdi-file-account", // Icône de CV/profil
    color: "default",
    path: "/cv/cv/new"
  },
  {
    title: "New Cover Letter",
    icon: "mdi-file-document-edit", // Document avec crayon (édition)
    color: "default",
    path: "/cv/cover/new"
  },
]
const { model, setByPath, readFile } = useCvModel()
// Ton UI pilotable par les drawers :
const ui = reactive<UiState>({
  ...defaultUi,
  // tu peux initialiser depuis le preset si tu veux :
  fontFamily: chosen.value.fontFamily,
  fontSize: chosen.value.baseSize,
  accent: chosen.value.palette.accent,
  primary: chosen.value.palette.primary,
  paper: chosen.value.palette.paper,
  text: chosen.value.palette.text,
  photo: {
    ...defaultUi.photo,
    position: chosen.value.photo.position,
    widthMm: chosen.value.photo.widthMm,
    heightMm: chosen.value.photo.heightMm,
    shape: chosen.value.photo.rounded ? 'circle' : 'square',
  }
})

function applyPreset(p: typeof CV_PRESETS[number]) {
  chosen.value = p
  ui.fontFamily = p.fontFamily
  ui.fontSize = p.baseSize
  ui.primary = p.palette.primary
  ui.accent = p.palette.accent
  ui.paper = p.palette.paper
  ui.text = p.palette.text

  ui.photo.position = p.photo.position
  ui.photo.widthMm = p.photo.widthMm
  ui.photo.heightMm = p.photo.heightMm
  ui.photo.shape = p.photo.rounded ? 'circle' : 'square'
}

const drawer = reactive({
  theme: false
})
const canTeleport = ref(false)
const signatureModal = ref(false)
const theme = useTheme()
const showPhoto = ref(true)
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})


async function onSignatureFromPad(file: File) {
  // 1) Afficher tout de suite la signature dans la carte (img)
  model.signature = await readFile(file)  // -> dataURL "data:image/png;base64,..."

  // 2) (optionnel) garder le v-file-input en phase avec le choix
  //    si tu veux que son UI montre un fichier sélectionné :
  // @ts-ignore (selon ton typage)
  ui.signatureFile = file
}
const pdfRef = ref<HTMLElement | null>(null)
async function exportPdf(){
  if (!pdfRef.value) return
  ui.exporting = true
  try {
    const { pages, blob } = await exportCvAsPdf(pdfRef.value!, {
      filename: 'CV_Rami_Aouinti.pdf',
      download: true,                 // false si tu veux juste le blob
      returnBlob: false,              // passe à true si besoin
      scale: 2.5,                     // meilleure qualité
      background: '#ffffff',
      pagebreakMode: ['css', 'legacy'],
      orientation: 'portrait',
      marginMm: 0,
      foreignObjectRendering: true,   // important pour coins SVG/couleurs
      ignoreClass: 'no-print',        // (optionnel) tout élément .no-print est ignoré
    });
    console.log('Pages générées:', pages)
  } finally {
    ui.exporting = false
  }
}

onMounted(async () => {
  window.scrollTo({top: 0})
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
              <v-list-item
                style="padding-top: 30px"
                color="primary"
              >
                <v-autocomplete
                  v-model="chosen"
                :items="presets"
                item-title="label"
                item-value="key"
                return-object
                  rounded="xl"
                  color="primary"
                chips
                density="compact"
                :menu-props="{ maxHeight: 420 }"
                >
                <template #selection="{ item, index }">
                  <v-chip v-if="index === 0" size="small" class="mr-1" :prepend-avatar="item.raw.previewImg">
                    {{ item.raw.label }}
                  </v-chip>
                  <span v-else-if="index === 1" class="text-caption">(+{{ items.length - 1 }} autres)</span>
                </template>

                <!-- rendu des items dans la liste -->
                <template #item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :prepend-avatar="item.raw.previewImg"
                    :title="item.raw.label"
                    :subtitle="item.raw.layout"
                  />
                </template>
                </v-autocomplete>
              </v-list-item>
              <v-list-item
                class="pa-1"
                color="primary"
              >
                <div class="d-flex mt-1 gap-2 align-center justify-center">
                  <v-btn size="small" variant="outlined" class="mx-1" color="default" icon="mdi-eye" @click="exportPdf" :loading="ui.exporting">

                  </v-btn>
                  <v-btn size="small" variant="outlined" class="mx-1" color="primary" icon="mdi-content-save" @click="exportPdf" :loading="ui.exporting">

                  </v-btn>
                  <v-btn size="small" variant="outlined" class="mx-1" color="primary" icon="mdi-download" @click="exportPdf" :loading="ui.exporting">

                  </v-btn>
                  <v-btn size="small" variant="outlined" color="default" icon="mdi-draw" @click="signatureModal = true">

                  </v-btn>
                </div>

              </v-list-item>
              <v-list-item
                v-if="!showPhoto"
                class="pa-1"
                color="primary"
              >
                <v-btn size="small" variant="outlined" color="default" prepend-icon="mdi-download" @click="showPhoto = !showPhoto">
                  Foto hinzufügen
                </v-btn>

              </v-list-item>
            </MotionGroup>
          </v-list>
        </div>
      </teleport>
    </client-only>
    <v-dialog v-model="signatureModal" max-width="600">
      <Signature
        v-model="signatureModal"
        @signature="onSignatureFromPad"
      />
    </v-dialog>
    <div ref="pdfRef">
      <CvA4 :ui="ui" :model="model" :preset="chosen">
        <template #personal>
          <PersonalGrid @update-name="model.identity.name = $event" v-model="model.personal" />
        </template>

        <template #experience>
          <SectionHeader label="Career" />
          <ExperienceList v-model="model.experience" :accent="chosen.palette.accent" />
        </template>

        <template #education>
          <SectionHeader label="Education" />
          <EducationList v-model="model.education" :accent="chosen.palette.accent" />
        </template>

        <template #skills>
          <SectionHeader label="Skills and Interests" />
          <SkillsBlock
            v-model="model.skills" :accent="chosen.palette.accent"
            variant="skill-1"
          />

          <!-- INTERESTS -->
          <InterestsBlock
            v-model="model.interests" :accent="chosen.palette.accent"
            variant="interests-1"
            class="mt-6"
          />

          <!-- LANGUAGES -->
          <SectionHeader label="Languages" class="mt-8" />
          <LanguagesBlock
            :model-value="model.languages" :accent="chosen.palette.accent"
            variant="language-1"
          />
        </template>

        <template #sidebar>
          <PersonalGrid @update-name="model.identity.name = $event" v-model="model.personal" />
        </template>

        <template #footer>
          <img v-if="model.signature" class="signature" :src="model.signature" style="max-height:18mm">
          <div class="name">{{ model.identity.name }}</div>
        </template>
      </CvA4>
    </div>
    <DrawerCVManager :drawer="drawer" :ui="ui"  />
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
