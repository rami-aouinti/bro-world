<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPresetByKey, addView, addDownload, type CvPreset } from '~/presets/cvPresets'

const route = useRoute()
const id = computed(() => String(route.params.id))
const canTeleport = ref(false)
const preset = ref<CvPreset | undefined>(undefined)

onMounted(async () => {
  preset.value = getPresetByKey(id.value)
  if (preset.value) addView(preset.value)
  window.scrollTo({top: 0})
  await nextTick()
  setTimeout(() => {
    canTeleport.value = !!document.getElementById('menu-bar-world')
  }, 200)
})

function downloadPdf() {
  if (!preset.value) return
  addDownload(preset.value)
  const a = document.createElement('a')
  a.href = preset.value.src
  a.download = `${preset.value.key}.pdf`
  a.target = '_blank'
  a.rel = 'noopener'
  a.click()
}

function startEditing() {
  // Branche ici ton éditeur/constructeur
  // ex: navigateTo(`/builder/${id.value}`)
  console.log('Start editing with template:', id.value)
}
</script>

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
              <v-card rounded="xl" style="background-color: transparent;" class="mx-auto">
                <v-card-item>
                  <div class="text-h7 text-default d-flex align-center ga-1">
                    {{ preset?.label || id }}
                  </div>

                  <div class="mt-1 text-caption text-medium-emphasis">
                    Schrift: {{ preset?.fontFamily }} · Base: {{ preset?.baseSize }}
                  </div>

                  <div class="mt-1 d-flex flex-wrap ga-1">
                    <v-chip size="x-small" variant="flat" color="primary">Views: {{ preset?.views ?? 0 }}</v-chip>
                    <v-chip size="x-small" variant="flat" color="secondary">Downloads: {{ preset?.downloads ?? 0 }}</v-chip>
                    <v-chip size="x-small" variant="tonal">Layout: {{ preset?.layout }}</v-chip>
                  </div>
                </v-card-item>

                <v-card-actions class="px-4">
                  <v-btn prepend-icon="mdi-pencil" color="primary" variant="elevated" rounded="lg" @click="startEditing">
                    Use this template
                  </v-btn>
                  <v-spacer />
                  <v-btn icon variant="text" @click="downloadPdf">
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </MotionGroup>
          </v-list>
        </div>
      </teleport>
    </client-only>
    <v-card rounded="xl" elevation="4" class="overflow-hidden">
      <v-card-title class="text-subtitle-1">
        PDF Preview
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-0">
        <div style="height:70vh;">
          <iframe
            v-if="preset?.src"
            :src="preset.src"
            title="PDF Preview"
            style="width:100%; height:100%; border:0;"
          ></iframe>
          <div v-else class="pa-6 text-medium-emphasis">Aucun PDF disponible pour ce template.</div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.custom-list {
  background-color: transparent;
}
.preset-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}
</style>
