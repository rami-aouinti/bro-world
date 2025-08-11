<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-1">
          <v-list
            class="custom-list"
            nav
            :lines="false"
          >
            <MotionGroup preset="slideVisibleLeft" :duration="600">
              <v-list-item
                class="custom-item pa-1"
                color="primary"
              >
                <div class="d-flex mt-1 gap-2 align-center">
                  <v-menu>
                    <template #activator="{ props }">
                      <v-btn v-bind="props" size="small" variant="outlined" prepend-icon="mdi-view-dashboard-edit">Model</v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-for="preset in presets" :key="preset.key" @click="applyPreset(preset)">
                        <v-list-item-title>{{ preset.label }}</v-list-item-title>
                        <v-list-item-subtitle class="text-caption">{{ preset.description }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <v-btn size="small" variant="outlined" class="mx-1" color="primary" prepend-icon="mdi-download" @click="exportPdf" :loading="ui.exporting">
                    Save
                  </v-btn>
                  <v-btn  size="small" variant="outlined" color="default" prepend-icon="mdi-draw" @click="signatureModal = true">
                    Signature
                  </v-btn>
                </div>

              </v-list-item>
              <v-list-item
                v-if="!showPhoto"
                class="custom-item pa-1"
                color="primary"
              >
                <v-btn size="small" variant="outlined" color="default" prepend-icon="mdi-download" @click="showPhoto = !showPhoto">
                  Foto hinzufügen
                </v-btn>

              </v-list-item>
              <v-list-item
                class="custom-item pa-1"
                color="primary"
              >
                <div class="d-flex mt-2 gap-2 align-center">
                  <v-select
                    class="mx-1"
                    v-model="ui.fontFamily"
                    :items="fonts"
                    label="Schriftart"
                    density="compact"
                  />
                  <v-select
                    class="mx-1"
                    v-model="ui.fontSize"
                    :items="fontSizes"
                    label="Größe"
                    density="compact"
                  />
                </div>
                <div class="mt-1">
                  <v-color-picker v-model="ui.accent" hide-inputs mode="hex" elevation="0" width="100%"/>
                </div>
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
    <div ref="pdfRef" class="cv a4" :style="cvStyle">
      <div class="accent-corner" />

      <div class="cv-content">
        <div class="hero">
          <template v-if="showPhoto">
            <PhotoBlock
              :src="model.photo"
              @update:src="val => (model.photo = val)"
              @delete-section="showPhoto = false"
            />
          </template>

          <div class="title-block">
            <EditableText
              v-model="model.identity.name"
              class="cv-title"
              placeholder="Name eingeben"
            />

            <EditableText
              v-model="model.identity.headline"
              class="subtitle"
              placeholder="Berufsbezeichnung eingeben"
            />
            <PersonalGrid @update-name="model.identity.name = $event" v-model="model.personal" />
          </div>
        </div>
        <SectionHeader label="BERUFSERFAHRUNG" class="mt-8" />
        <ExperienceList
          v-model="model.experience"
          :accent="ui.accent"
        />

        <SectionHeader label="AUSBILDUNG" class="mt-8" />
        <EducationList v-model="model.education" :accent="ui.accent" />

        <SectionHeader label="KENNTNISSE UND INTERESSEN" class="mt-8" />
        <SkillsGrid v-model="model.skills" :accent="ui.accent" />
        <InterestsList v-model="model.interests" :accent="ui.accent" class="mt-4" />

        <div class="signature-area mt-10">
          <img v-if="model.signature" class="signature" :src="model.signature" alt="signature">
          <div class="name" contenteditable @input="onEdit($event,'identity.name')">{{ model.identity.name }}</div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive, ref } from 'vue'
import SectionHeader from '@/components/cv/SectionHeader.vue'
import ExperienceList from '@/components/cv/ExperienceList.vue'
import EducationList from '@/components/cv/EducationList.vue'
import SkillsGrid from '@/components/cv/SkillsGrid.vue'
import InterestsList from '@/components/cv/InterestsList.vue'
import { useCvModel } from '@/composables/useCvModel'
import { exportCvAsPdf } from '@/utils/pdf'
import PhotoBlock from "~/components/cv/PhotoBlock.vue";
import EditableText from "~/components/common/EditableText.vue";
import PersonalGrid from "~/components/cv/PersonalGrid.vue";
import Signature from "~/components/cv/Signature.vue";
import BaseDialog from "~/components/BaseDialog.vue";
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
const fonts = ['Inter','Roboto','Open Sans','Lato','Merriweather','Georgia','Times New Roman']
const fontSizes = ['12px','13px','14px','15px','16px','18px']

const { model, setByPath, readFile } = useCvModel()

const ui = reactive({ fontFamily: 'Inter', fontSize: '14px', accent: '#091b2d', exporting: false })

const cvStyle = computed(() => ({ fontFamily: ui.fontFamily, fontSize: ui.fontSize }))

function onEdit(e: Event, path: string){
  const text = (e.target as HTMLElement).innerText
  setByPath(model as any, path, text)
}
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
  if(!pdfRef.value) return
  ui.exporting = true
  try { await exportCvAsPdf(pdfRef.value) } finally { ui.exporting = false }
}

/** PRESETS **/
const presets = [
  { key: 'classic', label: 'Classic', description: 'Serifen-Schrift, roter Akzent', apply: () => {
      ui.fontFamily = 'Georgia'; ui.accent = '#3b0f0f'; ui.fontSize = '14px'
    }},
  { key: 'modern', label: 'Modern', description: 'Sans Serif, blau', apply: () => {
      ui.fontFamily = 'Inter'; ui.accent = '#091b2d'; ui.fontSize = '15px'
    }},
  { key: 'clean', label: 'Clean', description: 'Roboto, grau', apply: () => {
      ui.fontFamily = 'Roboto'; ui.accent = '#574d4d'; ui.fontSize = '14px'
    }}
]

function applyPreset(preset: any){
  preset.apply()
}

onMounted(async () => {
  window.scrollTo({top: 0})
  await nextTick()
  canTeleport.value = !!document.getElementById('menu-bar-world')
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
.cv-wrapper{ background:#eee; }
.cv{ width:210mm; min-height:297mm; margin:0px auto; background:white; position:relative; box-shadow:0 2px 10px rgba(0,0,0,.08); }
.cv-content{ padding: 22mm 4mm 20mm 4mm; position:relative; }
.accent-corner{ position:absolute; left:0; top:0; width:0; height:0; border-top:30mm solid var(--accent, #091b2d); border-right:30mm solid transparent; }
.accent-corner::after{ content:''; position:absolute; left:8mm; top:8mm; width:0; height:0; border-top:22mm solid transparent; border-right:22mm solid transparent; border-bottom:22mm solid white; }

.hero{ display:flex; gap:18px; align-items:center; }
.photo{ width:48mm; height:64mm; border:2px dashed #bbb; border-radius:6px; display:flex; align-items:center; justify-content:center; overflow:hidden; background:#fafafa; }
.photo img{ width:100%; height:100%; object-fit:cover; }
.ph{ font-size:28px; opacity:.5; }
.title-block{ flex:1; }
.cv-title{ margin:0; font-size:32px; font-weight:800; letter-spacing:.1px; }
.subtitle{ margin-bottom:1px; opacity:.8; }

.signature-area{ text-align:right; }
.signature{ max-height: 18mm; display:inline-block; }
.signature-area .name{ font-weight:600; padding-right: 25px; }

.cv{ --accent: v-bind('ui.accent'); }
</style>
