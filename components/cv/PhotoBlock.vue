<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  src?: string
  width?: string
  height?: string
  shape?: 'square' | 'circle'

  /* NEW: variantes d’habillage */
  variant?: 'plain' | 'frame' | 'elevated' | 'elevated-frame'
  frameColor?: string
  frameWidth?: number        // px
  framePadding?: number      // px
  frameBg?: string

  /* Ombres existantes */
  shadowEnabled?: boolean
  shadowElevation?: number   // 0–24
  shadowColor?: string       // ex: 'rgba(0,0,0,.22)'
  shadowCustom?: string      // ex: '0 10px 20px rgba(0,0,0,.18)'
}>()

const emit = defineEmits<{
  (e: 'update:src', value: string): void
  (e: 'delete-section'): void
}>()

const hover  = ref(false)
const fileEl = ref<HTMLInputElement | null>(null)

const width  = props.width  ?? '48mm'
const height = props.height ?? '48mm'
const shapeClass = computed(() => (props.shape === 'circle' ? 'circle' : 'square'))

/* ===== Ombres (présets) ===== */
const ELEVATION: Record<number, string> = {
  0:'none',
  1:'0 1px 2px rgba(0,0,0,.12), 0 1px 1px rgba(0,0,0,.10)',
  2:'0 2px 4px rgba(0,0,0,.12), 0 2px 2px rgba(0,0,0,.10)',
  3:'0 4px 8px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.10)',
  4:'0 6px 12px rgba(0,0,0,.14), 0 3px 6px rgba(0,0,0,.10)',
  6:'0 8px 16px rgba(0,0,0,.16), 0 4px 6px rgba(0,0,0,.10)',
  8:'0 10px 20px rgba(0,0,0,.18), 0 6px 10px rgba(0,0,0,.12)',
  12:'0 14px 28px rgba(0,0,0,.20), 0 10px 10px rgba(0,0,0,.12)',
  16:'0 18px 32px rgba(0,0,0,.22), 0 14px 12px rgba(0,0,0,.12)',
  24:'0 24px 48px rgba(0,0,0,.24), 0 16px 16px rgba(0,0,0,.12)',
}

/** Appliquer l’ombre si:
 *  - shadowEnabled = true, ou
 *  - variant contient 'elevated'
 */
const applyShadow = computed(() =>
  !!(props.shadowEnabled || (props.variant && props.variant.includes('elevated')))
)

function buildShadow(): { boxShadow?: string; filter?: string } {
  if (!applyShadow.value) return {}

  // base (custom > elevation preset)
  let base = props.shadowCustom
  if (!base) {
    const elevs = Object.keys(ELEVATION).map(Number).sort((a,b)=>a-b)
    const wanted = Math.max(0, Math.min(24, props.shadowElevation ?? 0))
    let nearest = elevs[0]
    for (const e of elevs) if (Math.abs(e - wanted) < Math.abs(nearest - wanted)) nearest = e
    base = ELEVATION[nearest]
    if (props.shadowColor) base = base.replaceAll(/rgba?\([^)]+\)/g, props.shadowColor)
  }

  // cercle => drop-shadow (première couche), carré => box-shadow
  return props.shape === 'circle'
    ? { filter: `drop-shadow(${base.split(',')[0].trim()})` }
    : { boxShadow: base }
}

/* ===== Style du cadre (variant 'frame' / 'elevated-frame') ===== */
function buildFrame(): Record<string,string> {
  const wantsFrame = props.variant === 'frame' || props.variant === 'elevated-frame'
  if (!wantsFrame) return {}

  const border = `${props.frameWidth ?? 3}px solid ${props.frameColor ?? 'var(--primary)'}`
  const padding = `${props.framePadding ?? 2}px`
  const bg = props.frameBg ?? '#fafafa'  // ou 'var(--paper)'
  return { border, padding, background: bg }
}

/* style final de la frame */
const frameStyle = computed(() => ({
  ...buildFrame(),
  ...buildShadow(),
}))

function triggerFile(){ fileEl.value?.click() }
function onFile(e: Event){
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]; if(!file) return
  const reader = new FileReader()
  reader.onload = () => { emit('update:src', String(reader.result || '')); input.value='' }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div
    class="photo-block"
    :class="shapeClass"
    :style="{ width, height }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <!-- conteneur avec arrondi + shadow/cadre -->
    <div class="frame" :class="{ placeholder: !src }" :style="frameStyle">
      <img v-if="src" :src="src" alt="photo" />
      <div v-else class="ph">📷</div>
    </div>

    <transition name="fade">
      <div v-if="hover" class="overlay">
        <v-btn icon="mdi-delete" variant="text" size="small" class="btn tl" color="error"
               @click.stop="$emit('delete-section')" />
        <v-btn icon="mdi-upload" variant="text" size="small" class="btn tr"
               @click.stop="triggerFile" />
        <v-btn v-if="src" icon="mdi-close" variant="text" size="small" class="btn br" color="warning"
               @click.stop="$emit('update:src','')" />
      </div>
    </transition>

    <input ref="fileEl" type="file" accept="image/*" class="hidden" @change="onFile" />
  </div>
</template>

<style scoped>
.photo-block{ position:relative; }
.square { border-radius: 8px; }
.circle { border-radius: 50%; }

.frame{
  width:100%; height:100%;
  display:flex; align-items:center; justify-content:center;
  border-radius: inherit;      /* même arrondi que le parent */
  overflow:hidden;             /* masque l’image */
  background:#fafafa;
  transition: box-shadow .2s ease, filter .2s ease, border-color .2s ease;
}

.frame img{ width:100%; height:100%; object-fit:cover; }
.ph{ font-size:28px; opacity:.5; }

.overlay{
  position:absolute; inset:0;
  background:linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,.08));
  border-radius: inherit;
}
.btn{ position:absolute; }
.tl{ top:6px; left:6px; } .tr{ top:6px; right:6px; } .br{ bottom:6px; right:6px; }

.fade-enter-active,.fade-leave-active{ transition:opacity .15s ease; }
.fade-enter-from,.fade-leave-to{ opacity:0; }
.hidden{ display:none; }
.placeholder{ border-style:dashed; }
</style>
