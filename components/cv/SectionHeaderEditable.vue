<template>
  <div class="section-header-editable d-flex align-center">
    <button class="icon-btn" @click="dialog = true" :title="icon || 'Icon'">
      <span class="svg-icon" v-html="svgFor(iconLocal || icon)" />
    </button>

    <EditableText
      v-model="titleLocal"
      class="title"
      :placeholder="'Section title...'"
    />
  </div>

  <!-- Picker d’icône (SVG inline) -->
  <v-dialog v-model="dialog" max-width="520">
    <v-card rounded="xl">
      <v-card-title class="text-subtitle-1 font-weight-bold">Choose icon</v-card-title>
      <v-card-text>
        <v-text-field v-model="search" label="Filtrer (mdi-...)" density="compact" class="mb-3" />
        <div class="icon-grid">
          <button
            v-for="ic in filtered"
            :key="ic"
            type="button"
            class="icon-cell"
            :class="{ selected: ic === iconLocal }"
            @click="iconLocal = ic"
            :title="ic"
          >
            <span class="svg-icon" v-html="svgFor(ic)" />
          </button>
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="applyIcon">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import EditableText from '~/components/common/EditableText.vue'

const props = defineProps<{
  title: string
  icon?: string
}>()
const emit = defineEmits<{
  (e:'update:title', v:string): void
  (e:'update:icon', v:string|undefined): void
  (e:'remove'): void
}>()

const titleLocal = ref(props.title)
const iconLocal  = ref(props.icon)
watch(() => props.title, v => (titleLocal.value = v))
watch(() => props.icon,  v => (iconLocal.value  = v))
watch(titleLocal, v => emit('update:title', v))

const dialog = ref(false)
const search = ref('')

/** --- Mini set d’icônes (SVG inline) --- */
type IconName =
  | 'mdi-briefcase' | 'mdi-school' | 'mdi-lightbulb' | 'mdi-translate' | 'mdi-heart'
  | 'mdi-certificate' | 'mdi-trophy' | 'mdi-star' | 'mdi-cog' | 'mdi-account' | 'mdi-book'
  | 'mdi-language-javascript' | 'mdi-language-php' | 'mdi-language-html5' | 'mdi-language-css3'
  | 'mdi-file-document-outline' | 'mdi-certificate-outline' | 'mdi-medal-outline'
  | 'mdi-shape-outline' // fallback

const SVG_MAP: Record<IconName, string> = {
  'mdi-briefcase': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M10 4h4a2 2 0 0 1 2 2v2h3a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1h3V6a2 2 0 0 1 2-2m4 4V6h-4v2h4Z"/></svg>`,
  'mdi-school': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Z"/></svg>`,
  'mdi-lightbulb': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9 21h6v-1H9v1m3-19a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2Z"/></svg>`,
  'mdi-translate': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12.87 15.07 10 12.2l.94-.94.93.93a8 8 0 0 0 2.86-5.07H16V5h-3V4h-2v1H8v1h2.03a6 6 0 0 1-2.23 3.5L6.5 9l-.71.71L7.21 11l-3.2 3.2L5 15.4l3.2-3.19 2.87 2.86 1.8 1.8 1.8-1.8zM20 20h-2l-1-3h-4l-1 3h-2l4-10h2l4 10m-5.5-5h3l-1.5-4-1.5 4Z"/></svg>`,
  'mdi-heart': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12.1 18.55 12 18.65l-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5A4 4 0 0 1 12 7a4 4 0 0 1 4.5-2C18.5 5 20 6.5 20 8.5c0 2.89-3.14 5.74-7.9 10.05Z"/></svg>`,
  'mdi-certificate': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="m17 5 1.74.41 1.26-1.26.41 1.74L22 7l-1.59 1.11.41 1.74-1.26-1.26L17 9l.41-1.74L16 7l1-1 .41-1.74Z"/></svg>`,
  'mdi-trophy': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18 2v2h2v3a5 5 0 0 1-4 4.9V14h2v2H6v-2h2v-2.1A5 5 0 0 1 4 7V4h2V2h12Z"/></svg>`,
  'mdi-star': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 17.27 18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"/></svg>`,
  'mdi-cog': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 8a4 4 0 1 1-4 4 4 4 0 0 1 4-4m8.94 4a7.94 7.94 0 0 0-.05-1l2.11-1.65-2-3.46-2.49 1a7.26 7.26 0 0 0-1.73-1L14.5 2h-5L8.2 5.89a7.26 7.26 0 0 0-1.73 1l-2.49-1-2 3.46L4.09 11a7.94 7.94 0 0 0 0 2l-2.11 1.65 2 3.46 2.49-1a7.26 7.26 0 0 0 1.73 1L9.5 22h5l1.3-3.89a7.26 7.26 0 0 0 1.73-1l2.49 1 2-3.46L19.91 13a7.94 7.94 0 0 0 .05-1Z"/></svg>`,
  'mdi-account': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 19.2c-2.5 0-4.71-1.28-6-3.2 0-2 3.97-3.1 6-3.1s6 1.1 6 3.1c-1.29 1.92-3.5 3.2-6 3.2M12 5a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z"/></svg>`,
  'mdi-book': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18 2H8a2 2 0 0 0-2 2v16a2 2 0 0 1 2-2h10v2h2V4a2 2 0 0 0-2-2Z"/></svg>`,
  'mdi-language-javascript': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 3h18v18H3V3m8 14V7h2v8h3v2h-5m-5-2v-2h2v2h1v-4H9V7h4v8a2 2 0 0 1-2 2H6Z"/></svg>`,
  'mdi-language-php': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M2 12c0-3.31 4.48-6 10-6s10 2.69 10 6-4.48 6-10 6-10-2.69-10-6m5.5 2h1.5l.5-2h1l-.5 2h1.5l1-4h-1.5l-.5 2h-1l.5-2H8.5l-1 4m6-4-1 4h1.5l.5-2h1l-.5 2H16l1-4h-1.5l-.5 2h-1l.5-2H14Z"/></svg>`,
  'mdi-language-html5': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2 3 3l1.5 17L12 22l7.5-2L21 3 12 2m0 17-5.5-1.5L6 5h12l-.5 12.5L12 19Z"/></svg>`,
  'mdi-language-css3': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2 3 3l1.5 17L12 22l7.5-2L21 3 12 2m4.5 6H9l.2 2h7l-.4 4-3.8 1.1-3.8-1.1-.2-2h1.9l.1 1 .9.3.9-.3.1-1H8.2L7.6 8h8.9l-.4 2Z"/></svg>`,
  'mdi-file-document-outline': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V8l-4-6m1 13H7v-2h8v2m0-4H7V9h8v2Z"/></svg>`,
  'mdi-certificate-outline': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M15 2 5 7v10l10 5 10-5V7L15 2m0 2.18L22.47 7 15 10.82 7.53 7 15 4.18Z"/></svg>`,
  'mdi-medal-outline': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17 3H7v6l5 2 5-2V3m-5 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z"/></svg>`,
  'mdi-shape-outline': `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 3h8v8H3V3m10 0h8v8h-8V3M3 13h8v8H3v-8m10 0h8v8h-8v-8Z"/></svg>`,
}

const ICONS: IconName[] = [
  'mdi-briefcase','mdi-school','mdi-lightbulb','mdi-translate','mdi-heart',
  'mdi-certificate','mdi-trophy','mdi-star','mdi-cog','mdi-account','mdi-book',
  'mdi-language-javascript','mdi-language-php','mdi-language-html5','mdi-language-css3',
  'mdi-file-document-outline','mdi-certificate-outline','mdi-medal-outline',
  'mdi-shape-outline',
]

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? ICONS.filter(i => i.includes(q)) : ICONS
})

function svgFor(name?: string) {
  const key = (name as IconName) || 'mdi-shape-outline'
  return SVG_MAP[key] || SVG_MAP['mdi-shape-outline']
}

function applyIcon(){
  emit('update:icon', iconLocal.value || undefined)
  dialog.value = false
}
</script>

<style scoped>
.section-header-editable{
  position: relative;
  padding-bottom: 6px;
  border-bottom: 3px solid var(--accent, #b88b6a);
}
.icon-btn{
  border: none; background: transparent; cursor: pointer;
  display:flex; align-items:center; justify-content:center; margin-right:8px;
}
.svg-icon { width: 20px; height: 20px; display:inline-grid; place-items:center; }
.title{ font-weight: 800; font-size: 1.1rem; }

.icon-grid{
  display:grid; grid-template-columns: repeat(auto-fill, minmax(44px,1fr)); gap:8px;
}
.icon-cell{
  width:44px;height:44px;border-radius:12px;border:1px solid rgba(0,0,0,.08);
  display:flex;align-items:center;justify-content:center; cursor:pointer;
  transition: box-shadow .12s ease, transform .12s ease, border-color .12s ease;
}
.icon-cell:hover{ transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.icon-cell.selected{ outline:2px solid var(--accent,#b88b6a); }
</style>
