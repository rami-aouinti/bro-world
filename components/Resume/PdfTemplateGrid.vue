<script setup lang="ts">
import { ref, computed } from 'vue'
import { CV_PRESETS, type CvPreset, getPresetByKey, addDownload } from '~/presets/cvPresets'

type TemplateItem = {
  id: string
  title: string
  subtitle?: string
  category: 'Classic' | 'Creative' | 'All'
  template: 'CV' | 'Cover' | 'All'
  badge?: 'TOP' | 'NEU'
  previewImg: string
  pdfUrl: string
  pages?: number
  tags?: string[]
}

const presets = ref<CvPreset[]>(CV_PRESETS)

/** Filtres (pour la grille "templates" démo) */

const filter = ref<'All' | 'Classic' | 'Creative' | 'CV' | 'Cover'>('All')
const filtered = computed(() =>
  filter.value === 'All' ? presets.value : presets.value.filter(t => t.category === filter.value || t.template === filter.value)
)

/** Preview modal (utilise des infos du preset) */
const previewOpen = ref(false)
const previewTitle = ref<string>('')
const previewSrc = ref<string>('')

function openPresetPreview(p: CvPreset) {
  previewTitle.value = p.label
  previewSrc.value = p.src
  previewOpen.value = true
}

function downloadPdfFromPreset(p: CvPreset) {
  addDownload(p) // compteur local
  const a = document.createElement('a')
  a.href = p.src
  a.download = `${p.key}.pdf`
  a.target = '_blank'
  a.rel = 'noopener'
  a.click()
}

/** Navigation (Nuxt 3) */
function selectPreset(p: CvPreset) {
  navigateTo(`/cv/template/${p.key}`)
}
</script>

<template>
  <div class="px-4 py-6">
    <!-- Filtres -->
    <div class="d-flex justify-center mb-6 ga-3">
      <v-btn density="compact" :color="filter==='All' ? 'primary' : undefined" variant="elevated" rounded="xl" @click="filter='All'">
        All
      </v-btn>
      <v-btn density="compact" :color="filter==='CV' ? 'primary' : undefined" variant="elevated" rounded="xl" @click="filter='CV'">
        CV
      </v-btn>
      <v-btn density="compact" :color="filter==='Cover' ? 'primary' : undefined" variant="elevated" rounded="xl" @click="filter='Cover'">
        Cover Letter
      </v-btn>
      <v-btn density="compact" :color="filter==='Classic' ? 'primary' : undefined" variant="elevated" rounded="xl" @click="filter='Classic'">
        Classic
      </v-btn>
      <v-btn density="compact" :color="filter==='Creative' ? 'primary' : undefined" variant="elevated" rounded="xl" @click="filter='Creative'">
        Creative
      </v-btn>
    </div>

    <!-- PRESETS -->
    <v-row dense>
      <v-col
        v-for="p in filtered"
        :key="p.key"
        class="d-flex"
      >
        <v-hover v-slot="{ isHovering, props: hoverProps }">
          <v-card
            v-bind="hoverProps"
            class="preset-card my-2 cursor-pointer"
            :class="isHovering ? 'border border-radius-xl border-secondary border-md shadow-2xl shadow-primary' : ''"
            :elevation="isHovering ? 20 : 4"
            role="button"
            tabindex="0"
            width="220"
            @click="selectPreset(p)"
            @keydown.enter.prevent="selectPreset(p)"
            @keydown.space.prevent="selectPreset(p)"
          >
            <v-img
              :src="p.previewImg"
              :alt="p.label"
              height="220"
              cover
              class="rounded-t"
            >

              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height text-medium-emphasis">
                  Loading…
                </div>
              </template>
            </v-img>

            <v-divider />

            <v-card-text class="py-1 text-default text-center font-weight-600 text-body-2">
              {{ p.label }}
            </v-card-text>

            <v-card-actions class="py-0 d-flex justify-space-between">
              <!-- Preview -->
              <v-tooltip text="Preview">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    density="comfortable"
                    color="primary"
                    variant="text"
                    prepend-icon="mdi-eye-outline"
                    @click.stop="openPresetPreview(p)"
                  >{{ p.views }}</v-btn>
                </template>
              </v-tooltip>

              <!-- Download -->
              <v-tooltip text="Download">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    density="comfortable"
                    color="default"
                    variant="text"
                    prepend-icon="mdi-download"
                    @click.stop="downloadPdfFromPreset(p)"
                  >{{ p.downloads }}</v-btn>
                </template>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <!-- Dialog Preview PDF -->
    <v-dialog v-model="previewOpen" max-width="960">
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center">
          <span class="text-h6">{{ previewTitle }}</span>
          <v-spacer />
          <v-btn icon variant="text" @click="previewOpen=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-0">
          <div style="height:70vh;">
            <iframe
              v-if="previewSrc"
              :src="previewSrc"
              title="Preview PDF"
              style="width:100%; height:100%; border:0;"
            ></iframe>
            <div v-else class="pa-6 text-medium-emphasis">Aucun PDF disponible.</div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.template-card {
  transition: transform .15s ease, box-shadow .15s ease;
}
.template-card:hover { transform: translateY(-2px); }

.preset-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.25), rgba(0,0,0,0));
}
</style>
