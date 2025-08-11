<script setup lang="ts">
import { ref } from 'vue'
import Preview from "~/components/Job/Resume/Preview.vue";

// --- Types
type TemplateItem = {
  id: string
  title: string
  subtitle?: string
  category: 'Klassisch' | 'Kreativ' | 'Alle'
  badge?: 'TOP' | 'NEU'
  previewImg: string
  pdfUrl: string
  pages?: number
  tags?: string[]
}

// --- Données d’exemple (remplace par les tiennes ou passe en props)
const templates = ref<TemplateItem[]>([
  {
    id: 'cv-2025',
    title: 'Lebenslauf 2025',
    subtitle: 'Moderne, sauber',
    category: 'Kreativ',
    badge: 'TOP',
    previewImg: '/img/cv/cv-1.png',
    pdfUrl: '/samples/cv-2025.pdf',
    pages: 2,
    tags: ['Modern']
  },
  {
    id: 'kopfzeile',
    title: 'Lebenslauf Kopfzeile',
    subtitle: 'Seriös, schlicht',
    category: 'Klassisch',
    previewImg: '/img/cv/cv-4.png',
    pdfUrl: '/samples/cv-kopfzeile.pdf',
    pages: 1,
    tags: ['Klassisch']
  },
  {
    id: 'cv-2024',
    title: 'Lebenslauf 2024',
    subtitle: 'Kompakt, klar',
    category: 'Klassisch',
    badge: 'NEU',
    previewImg: '/img/cv/cv-2.png',
    pdfUrl: '/samples/cv-2024.pdf',
    pages: 1,
    tags: ['Einseitig']
  },
  {
    id: 'cv-2026',
    title: 'Lebenslauf 2026',
    subtitle: 'Moderne, sauber',
    category: 'Kreativ',
    badge: 'TOP',
    previewImg: '/img/cv/cv-5.png',
    pdfUrl: '/samples/cv-2026.pdf',
    pages: 2,
    tags: ['Modern']
  },
  {
    id: 'kopfzeile5',
    title: 'Lebenslauf Kopfzeile',
    subtitle: 'Seriös, schlicht',
    category: 'Klassisch',
    previewImg: '/img/cv/cv-1.png',
    pdfUrl: '/samples/cv-kopfzeile.pdf',
    pages: 1,
    tags: ['Klassisch']
  },
  {
    id: 'cv-2026',
    title: 'Lebenslauf 2024',
    subtitle: 'Kompakt, klar',
    category: 'Klassisch',
    badge: 'NEU',
    previewImg: '/img/cv/cv-3.png',
    pdfUrl: '/samples/cv-2024.pdf',
    pages: 1,
    tags: ['Einseitig']
  },
])

// --- Filtre
const filter = ref<'Alle' | 'Klassisch' | 'Kreativ'>('Alle')
const filtered = computed(() =>
  filter.value === 'Alle' ? templates.value : templates.value.filter(t => t.category === filter.value)
)

// --- Aperçu
const previewOpen = ref(false)
const previewItem = ref<TemplateItem | null>(null)
function openPreview(item: TemplateItem) {
  previewItem.value = item
  previewOpen.value = true
}
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
// --- Actions
function useTemplate(item: TemplateItem) {
  // branche ce que tu veux (naviguer vers un éditeur, etc.)
  // e.g. navigateTo(`/builder/${item.id}`)
  console.log('Use template:', item.id)
}

function downloadPdf(item: TemplateItem) {
  const a = document.createElement('a')
  a.href = item.pdfUrl
  a.download = `${item.id}.pdf`
  a.target = '_blank'
  a.rel = 'noopener'
  a.click()
}
</script>

<template>
  <div class="px-4 py-6">
    <!-- Filtres -->
    <div class="d-flex justify-center mb-6 ga-3">
      <v-btn :color="filter==='Alle' ? 'primary' : undefined" variant="elevated" rounded="xl" @click="filter='Alle'">
        Alle
      </v-btn>
      <v-btn :color="filter==='Klassisch' ? 'primary' : undefined" variant="tonal" rounded="xl" @click="filter='Klassisch'">
        Klassisch
      </v-btn>
      <v-btn :color="filter==='Kreativ' ? 'primary' : undefined" variant="tonal" rounded="xl" @click="filter='Kreativ'">
        Kreativ
      </v-btn>
    </div>

    <!-- Grille -->
    <v-row dense>
      <v-col
        v-for="item in filtered"
        :key="item.id"
        cols="12" sm="6" md="3"
      >
        <v-card class="template-card" rounded="xl" elevation="4" hover>
          <v-img
            :src="item.previewImg"
            height="250"
            cover
            class="rounded-t-xl"
          >
            <!-- Badge -->
            <template #sources></template>
            <div v-if="item.badge" class="badge-chip">
              <v-chip color="red" label size="small" class="text-white">
                {{ item.badge }}
              </v-chip>
            </div>

            <!-- Gradient overlay -->
            <div class="overlay"></div>
          </v-img>

          <v-card-item>
            <div class="text-h7">{{ item.title }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.subtitle }}</div>

            <div class="mt-2 d-flex flex-wrap ga-2">
              <v-chip v-for="tag in (item.tags ?? [])" :key="tag" size="x-small" variant="tonal">{{ tag }}</v-chip>
              <v-chip v-if="item.pages" size="x-small" variant="flat" color="primary">{{ item.pages }} Seite(n)</v-chip>
            </div>
          </v-card-item>

          <v-card-actions class="px-4 pb-4 pt-0">
            <v-btn prepend-icon="mdi-eye-outline" color="primary"  variant="text" @click="openPreview(item)">

            </v-btn>
            <v-btn prepend-icon="mdi-download" color="primary"  variant="text" @click="downloadPdf(item)">

            </v-btn>
            <v-btn prepend-icon="mdi-thumb-up" color="primary" variant="text"  rounded="lg" @click="useTemplate(item)">
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog d’aperçu PDF -->
    <v-dialog v-model="previewOpen" max-width="960">
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center">
          <span class="text-h6">{{ previewItem?.title }}</span>
          <v-spacer />
          <v-btn icon variant="text" @click="previewOpen=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider />

        <v-card-text class="pa-0">
          <Preview :data="data" />
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="previewItem && useTemplate(previewItem)">Use</v-btn>
          <v-btn variant="tonal" @click="previewItem && downloadPdf(previewItem)">Download</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.template-card {
  transition: transform .15s ease, box-shadow .15s ease;
}
.template-card:hover {
  transform: translateY(-2px);
}

.badge-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.25), rgba(0,0,0,0));
}
</style>
