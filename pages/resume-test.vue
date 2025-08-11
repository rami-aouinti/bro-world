<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useTheme } from 'vuetify'

import { CV_PRESETS } from '@/presets/cvPresets'
import CvA4 from '~/components/cv/CvA4.vue'
import PersonalGrid from '~/components/cv/PersonalGrid.vue'
import SectionHeader from '~/components/cv/SectionHeader.vue'
import ExperienceList from '~/components/cv/ExperienceList.vue'
import EducationList from '~/components/cv/EducationList.vue'
import SkillsBlock from '~/components/cv/SkillsBlock.vue'
import InterestsBlock from '~/components/cv/InterestsBlock.vue'
import LanguagesBlock from '~/components/cv/LanguagesBlock.vue'
import DrawerCVManager from '~/components/cv/DrawerCVManager.vue'
import Signature from '~/components/cv/Signature.vue'

import { useCvModel } from '~/composables/useCvModel'
import { exportCvAsPdf } from '~/utils/pdf'
import { defaultUi } from '@/types/ui/defaults'
import type { UiState } from '@/types/ui/types'

const presets = CV_PRESETS

// sélection du preset
const chosenKey = ref<string>(
  presets.find(p => (p as any).default)?.key ?? presets[1]?.key ?? presets[0].key
)
const chosen = computed(() => presets.find(p => p.key === chosenKey.value) ?? presets[0])

// UI pilotable
const ui = reactive<UiState>({
  ...defaultUi,
  layout: chosen.value.layout,                // ✅ important
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
    show: defaultUi.photo?.show ?? true,
    shadow: {
      ...(defaultUi.photo?.shadow ?? {}),
      ...(chosen.value.photoShadow ?? {}),
    },
  },
  skills: {
    chipVariant: chosen.value.skills?.chipVariant ?? 'text',
    chipColor:   chosen.value.skills?.chipColor   ?? chosen.value.palette.accent,
    chipDensity: chosen.value.skills?.chipDensity ?? 'compact',
    editable: true,
    draggable: true,
  },
  // ✅ copier corner/sidebar/vbar dès l'init
  // @ts-ignore selon ton UiState
  corner: chosen.value.corner ? { ...chosen.value.corner } : undefined,
  // @ts-ignore
  sidebar: chosen.value.sidebar ? { ...chosen.value.sidebar } : undefined,
  // @ts-ignore
  vbar: chosen.value.vbar ? { ...chosen.value.vbar } : undefined,
})

// appliquer un preset dans l'UI
function applyPreset(p: typeof CV_PRESETS[number]) {
  const keepShow = ui.photo.show

  ui.layout     = p.layout
  ui.fontFamily = p.fontFamily
  ui.fontSize   = p.baseSize
  ui.primary    = p.palette.primary
  ui.accent     = p.palette.accent
  ui.paper      = p.palette.paper
  ui.text       = p.palette.text

  ui.photo.position = p.photo.position
  ui.photo.widthMm  = p.photo.widthMm
  ui.photo.heightMm = p.photo.heightMm
  ui.photo.shape    = p.photo.rounded ? 'circle' : 'square'
  ui.photo.show     = keepShow
  ui.photo.shadow   = {
    ...(ui.photo.shadow ?? {}),
    ...(p.photoShadow ?? {}),
  }

  // recopier corner/sidebar/vbar
  // @ts-ignore
  ui.corner  = p.corner ? { ...p.corner } : undefined
  // @ts-ignore
  ui.sidebar = p.sidebar ? { ...p.sidebar } : undefined
  // @ts-ignore
  ui.vbar    = p.vbar    ? { ...p.vbar }    : undefined
}

// appliquer au chargement + sur changement de clé
watch(chosenKey, (k) => {
  const p = presets.find(x => x.key === k)
  if (p) applyPreset(p)
}, { immediate: true })

// -------- Divers --------
const { model, setByPath, readFile } = useCvModel()
const drawer = reactive({ theme: false })
const canTeleport = ref(false)
const signatureModal = ref(false)
const theme = useTheme()
const isDark = computed({
  get() { return theme.global.name.value === 'dark' },
  set(v) { theme.global.name.value = v ? 'dark' : 'light' },
})

async function onSignatureFromPad(file: File) {
  model.signature = await readFile(file)
  // @ts-ignore
  ui.signatureFile = file
}

const pdfRef = ref<HTMLElement | null>(null)
async function exportPdf() {
  if (!pdfRef.value) return
  ui.exporting = true
  try {
    await exportCvAsPdf(pdfRef.value!, {
      filename: 'CV_Rami_Aouinti.pdf',
      download: true,
      returnBlob: false,
      scale: 2.5,
      background: '#ffffff',
      pagebreakMode: ['css', 'legacy'],
      orientation: 'portrait',
      marginMm: 0,
      foreignObjectRendering: true,
      ignoreClass: 'no-print',
    })
  } finally {
    ui.exporting = false
  }
}

onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})

const menuItems = [
  { title: 'Template Gallery', icon: 'mdi-windows', color: 'default', path: '/resume' },
  { title: 'Create New CV', icon: 'mdi-file-account', color: 'default', path: '/cv/cv/new' },
  { title: 'New Cover Letter', icon: 'mdi-file-document-edit', color: 'default', path: '/cv/cover/new' },
]
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-3">
          <v-list class="custom-list" nav :lines="false">
            <MotionGroup preset="slideVisibleLeft" :duration="600">
              <v-list-item
                v-for="(item, i) in menuItems"
                :key="i"
                :to="item.path"
                class="custom-item pa-2"
                color="primary"
              >
                <template #prepend>
                  <v-icon :icon="item.icon" :color="item.color" class="me-3" />
                </template>
                <v-list-item-title
                  class="text-subtitle-2 text-uppercase font-weight-bold"
                  :class="isDark ? 'text-white' : 'text-default'"
                >
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>

              <!-- Sélecteur de template -->
              <v-list-item style="padding-top: 30px" color="primary">
                <v-autocomplete
                  v-model="chosenKey"
                  :items="presets"
                  item-title="label"
                  item-value="key"
                  :return-object="false"
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
                    <span v-else-if="index === 1" class="text-caption">
                      (+{{ presets.length - 1 }} autres)
                    </span>
                  </template>

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

              <!-- Actions export / signature -->
              <v-list-item class="pa-1" color="primary">
                <div class="d-flex mt-1 gap-2 align-center justify-center">
                  <v-btn size="small" variant="outlined" class="mx-1" color="default" icon="mdi-eye" @click="exportPdf" :loading="ui.exporting" />
                  <v-btn size="small" variant="outlined" class="mx-1" color="primary" icon="mdi-content-save" @click="exportPdf" :loading="ui.exporting" />
                  <v-btn size="small" variant="outlined" class="mx-1" color="primary" icon="mdi-download" @click="exportPdf" :loading="ui.exporting" />
                  <v-btn size="small" variant="outlined" color="default" icon="mdi-draw" @click="signatureModal = true" />
                </div>
              </v-list-item>

              <!-- Toggle section photo -->
              <v-list-item class="pa-1" color="primary">
                <div class="d-flex align-center justify-center mx-3">
                  <v-btn
                    size="small"
                    variant="outlined"
                    :color="ui.photo.show ? 'default' : 'primary'"
                    :prepend-icon="ui.photo.show ? 'mdi-eye-off' : 'mdi-image-plus'"
                    @click="ui.photo.show = !ui.photo.show"
                  >
                    {{ ui.photo.show ? 'Masquer la photo' : 'Ajouter une section photo' }}
                  </v-btn>
                </div>
              </v-list-item>
            </MotionGroup>
          </v-list>
        </div>
      </teleport>
    </client-only>

    <v-dialog v-model="signatureModal" max-width="600">
      <Signature v-model="signatureModal" @signature="onSignatureFromPad" />
    </v-dialog>

    <div ref="pdfRef">
      <!-- ✅ remount sur changement de preset -->
      <CvA4 :key="chosenKey" :ui="ui" :model="model" :preset="chosen">
        <template #personal>
          <PersonalGrid v-model="model.personal" @update-name="model.identity.name = $event" />
        </template>

        <template #experience>
          <SectionHeader label="Career" />
          <ExperienceList v-model="model.experience" :variant="ui.experience?.variant"
                          :dateLine="ui.experience?.dateLine" />
        </template>

        <template #education>
          <SectionHeader label="Education" />
          <EducationList v-model="model.education" :variant="ui.experience?.variant"
                         :dateLine="ui.experience?.dateLine" :accent="chosen.palette.accent" />
          <EducationList v-model="model.education" :accent="chosen.palette.accent" />
        </template>

        <template #skills>
          <SectionHeader label="Skills and Interests" />
          <SkillsBlock
            :ui="ui"
            v-model="model.skills"
            :accent="ui.skills?.chipColor ?? chosen.palette.accent"
            :chipVariant="ui.skills?.chipVariant ?? 'text'"
            :chipColor="ui.skills?.chipColor ?? chosen.palette.accent"
            :chipDensity="ui.skills?.chipDensity ?? 'compact'"
          />

          <InterestsBlock
            :ui="ui"
            v-model="model.interests"
            :accent="ui.skills?.chipColor ?? chosen.palette.accent"
            :chipVariant="ui.skills?.chipVariant ?? 'text'"
            :chipColor="ui.skills?.chipColor ?? chosen.palette.accent"
            :chipDensity="ui.skills?.chipDensity ?? 'compact'"
          />

          <SectionHeader label="Languages" class="mt-8" />
          <LanguagesBlock
            :ui="ui"
            v-model="model.languages"
            :variant="ui.languages?.variant ?? 'stars'"
            :accent="ui.languages?.accent ?? chosen.palette.accent"
            :maxLevel="ui.languages?.maxLevel ?? 5"
            :sizePx="ui.languages?.sizePx ?? 18"
            :editable="ui.languages?.editable ?? true"
            :draggable="ui.languages?.draggable ?? true"
          />
        </template>

        <template #sidebar>
          <PersonalGrid v-model="model.personal" @update-name="model.identity.name = $event" />
        </template>

        <template #footer>
          <img v-if="model.signature" class="signature" :src="model.signature" style="max-height:18mm" />
          <div class="name">{{ model.identity.name }}</div>
        </template>
      </CvA4>
    </div>

    <DrawerCVManager :drawer="drawer" :ui="ui" />
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
