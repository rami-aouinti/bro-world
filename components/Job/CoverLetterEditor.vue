<template>
  <v-container fluid>
    <!-- Toolbar (téléportée) -->
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-2">
          <v-list class="custom-list" nav :lines="false">
            <MotionGroup preset="slideVisibleLeft" :duration="600">
              <!-- Polices & Couleurs -->
              <v-list-item class="custom-item pa-3" color="primary">
                <v-menu :close-on-content-click="false">
                  <template #activator="{ props }">
                    <v-btn :close-on-content-click="false" v-bind="props" variant="tonal" prepend-icon="mdi-format-font">
                      Police & couleur
                    </v-btn>
                  </template>
                  <v-card class="pa-3" width="360">
                    <div class="d-flex gap-2 align-center">
                      <v-select v-model="ui.fontFamily" :items="fonts" label="Police" density="compact" />
                      <v-select v-model="ui.fontSize" :items="fontSizes" label="Taille" density="compact" />
                    </div>
                    <div class="mt-2">
                      <div class="text-caption mb-1">Couleur d’accent</div>
                      <v-color-picker v-model="ui.accent" hide-inputs mode="hex" elevation="0" width="320" />
                    </div>
                  </v-card>
                </v-menu>
              </v-list-item>

              <!-- Corners -->
              <v-list-item class="custom-item pa-3" color="primary">
                <v-menu :close-on-content-click="false">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" variant="tonal" prepend-icon="mdi-triangle">
                      Coins
                    </v-btn>
                  </template>
                  <v-card class="pa-3" width="380">
                    <div class="d-flex ga-2">
                      <v-switch v-model="ui.corner.enabled" hide-details label="Activer" />
                      <v-select
                        v-model="ui.corner.type"
                        :items="cornerTypes"
                        label="Forme"
                        density="compact"
                        class="ms-2"
                        style="max-width: 170px"
                      />
                    </div>
                    <div class="d-flex ga-2 mt-2">
                      <v-select
                        v-model="ui.corner.anchor"
                        :items="cornerAnchors"
                        label="Ancrage"
                        density="compact"
                        style="max-width: 170px"
                      />
                      <v-text-field
                        v-model.number="ui.corner.sizeMm"
                        label="Taille (mm)"
                        type="number"
                        density="compact"
                        min="10" max="80" step="2"
                      />
                    </div>
                    <div class="d-flex ga-2 mt-2">
                      <div class="flex-1">
                        <div class="text-caption">Couleur principale</div>
                        <v-color-picker v-model="ui.corner.color" hide-inputs mode="hex" elevation="0" width="170" />
                      </div>
                      <div class="flex-1" v-if="ui.corner.type==='ribbon' || ui.corner.type==='dual-slope'">
                        <div class="text-caption">Couleur secondaire</div>
                        <v-color-picker v-model="ui.corner.color2" hide-inputs mode="hex" elevation="0" width="170" />
                      </div>
                    </div>
                  </v-card>
                </v-menu>
              </v-list-item>

              <!-- Photo -->
              <v-list-item class="custom-item pa-3" color="primary">
                <v-menu :close-on-content-click="false">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" variant="tonal" prepend-icon="mdi-triangle">
                      Photo
                    </v-btn>
                  </template>
                  <v-card class="pa-3" width="380">
                    <div class="d-flex align-center ga-2">
                      <v-switch v-model="ui.photo.show" hide-details label="Afficher la photo" />
                      <v-select
                        v-model="ui.photo.position"
                        :items="['left','right','top']"
                        label="Position"
                        density="compact"
                        style="max-width: 120px"
                      />
                      <v-select
                        v-model="ui.photo.shape"
                        :items="['square','circle']"
                        label="Forme"
                        density="compact"
                        style="max-width: 120px"
                      />
                    </div>

                    <div class="d-flex ga-2 mt-2">
                      <v-text-field v-model.number="ui.photo.widthMm"  type="number" label="Largeur (mm)" density="compact" />
                      <v-text-field v-model.number="ui.photo.heightMm" type="number" label="Hauteur (mm)" density="compact" />
                    </div>

                    <div class="d-flex ga-2 mt-2">
                      <v-select
                        v-model="ui.photo.variant"
                        :items="photoVariants"
                        label="Habillage"
                        density="compact"
                        style="max-width: 200px"
                      />
                      <v-file-input
                        v-model="ui.photoFile"
                        accept="image/*"
                        hide-details
                        prepend-icon="mdi-camera"
                        density="comfortable"
                        style="max-width: 240px"
                        label="Téléverser photo"
                        @update:model-value="onPhotoUpload"
                      />
                    </div>

                    <!-- Nouveau : bordure de la photo -->
                    <v-divider class="my-3" />
                    <div class="text-subtitle-2 mb-2">Bordure de la photo</div>
                    <div class="d-flex ga-2">
                      <v-select
                        v-model="ui.photo.borderStyle"
                        :items="['none','solid','dashed','dotted']"
                        label="Style"
                        density="compact"
                        style="max-width: 140px"
                      />
                      <v-text-field
                        v-model.number="ui.photo.borderWidthPx"
                        type="number"
                        label="Épaisseur (px)"
                        density="compact"
                        min="0" max="20" step="1"
                        style="max-width: 160px"
                      />
                      <v-menu :close-on-content-click="false">
                        <template #activator="{ props }">
                          <v-btn v-bind="props" size="small" variant="tonal">
                            Couleur
                            <span :style="{ width:'18px', height:'18px', borderRadius:'4px', marginLeft:'8px', backgroundColor: ui.photo.borderColor }"/>
                          </v-btn>
                        </template>
                        <v-card class="pa-2">
                          <v-color-picker v-model="ui.photo.borderColor" hide-inputs mode="hex" elevation="0" width="260" />
                        </v-card>
                      </v-menu>
                    </div>
                  </v-card>

                </v-menu>

              </v-list-item>

              <!-- Signature -->
              <v-list-item class="custom-item pa-3" color="primary">
                <v-file-input
                  v-model="ui.signatureFile"
                  accept="image/*"
                  hide-details
                  prepend-icon="mdi-draw"
                  density="comfortable"
                  style="max-width: 280px"
                  label="Téléverser signature"
                  @update:model-value="onSignatureUpload"
                />
              </v-list-item>

              <!-- Presets -->
              <v-list-item class="custom-item pa-3" color="primary">
                <v-menu :close-on-content-click="false">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" variant="tonal" prepend-icon="mdi-view-dashboard-edit">
                      Modèles
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="p in COVER_PRESETS" :key="p.key" @click="applyPreset(p)">
                      <v-list-item-title>{{ p.label }}</v-list-item-title>
                      <v-list-item-subtitle class="text-caption">{{ p.description }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>

              <!-- Export PDF -->
              <v-list-item class="custom-item pa-3" color="primary">
                <v-btn color="primary" prepend-icon="mdi-download" @click="exportPdf" :loading="ui.exporting">
                  Export PDF
                </v-btn>
              </v-list-item>
            </MotionGroup>
          </v-list>
        </div>
      </teleport>
    </client-only>

    <!-- Canvas A4 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="pa-0 letter-wrapper">
          <div ref="pdfTarget" class="letter a4" :style="[letterStyle, cssVars]">
            <!-- Coin -->
            <CoverCorner
              v-if="ui.corner.enabled && ui.corner.type !== 'none'"
              :type="ui.corner.type"
              :anchor="ui.corner.anchor"
              :size-mm="ui.corner.sizeMm"
              :primary="ui.corner.color || ui.accent"
              :secondary="ui.corner.color2 || ''"
            />

            <div class="letter-content">
              <!-- En-tête -->
              <div class="header" :class="`photo-${ui.photo.position}`">
                <div class="sender">
                  <div class="sender-name" contenteditable @input="onEditable($event, 'sender.name')">
                    {{ model.sender.name }}
                  </div>
                  <div contenteditable class="muted" @input="onEditable($event, 'sender.address')">
                    {{ model.sender.address }}
                  </div>
                  <div contenteditable class="muted" @input="onEditable($event, 'sender.city')">
                    {{ model.sender.city }}
                  </div>
                  <div contenteditable class="muted" @input="onEditable($event, 'sender.contact')">
                    {{ model.sender.contact }}
                  </div>
                </div>

                <!-- Zone photo (avec cadre/traits quand vide) -->
                <div v-if="ui.photo.show" class="photo-wrap">
                  <PhotoFrame
                    :src="ui.photoSrc"
                  :width-mm="ui.photo.widthMm"
                  :height-mm="ui.photo.heightMm"
                  :shape="ui.photo.shape"
                  :variant="ui.photo.variant"
                  :accent="ui.accent"
                  :border-style="ui.photo.borderStyle"
                  :border-width-px="ui.photo.borderWidthPx"
                  :border-color="ui.photo.borderColor"
                  />
                </div>
              </div>

              <!-- Destinataire -->
              <div class="recipient editable-block" contenteditable @input="onEditable($event, 'recipient')">
                {{ model.recipient }}
              </div>

              <!-- Contact -->
              <div class="contact">
                <div class="line" contenteditable @input="onEditable($event, 'contact.phone')">
                  Téléphone : {{ model.contact.phone }}
                </div>
                <div class="line" contenteditable @input="onEditable($event, 'contact.email')">
                  Email : {{ model.contact.email }}
                </div>
              </div>

              <!-- Date -->
              <div class="date" contenteditable @input="onEditable($event, 'meta.date')">
                {{ model.meta.date }}
              </div>

              <!-- Titre -->
              <div class="title editable-block" contenteditable @input="onEditable($event, 'meta.title')">
                {{ model.meta.title }}
              </div>

              <!-- Corps -->
              <div class="body">
                <p
                  v-for="(p, i) in model.sections"
                  :key="i"
                  class="paragraph editable-block"
                  contenteditable
                  @input="onEditable($event, `sections.${i}`)"
                >{{ p }}</p>
              </div>

              <!-- Signature -->
              <div class="signature-block">
                <div class="farewell editable-block" contenteditable @input="onEditable($event, 'signature.farewell')">
                  {{ model.signature.farewell }}
                </div>
                <div class="sign-row">
                  <img v-if="ui.signatureSrc" class="signature" :src="ui.signatureSrc" alt="signature" />
                </div>
                <div class="name editable-block" contenteditable @input="onEditable($event, 'signature.name')">
                  {{ model.signature.name }}
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useTheme } from 'vuetify'
import { COVER_PRESETS, fonts, fontSizes, cornerTypes, cornerAnchors, photoVariants } from '@/data/coverLetterPresets'
import { useCoverLetterModel } from '@/composables/useCoverLetterModel'
import html2pdfOptions from '@/utils/html2pdfOptions'
import CoverCorner from '@/components/cover/CoverCorner.vue'
import PhotoFrame from '@/components/cover/PhotoFrame.vue'

/* THEME */
const theme = useTheme()
const isDark = computed({
  get: () => theme.global.name.value === 'dark',
  set: v => { theme.global.name.value = v ? 'dark' : 'light' },
})

/* STATE */
const canTeleport = ref(false)
const { model, ui, applyPreset, onEditable, onPhotoUpload, onSignatureUpload } = useCoverLetterModel()

/* STYLE */
const letterStyle = computed(() => ({
  fontFamily: ui.fontFamily,
  fontSize: ui.fontSize
}))
const cssVars = computed(() => ({
  '--accent': ui.accent,
  '--paper': '#ffffff',
  '--text': '#111111',
}))

/* EXPORT PDF */
const pdfTarget = ref<HTMLElement | null>(null)
async function exportPdf(){
  if(!pdfTarget.value) return
  ui.exporting = true
  try {
    const html2pdf = (await import('html2pdf.js')).default
    await html2pdf().set(html2pdfOptions('Cover-Letter.pdf')).from(pdfTarget.value).save()
  } finally {
    ui.exporting = false
  }
}

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})
</script>

<style scoped>
.custom-list { background-color: transparent; }
.custom-item { transition: all .2s; border-radius: 12px; padding-left: 12px; margin-bottom: 4px; }
.custom-item:hover { background-color: rgba(0,0,0,.04); box-shadow: 0 3px 9px rgb(var(--v-theme-primary)); transform: translateX(2px); }

.letter-wrapper{ background: #eee; }
.letter{
  width: 210mm;
  min-height: 297mm;
  margin: 16px auto;
  background: white;
  color: var(--text);
  position: relative;
}
.letter-content{ padding: 28mm 20mm 25mm 20mm; position: relative; }

.header{ display:flex; justify-content: space-between; gap: 16px; align-items:flex-start; }
.header.photo-left  { flex-direction: row-reverse; }
.header.photo-right { flex-direction: row; }
.header.photo-top   { flex-direction: column; align-items:flex-start; }

.sender{ max-width: 70%; }
.sender-name{ font-weight: 600; }

.photo-wrap { display:flex; align-items:center; justify-content:center; }

/* Blocks */
.recipient{ margin-top: 22mm; border-left: 3px solid var(--accent, #cf4f4f); padding: 6mm; white-space: pre-line; }
.contact{ margin: 12mm 0 4mm; display: grid; grid-template-columns: 1fr; gap: 2mm; }
.date{ text-align: right; margin: 6mm 0; }
.title{ font-weight: 700; letter-spacing: .5px; text-transform: uppercase; border-bottom: 3px solid var(--accent,#cf4f4f); padding-bottom: 2mm; margin-bottom: 6mm; }
.body{ line-height: 1.6; }
.paragraph{ margin: 0 0 5mm; }
.signature-block{ margin-top: 12mm; }
.signature{ max-height: 18mm; display:block; }
.farewell{ margin-bottom: 6mm; }
.name{ font-weight: 600; }

/* Editable */
[contenteditable]{ outline: none; }
.editable-block{ position: relative; }
.editable-block:focus{ box-shadow: inset 0 0 0 2px rgba(0,0,0,.2); border-radius: 4px; }
.muted{ color: #555; }

/* Calque corner en dessous de la photo */
.corner-layer{ position:absolute; inset:0; pointer-events:none; z-index:1; }
.photo-wrap{ position: relative; z-index: 3; }
</style>
