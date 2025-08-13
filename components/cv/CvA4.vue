<!-- components/cv/CvA4.vue -->
<template>
  <div class="a4" :style="pageStyle" :class="[`layout--${ui.layout}`]">
    <!-- Fond de sidebar est peint par ::before -->

    <!-- VBar décorative -->
    <div v-if="vbar.show" class="vbar" :class="`vbar--${vbar.side}`" />
    <div id="cv-corner" style="position:absolute; inset-block-start:0; inset-inline-start:0; width:1px; height:1px;"></div>

    <!-- Corner, au-dessus du fond mais sous le contenu -->
    <CornerDecoration
      v-if="cornerForDecoration"
      class="corner-layer"
      :key="cornerKey"
      :corner="cornerForDecoration"
      :default-accent="ui.accent"
      :default-primary="ui.primary"
    />

    <div class="grid">
      <!-- Identity -->
      <div class="identity">
        <div class="identity-left d-flex align-center justify-center">
          <!-- Photo à gauche (sans sidebar et sans vbar) -->
          <div
            id="cv-photo"
            v-if="ui.photo.show && ui.photo.position === 'left' && !usesSidebar && !vbar.show"
            class="photo" :class="photoClass"
            :style="{ width: ui.photo.widthMm + 'mm', height: ui.photo.heightMm + 'mm' }"
          >
            <PhotoBlock
              :key="`${ui.photo.widthMm}x${ui.photo.heightMm}`"
              :src="model.photo"
              @update:src="val => (model.photo = val)"
              @delete-section="ui.photo.show = false"
              :width="`${ui.photo.widthMm}mm`"
              :height="`${ui.photo.heightMm}mm`"
              :shape="ui.photo.shape"
              :variant="ui.photo.variant"
              :frame-width="ui.photo.frameWidth"
              :frame-padding="ui.photo.framePadding"
              :frame-color="ui.photo.frameColor || ui.primary"
              :frame-bg="ui.photo.frameBg || '#fff'"
              :shadow-enabled="ui.photo.shadow.enabled"
              :shadow-elevation="ui.photo.shadow.elevation"
              :shadow-color="ui.photo.shadow.color"
              :shadow-custom="ui.photo.shadow.custom"
            />

          </div>

          <div class="mx-4">
            <EditableText v-model="model.identity.name" class="cv-title" placeholder="Name eingeben" />
            <EditableText v-model="model.identity.headline" class="subtitle" placeholder="Berufsbezeichnung eingeben" />
            <slot v-if="!usesSidebar && ui.photo.heightMm >= 60" name="personal" />
          </div>

          <v-spacer />

          <!-- Photo à droite (sans sidebar et sans vbar) -->
          <div
            id="cv-photo"
            v-if="ui.photo.show && ui.photo.position === 'right' && !usesSidebar && !vbar.show"
            class="photo" :class="photoClass"
            :style="{ width: ui.photo.widthMm + 'mm', height: ui.photo.heightMm + 'mm' }"
          >
            <PhotoBlock
              :key="`${ui.photo.widthMm}x${ui.photo.heightMm}`"
              :src="model.photo"
              @update:src="val => (model.photo = val)"
              @delete-section="ui.photo.show = false"
              :width="`${ui.photo.widthMm}mm`"
              :height="`${ui.photo.heightMm}mm`"
              :shape="ui.photo.shape"
              :variant="ui.photo.variant"
              :frame-width="ui.photo.frameWidth"
              :frame-padding="ui.photo.framePadding"
              :frame-color="ui.photo.frameColor || ui.primary"
              :frame-bg="ui.photo.frameBg || '#fff'"
              :shadow-enabled="ui.photo.shadow.enabled"
              :shadow-elevation="ui.photo.shadow.elevation"
              :shadow-color="ui.photo.shadow.color"
              :shadow-custom="ui.photo.shadow.custom"
            />
          </div>
        </div>

        <!-- si pas de sidebar et petite photo -->
        <slot v-if="!usesSidebar && ui.photo.heightMm < 60" name="personal" />
      </div>

      <!-- Main content -->
      <div class="main">
        <slot name="experience" />
        <slot name="education" />
        <slot name="skills" />
        <slot name="interests" />
      </div>

      <!-- Sidebar (layout sidebar-left/right) -->
      <div v-if="usesSidebar" class="sidebar me-5">
        <div
          id="cv-photo"
          v-if="ui.photo.show"
          class="photo d-flex align-center justify-center text-center my-1"
          :class="photoClass"
          :style="{ width: ui.photo.widthMm + 'mm', height: ui.photo.heightMm + 'mm' }"
          style="justify-self: center;"
        >
          <PhotoBlock
            :key="`${ui.photo.widthMm}x${ui.photo.heightMm}`"
            :src="model.photo"
            @update:src="val => (model.photo = val)"
            @delete-section="ui.photo.show = false"
            :width="`${ui.photo.widthMm}mm`"
            :height="`${ui.photo.heightMm}mm`"
            :shape="ui.photo.shape"
            :variant="ui.photo.variant"
            :frame-width="ui.photo.frameWidth"
            :frame-padding="ui.photo.framePadding"
            :frame-color="ui.photo.frameColor || ui.primary"
            :frame-bg="ui.photo.frameBg || '#fff'"
            :shadow-enabled="ui.photo.shadow.enabled"
            :shadow-elevation="ui.photo.shadow.elevation"
            :shadow-color="ui.photo.shadow.color"
            :shadow-custom="ui.photo.shadow.custom"
          />
        </div>
        <slot name="sidebar" />
      </div>

      <!-- Footer -->
      <div class="footer">
        <div id="cv-signature"></div>
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { CvPreset } from '@/presets/cvPresets'
import type { UiState } from '@/types/ui/types'
import CornerDecoration from '~/components/cv/CornerDecoration.vue'
import PhotoBlock from '~/components/cv/PhotoBlock.vue'
import EditableText from '~/components/common/EditableText.vue'

const props = defineProps<{ model:any; preset:CvPreset; ui:UiState }>()
const { model, preset, ui } = toRefs(props)

const usesSidebar = computed(() => ['sidebar-right','sidebar-left'].includes(ui.value.layout))

/* vbar normalisée */
const vbar = computed(() => {
  const vb = ui.value?.vbar ?? preset.value?.vbar ?? null
  if (!vb) return { show:false, side:'left', color:'transparent', widthMm:0, offsetMm:0 }
  return {
    show: !!vb.show,
    side: vb.side ?? 'left',
    color: vb.color ?? (ui.value.primary ?? preset.value.palette.primary),
    widthMm: vb.widthMm ?? 0,
    offsetMm: vb.offsetMm ?? 0,
  }
})

/* corner normalisé */
const normalizedCorner = computed(() => {
  const c = ui.value?.corner ?? preset.value?.corner ?? null
  if (!c) return null
  const type = (c as any).type ?? (c as any).style ?? 'quarter'
  return {
    enabled:  (c as any).enabled ?? true,
    type,
    anchor:   (c as any).anchor ?? 'top-left',
    sizeMm:   (c as any).sizeMm ?? 30,
    color:    (c as any).color  ?? (ui.value.accent ?? preset.value.palette.accent),
    color2:   (c as any).color2,
    offsetMmX:(c as any).offsetMmX ?? 0,
    offsetMmY:(c as any).offsetMmY ?? 0,
    rotateDeg:(c as any).rotateDeg ?? 0,
  }
})
const cornerForDecoration = computed(() => {
  const n = normalizedCorner.value
  return !n || !n.enabled ? null : { ...n, style: n.type } // compat éventuelle
})

/** Forcer un remount quand un réglage clé change */
const cornerKey = computed(() => {
  const c = cornerForDecoration.value
  if (!c) return 'corner-none'
  return `${c.type}|${c.anchor}|${c.sizeMm}|${c.color}|${c.color2}|${c.offsetMmX}|${c.offsetMmY}|${c.rotateDeg}`
})

const pageStyle = computed(() => ({
  '--primary': ui.value.primary ?? preset.value.palette.primary,
  '--accent':  ui.value.accent  ?? preset.value.palette.accent,
  '--paper':   ui.value.paper   ?? preset.value.palette.paper,
  '--text':    ui.value.text    ?? preset.value.palette.text,
  fontFamily:  ui.value.fontFamily ?? preset.value.fontFamily,
  fontSize:    ui.value.fontSize   ?? preset.value.baseSize,

  '--vbar-color':  vbar.value.color,
  '--vbar-width':  `${vbar.value.widthMm}mm`,
  '--vbar-offset': `${vbar.value.offsetMm}mm`,

  '--sidebar-w':     `${ui.value.sidebar?.widthMm ?? 70}mm`,
  '--sidebar-bg':     ui.value.sidebar?.background ?? '#f7f8fa',
  '--sidebar-text':   ui.value.sidebar?.text ?? 'inherit',
  '--sidebar-border': ui.value.sidebar?.enabled
    ? (ui.value.sidebar?.borderColor ?? '#e6e8ec')
    : 'transparent',

  '--a4-pad':
    ui.value.a4Padding ??
    (ui.value.layout === 'sidebar-left'
      ? '0mm 14mm 0mm 0mm'
      : ui.value.layout === 'sidebar-right'
        ? '0mm 0mm 0mm 14mm'
        : '14mm'),
}))

const photoClass = computed(() => ({
  'is-right':   ui.value.photo.position === 'right',
  'is-left':    ui.value.photo.position === 'left',
  'is-top':     ui.value.photo.position === 'top',
  'is-rounded': ui.value.photo.rounded,
  '--w':        `${ui.value.photo.widthMm}mm`,
  '--h':        `${ui.value.photo.heightMm}mm`,
}))
</script>

<style scoped>
/* ---------- Base page ---------- */
.a4{
  position: relative;
  width:210mm; min-height:297mm;
  color:var(--text);
  padding: var(--a4-pad, 14mm);
  box-shadow:0 2px 10px rgba(0,0,0,.08);
  overflow: visible;
  isolation: isolate;
  background-color: var(--paper);
  background-repeat: no-repeat;   /* pour la bande de sidebar */
}

/* ====== Sidebar background (PRINT SAFE) ====== */
/* LEFT: bande peinte + bordure via ::after */
.layout--sidebar-left.a4{
  background-image: linear-gradient(0deg, var(--sidebar-bg), var(--sidebar-bg));
  background-size: var(--sidebar-w) 100%;
  background-position: left top;
}
.layout--sidebar-left.a4::after{
  content:"";
  position:absolute;
  top:0; bottom:0;
  left: var(--sidebar-w);
  width: 1px;
  background: var(--sidebar-border);
  z-index: 1;            /* sous le contenu, au-dessus du fond */
  pointer-events: none;
}

/* RIGHT: bande peinte + bordure via ::after */
.layout--sidebar-right.a4{
  background-image: linear-gradient(0deg, var(--sidebar-bg), var(--sidebar-bg));
  background-size: var(--sidebar-w) 100%;
  background-position: right top;
}
.layout--sidebar-right.a4::after{
  content:"";
  position:absolute;
  top:0; bottom:0;
  right: var(--sidebar-w);
  width: 1px;
  background: var(--sidebar-border);
  z-index: 1;
  pointer-events: none;
}

/* Corner sous le contenu, au-dessus du fond */
.corner-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1; /* grid doit être au-dessus si nécessaire */
}
/* VBar décorative */
.vbar{
  position:absolute; top:0; bottom:0;
  width: var(--vbar-width, 0);
  background: var(--vbar-color, transparent);
  z-index:1; pointer-events:none;
}
.vbar--left{  left:  var(--vbar-offset, 0); }
.vbar--right{ right: var(--vbar-offset, 0); }

/* Contenu au-dessus */
.grid, .identity, .main, .sidebar, .footer { position: relative; z-index: 2; }
.photo { position: relative; z-index: 3; }

/* ---------- Layouts ---------- */
.grid{ display:grid; grid-auto-rows:min-content; }

/* latest = 2 colonnes */
.layout--latest .grid{
  grid-template-columns: 1fr 1fr;
  column-gap:12mm; row-gap:10mm;
}
.layout--latest .identity{
  grid-column:1 / -1;
  display:flex; justify-content:space-between; align-items:flex-start; gap:12mm;
}
.layout--latest .main{
  grid-column:1 / -1;
  display:grid; grid-template-columns:1fr 1fr; column-gap:12mm; row-gap:12mm;
}
.layout--stacked .grid{
  grid-template-columns: 1fr;
  row-gap:10mm;
}
.layout--stacked .identity{ grid-column:1; }
.layout--stacked .main{
  grid-column:1;
  display:grid; grid-template-columns:1fr; row-gap:12mm;
}
/* sidebar right */
.layout--sidebar-right .grid{
  grid-template-columns: 1fr var(--sidebar-w, 170mm);
  grid-template-areas:
    "identity sidebar"
    "main     sidebar"
    "footer   sidebar";
  column-gap:12mm;
}
.layout--sidebar-right .identity{ grid-area: identity; }
.layout--sidebar-right .main{ grid-area: main; }
.layout--sidebar-right .sidebar{ grid-area: sidebar; }

/* sidebar left */
.layout--sidebar-left .grid{
  grid-template-columns: var(--sidebar-w, 190mm) 1fr;
  grid-template-areas:
    "sidebar identity"
    "sidebar main"
    "sidebar footer";
  column-gap:12mm;
}
.layout--sidebar-left .identity{ grid-area: identity; }
.layout--sidebar-left .main{ grid-area: main; }
.layout--sidebar-left .sidebar{ grid-area: sidebar; }

/* la vraie sidebar reste transparente (le fond est peint par l’a4) */
.layout--sidebar-left  .sidebar,
.layout--sidebar-right .sidebar{
  background: transparent !important;
  border: none !important;
  color: var(--sidebar-text);
  padding: 8mm 4mm;
  box-sizing: border-box;
}

/* ---------- Typo / blocks ---------- */
.cv-title{ margin:0; font-size:32px; font-weight:800; letter-spacing:.1px; }
.subtitle{ margin-bottom:1px; opacity:.8; }
.name{ font-size:32px; font-weight:800; margin-top: 10px; }
.headline{ opacity:.8; margin-bottom:6mm; }
.footer{ margin-top:8mm; text-align:right; }

/* Photo */
.photo{
  width:var(--w); height:var(--h);
  overflow:hidden; background:transparent; border:none; padding:0;
}
.photo:empty{ display:none; }
.photo img{
  display:block; width:100%; height:100%; object-fit:cover;
  background: transparent;
  border: none;
  padding: 0;
  box-sizing: border-box;
}
.photo.is-rounded img{ border-radius:10mm; }

/* Section headers & colonnes dates */
:deep(.section-header){
  margin:0 0 6mm 0; padding-bottom:3mm; border-bottom:3px solid var(--accent);
}
:deep(.exp-item .left),
:deep(.edu-item .left){
  border-bottom:3px;
  padding-bottom:3px;
}

/* Screen vs print */
@media screen {
  .a4 { margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,.08); }
}

@media print {
  html, body { margin:0 !important; padding:0 !important; background:#fff !important; }
  .a4{
    width:210mm !important; min-height:297mm !important;
    margin:0 !important; box-shadow:none !important;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    page-break-after: always;
  }
  .a4:last-child{ page-break-after:auto; }
  /* forcer l’impression des backgrounds */
  .layout--sidebar-left.a4,
  .layout--sidebar-right.a4{
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .section-header, .exp-item, .edu-item, .skill-group, .interests, .personal-grid-wrapper{
    page-break-inside: avoid; break-inside: avoid;
  }
}
</style>


