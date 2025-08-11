<!-- components/cv/CvA4.vue -->
<template>
  <div class="a4" :style="pageStyle" :class="`layout--${ui.layout}`">
    <!-- VBar -->
    <div
      v-if="vbar.show"
      class="vbar"
      :class="`vbar--${vbar.side}`"
    />

    <!-- Corner -->
    <CornerDecoration
      v-if="normalizedCorner"
      :corner="normalizedCorner"
      :default-accent="ui.accent"
      :default-primary="ui.primary"
    />

    <div class="grid">
      <!-- Identity -->
      <div class="identity">
        <div class="identity-left">
          <div class="identity-left d-flex align-center justify-center">
            <div
              v-if="ui.photo.show && ui.photo.position === 'left' && !usesSidebar && !vbar.show"
              class="photo"
              :class="photoClass"
              :style="{ width: ui.photo.widthMm + 'mm', height: ui.photo.heightMm + 'mm' }"
            >
              <template v-if="ui.photo.show">
                <PhotoBlock
                  :key="`${ui.photo.widthMm}x${ui.photo.heightMm}`"
                  :src="model.photo"
                  @update:src="val => (model.photo = val)"
                  :style="{ '--w': ui.photo.widthMm + 'mm', '--h': ui.photo.heightMm + 'mm' }"
                  @delete-section="ui.photo.show = false"
                  :width="`${ui.photo.widthMm}mm`"
                  :height="`${ui.photo.heightMm}mm`"
                  :shape="ui.photo.shape"
                  :shadow-enabled="ui.photo.shadow.enabled"
                  :shadow-elevation="ui.photo.shadow.elevation"
                  :shadow-color="ui.photo.shadow.color"
                  :shadow-custom="ui.photo.shadow.custom"
                />
              </template>
            </div>

            <div class="mx-4">
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
              <slot v-if="!usesSidebar && ui.photo.heightMm >= 60" name="personal" />
            </div>

            <v-spacer />

            <div
              v-if="ui.photo.show && ui.photo.position === 'right' && !usesSidebar && !vbar.show"
              class="photo"
              :class="photoClass"
              :style="{ width: ui.photo.widthMm + 'mm', height: ui.photo.heightMm + 'mm' }"
            >
              <template v-if="ui.photo.show">
                <PhotoBlock
                  :key="`${ui.photo.widthMm}x${ui.photo.heightMm}`"
                  :src="model.photo"
                  :style="{ '--w': ui.photo.widthMm + 'mm', '--h': ui.photo.heightMm + 'mm' }"
                  @update:src="val => (model.photo = val)"
                  @delete-section="ui.photo.show = false"
                  :width="`${ui.photo.widthMm}mm`"
                  :height="`${ui.photo.heightMm}mm`"
                  :shape="ui.photo.shape"
                  :shadow-enabled="ui.photo.shadow.enabled"
                  :shadow-elevation="ui.photo.shadow.elevation"
                  :shadow-color="ui.photo.shadow.color"
                  :shadow-custom="ui.photo.shadow.custom"
                />
              </template>
            </div>
          </div>

          <!-- only show personal block here when there is NO sidebar -->
          <slot v-if="!usesSidebar && ui.photo.heightMm < 60" name="personal" />
        </div>
      </div>

      <!-- Main content -->
      <div class="main">
        <slot name="experience" />
        <slot name="education" />
        <slot name="skills" />
        <slot name="interests" />
      </div>

      <!-- Sidebar (vbar mode) -->
      <div v-if="vbar.show" class="sidebar">
        <div
          v-if="ui.photo.show"
          class="photo d-flex align-center justify-center text-center my-1"
          :class="photoClass"
          :style="{ width: ui.photo.widthMm + 'mm', height: ui.photo.heightMm + 'mm' }"
          style="justify-self: center;"
        >
          <template v-if="ui.photo.show">
            <PhotoBlock
              :key="`${ui.photo.widthMm}x${ui.photo.heightMm}`"
              :src="model.photo"
              :style="{ '--w': ui.photo.widthMm + 'mm', '--h': ui.photo.heightMm + 'mm' }"
              @update:src="val => (model.photo = val)"
              @delete-section="ui.photo.show = false"
              :width="`${ui.photo.widthMm}mm`"
              :height="`${ui.photo.heightMm}mm`"
              :shape="ui.photo.shape"
              :shadow-enabled="ui.photo.shadow.enabled"
              :shadow-elevation="ui.photo.shadow.elevation"
              :shadow-color="ui.photo.shadow.color"
              :shadow-custom="ui.photo.shadow.custom"
            />
          </template>
        </div>
        <slot name="sidebar" />
      </div>

      <!-- Sidebar (layout sidebar-left/right) -->
      <div v-if="usesSidebar" class="sidebar">
        <div
          v-if="ui.photo.show"
          class="photo d-flex align-center justify-center text-center my-1"
          :class="photoClass"
          :style="{ width: ui.photo.widthMm + 'mm', height: ui.photo.heightMm + 'mm' }"
          style="justify-self: center;"
        >
          <template v-if="ui.photo.show">
            <PhotoBlock
              :key="`${ui.photo.widthMm}x${ui.photo.heightMm}`"
              :src="model.photo"
              :style="{ '--w': ui.photo.widthMm + 'mm', '--h': ui.photo.heightMm + 'mm' }"
              @update:src="val => (model.photo = val)"
              @delete-section="ui.photo.show = false"
              :width="`${ui.photo.widthMm}mm`"
              :height="`${ui.photo.heightMm}mm`"
              :shape="ui.photo.shape"
              :shadow-enabled="ui.photo.shadow.enabled"
              :shadow-elevation="ui.photo.shadow.elevation"
              :shadow-color="ui.photo.shadow.color"
              :shadow-custom="ui.photo.shadow.custom"
            />
          </template>
        </div>
        <slot name="sidebar" />
      </div>

      <!-- Footer -->
      <div class="footer">
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

const _props = defineProps<{ model:any; preset:CvPreset; ui:UiState }>()
const { model, preset, ui } = toRefs(_props)

const layout = computed(() => ui.value.layout)

/** vbar normalisé (évite les undefined) */
const vbar = computed(() => {
  const vb = ui.value?.vbar ?? preset.value?.vbar ?? null
  if (!vb) return { show: false, side: 'left', color: 'transparent', widthMm: 0, offsetMm: 0 }
  return {
    show: !!vb.show,
    side: vb.side ?? 'left',
    color: vb.color ?? (ui.value.primary ?? preset.value.palette.primary),
    widthMm: vb.widthMm ?? 0,
    offsetMm: vb.offsetMm ?? 0,
  }
})

/** corner normalisé (UI > preset) + defaults sûrs */
const normalizedCorner = computed(() => {
  const c = ui.value?.corner ?? preset.value?.corner ?? null
  if (!c) return null
  return {
    enabled: c.enabled ?? true,
    type: c.type,
    anchor: c.anchor ?? 'top-left',
    sizeMm: c.sizeMm ?? 30,
    color: c.color ?? (ui.value.accent ?? preset.value.palette.accent),
    color2: c.color2,
    offsetMmX: c.offsetMmX ?? 0,
    offsetMmY: c.offsetMmY ?? 0,
    rotateDeg: c.rotateDeg ?? 0,
  }
})

const cornerPadTop = computed(() => {
  const c = normalizedCorner.value
  if (!c) return '0mm'
  const s = (c.sizeMm ?? 30) * 0.55
  return c.anchor?.startsWith('top') ? `${s}mm` : '0mm'
})
const cornerPadBottom = computed(() => {
  const c = normalizedCorner.value
  if (!c) return '0mm'
  const s = (c.sizeMm ?? 30) * 0.55
  return c.anchor?.startsWith('bottom') ? `${s}mm` : '0mm'
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

  '--corner-safe-top':    cornerPadTop.value,
  '--corner-safe-bottom': cornerPadBottom.value,

  '--a4-pad':
    ui.value.a4Padding ??
    (ui.value.layout === 'sidebar-left'
      ? '0mm 14mm 0mm 0mm'
      : ui.value.layout === 'sidebar-right'
        ? '0mm 0mm 0mm 14mm'
        : '14mm'),
}))

const usesSidebar = computed(() =>
  ['sidebar-right', 'sidebar-left'].includes(ui.value.layout)
)
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

.corner-deco {
  position: absolute;
  inset: 0;                     /* colle sur toute la page */
  z-index: 0;                   /* derrière */
  pointer-events: none;         /* pas de clics */
}

.grid, .identity, .main, .sidebar, .footer {
  position: relative;
  z-index: 1;                   /* devant */
}
.a4{
  width:210mm; min-height:297mm;
  background:var(--paper); color:var(--text);
  padding: var(--a4-pad, 14mm);  /* <= utilise une variable */
  box-shadow:0 2px 10px rgba(0,0,0,.08);
  position:relative;
}

@media screen {
  .a4 {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    box-shadow: 0 2px 10px rgba(0,0,0,.08); /* joli à l’écran */
  }
}
.cv-title{ margin:0; font-size:32px; font-weight:800; letter-spacing:.1px; }
.subtitle{ margin-bottom:1px; opacity:.8; }
@media print {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
  }

  /* IMPORTANT: taille exacte A4 + pas d’ombre + pas de marge parasite */
  .a4 {
    width: 210mm !important;
    min-height: 297mm !important;
    height: auto !important;
    margin: 0 !important;
    box-shadow: none !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    page-break-after: always;        /* chaque .a4 = une page */
  }
  .a4:last-child { page-break-after: auto; }

  /* Évite de couper des blocs cruciaux au milieu */
  .section-header,
  .exp-item,
  .edu-item,
  .skill-group,
  .interests,
  .personal-grid-wrapper {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}

/* padding conditionnel */
.a4.sidebar-left {
  padding-left: 0;
  padding-top: 14mm;
  padding-right: 14mm;
  padding-bottom: 14mm;
}

.a4.sidebar-right {
  padding-right: 0;
  padding-top: 14mm;
  padding-left: 14mm;
  padding-bottom: 14mm;
}

.a4.no-sidebar {
  padding: 14mm;
}
.bar{
  height:7mm; background:var(--primary);
  margin:-14mm -14mm 12mm -14mm;
}

/* Barre verticale pleine hauteur */
.vbar{
  position: absolute;
  top: 0px;
  left: 280px;
  bottom: 0;                      /* couvre toute la hauteur de la page */
  width: var(--vbar-width, 3mm);  /* largeur configurable */
  background: var(--vbar-color, var(--accent));   /* couleur configurable */
  z-index: 1;                     /* derrière la grille/contenu */
  pointer-events: none;
  /* Si tu veux un style pointillé:
     background: repeating-linear-gradient(
       to bottom,
       var(--vbar-color, var(--accent)) 0 6px,
       transparent 6px 10px
     );
  */
}

/* Côté gauche/droit + décalage éventuel */
.grid{ display:grid; }
.name{ font-size:32px; font-weight:800; margin-top: 10px; }
.headline{ opacity:.8; margin-bottom:6mm; }
.footer{ margin-top:8mm; text-align:right; }

/* photo: only frame the image when it exists */
.photo{
  width:var(--w); height:var(--h);
  overflow:hidden; background:transparent; border:none; padding:0;
}
.photo:empty{ display:none; }
.photo img{
  display:block; width:100%; height:100%; object-fit:cover;
  background:#fff; border:3px solid var(--primary);
  padding:2mm; box-sizing:content-box;
}
.photo.is-rounded img{ border-radius:10mm; }

/* ============== LATEST (2-col) ============== */
.layout--latest .grid{
  grid-template-columns: 1fr 1fr;
  grid-auto-rows:min-content;
  column-gap:12mm; row-gap:10mm;
}
.layout--latest .identity{
  grid-column:1 / -1;
  display:flex; justify-content:space-between; align-items:flex-start; gap:12mm;
}
.layout--latest .identity-left{ flex:1; }
.layout--latest .name{ font-size:30px; line-height:1.05; margin:0 0 2mm 0; }
.layout--latest .headline{ margin:0 0 4mm 0; opacity:.7; }
.layout--latest .photo{ justify-self:end; }
.layout--latest .main{
  grid-column:1 / -1;
  display:grid; grid-template-columns:1fr 1fr; column-gap:12mm; row-gap:12mm;
}

/* single straight underline for section titles (kills any decorations) */
.layout--latest :deep(.section-header){
  margin:0 0 6mm 0; padding-bottom:3mm; border-bottom:3px solid var(--accent);
}
.layout--latest :deep(.section-header)::before,
.layout--latest :deep(.section-header)::after{ content:none !important; }

/* personal grid nice spacing */
.layout--latest :deep(.personal-grid-wrapper .grid){
  display:grid !important; grid-template-columns: 1fr 1fr; column-gap:18mm; row-gap:6mm;
}
.layout--latest :deep(.personal-grid-wrapper .tile){ padding:0; margin:0; }
.layout--latest :deep(.personal-grid-wrapper .label){
  width:auto; min-width:110px; font-weight:700; opacity:.9; display:flex; align-items:center;
}
.layout--latest :deep(.personal-grid-wrapper .value){ line-height:1.3; }

/* orange underline under dates column; remove any caps */
.layout--latest :deep(.exp-item .left),
.layout--latest :deep(.edu-item .left){
  padding:3px 0 6px 0; border-bottom:3px solid var(--accent);
}
.layout--latest :deep(.exp-item .left)::before,
.layout--latest :deep(.exp-item .left)::after,
.layout--latest :deep(.edu-item .left)::before,
.layout--latest :deep(.edu-item .left)::after{ content:none !important; }

.layout--latest :deep(.right ul){ margin:4px 0 0 0; }
.layout--latest :deep(.right li){ margin:0 0 2px 0; }

/* ============== SIDEBAR RIGHT ============== */
.layout--sidebar-right .grid{
  grid-template-areas:
    "identity sidebar"
    "main     sidebar"
    "footer   sidebar";
}
.layout--sidebar-right .identity{ grid-area:identity; }
.layout--sidebar-right .main{ grid-area:main; }
.layout--sidebar-right .sidebar {
  grid-area: sidebar;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  border-left: 1px solid var(--sidebar-border); /* ✅ ne s'affiche que si sidebar */
  padding: 8mm 6mm;
  border-radius: 4px 0 0 4px;
  box-sizing: border-box;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.layout--sidebar-right .photo{ justify-self:end; }

/* personal in sidebar = 1 column */
.layout--sidebar-right :deep(.personal-grid-wrapper .grid){
  display:grid !important; grid-template-columns:1fr; row-gap:8px; column-gap:0;
}
.layout--sidebar-right :deep(.personal-grid-wrapper .tile){ padding:0; margin:0 0 6px 0; }
.layout--sidebar-right :deep(.personal-grid-wrapper .label){
  font-weight:700; opacity:.9; display:flex; align-items:center; margin-bottom:2px;
}
.layout--sidebar-right :deep(.personal-grid-wrapper .value){ line-height:1.25; font-size:.96em; }

/* section title: single straight line; kill any before/after */
.layout--sidebar-right :deep(.section-header){
  margin:0 0 6mm 0; padding-bottom:3mm; border-bottom:3px solid var(--accent);
}
.layout--sidebar-right :deep(.section-header)::before,
.layout--sidebar-right :deep(.section-header)::after{ content:none !important; }

/* dates column underline; kill rounded caps (both before/after) */
.layout--sidebar-right :deep(.exp-item .left),
.layout--sidebar-right :deep(.edu-item .left){
  border-bottom:3px solid var(--accent); padding-bottom:3px;
}
.layout--sidebar-right :deep(.exp-item .left)::before,
.layout--sidebar-right :deep(.exp-item .left)::after,
.layout--sidebar-right :deep(.edu-item .left)::before,
.layout--sidebar-right :deep(.edu-item .left)::after{ content:none !important; }

/* bullets tighter */
.layout--sidebar-right :deep(.right ul){ margin:4px 0 0 0; }
.layout--sidebar-right :deep(.right li){ margin:0 0 2px 0; }

.layout--sidebar-left .grid {
  grid-template-columns: auto 1fr; /* colonne prend juste la largeur du contenu */
}

.layout--sidebar-right .grid {
  grid-template-columns: 1fr auto;
}
/* ============== SIDEBAR LEFT ============== */
.layout--sidebar-left .grid{
  grid-template-areas:
    "sidebar identity"
    "sidebar main"
    "sidebar footer";
}

.layout--sidebar-left .identity{ grid-area: identity; }
.layout--sidebar-left .main{ grid-area: main; }
.layout--sidebar-left .sidebar {
  grid-area: sidebar;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  border-right: 1px solid var(--sidebar-border); /* ✅ idem */
  padding: 8mm 6mm;
  border-radius: 0 4px 4px 0;
  box-sizing: border-box;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.layout--sidebar-left .photo{ justify-self:start; }

/* perso dans la sidebar = 1 colonne (gauche) */
.layout--sidebar-left :deep(.personal-grid-wrapper .grid){
  display:grid !important;
  grid-template-columns:1fr;
  row-gap:8px;
  column-gap:0;
}
.layout--sidebar-left :deep(.personal-grid-wrapper .tile){ padding:0; margin:0 0 6px 0; }
.layout--sidebar-left :deep(.personal-grid-wrapper .label){
  font-weight:700; opacity:.9; display:flex; align-items:center; margin-bottom:2px;
}
.layout--sidebar-left :deep(.personal-grid-wrapper .value){ line-height:1.25; font-size:.96em; }

/* titres de section : trait simple droit */
.layout--sidebar-left :deep(.section-header){
  margin:0 0 6mm 10px; padding-bottom:3mm; border-bottom:3px solid var(--accent);
}
.layout--sidebar-left :deep(.section-header)::before,
.layout--sidebar-left :deep(.section-header)::after{ content:none !important; }

/* dates : simple soulignement, sans cap arrondi */
.layout--sidebar-left :deep(.exp-item .left),
.layout--sidebar-left :deep(.edu-item .left){
  border-bottom:3px solid var(--accent);
  padding-bottom:3px;
}
.layout--sidebar-left :deep(.exp-item .left)::before,
.layout--sidebar-left :deep(.exp-item .left)::after,
.layout--sidebar-left :deep(.edu-item .left)::before,
.layout--sidebar-left :deep(.edu-item .left)::after{ content:none !important; }

/* bullets serrés */
.layout--sidebar-left :deep(.right ul){ margin:4px 0 0 0; }
.layout--sidebar-left :deep(.right li){ margin:0 0 2px 0; }
/* ============== STYLISH / PHOTO-LEFT (kept) ============== */
.layout--stylish .grid{ grid-template-columns:1fr; }
.layout--stylish .identity{ display:grid; grid-template-columns:auto 1fr; gap:6mm; align-items:center; }
.layout--stylish .photo.is-top{ width:var(--w); height:var(--h); }

.layout--photo-left .grid{
  grid-template-columns:50mm 1fr;
  grid-template-areas:"photo identity" "photo main" "photo footer";
}
.layout--photo-left .photo{ grid-area:photo; }
.layout--photo-left .identity{ grid-area:identity; }
.layout--photo-left .main{ grid-area:main; }
.layout--photo-left .footer{ grid-area:footer; }

/* === base + empilement === */
.corner{
  position: absolute;
  top: 0; left: 0;
  pointer-events: none;
  z-index: 1;               /* derrière le contenu */
}
.corner--right{ left: auto; right: 0; }

/* s'assurer que le contenu passe au-dessus du corner */
.a4{ overflow: visible; }
.grid{ position: relative; z-index: 3; }
.identity{ position: relative; z-index: 4; }
.photo{ position: relative; z-index: 5; }
.bar{ position: relative; z-index: 2; }

.corner{
  position: absolute;
  pointer-events: none;
  z-index: 1;                         /* sous le contenu */
  transform: translate(var(--ox, 0), var(--oy, 0)) rotate(var(--rot, 0));
}

/* Ancrages (haut/bas + gauche/droite) */
.corner--top-left    { top: 0; left: 0; }
.corner--top-right   { top: 0; right: 0; }
.corner--bottom-left { bottom: 0; left: 0; }
.corner--bottom-right{ bottom: 0; right: 0; }

/* Assure que la grille/photo passent au-dessus */
.a4   { overflow: visible; }
.bar  { position: relative; z-index: 2; }
.grid { position: relative; z-index: 3; }
.identity{ position: relative; z-index: 4; }
.photo{ position: relative; z-index: 5; }

/* ===== 1) QUARTER — quart de disque ===== */
.corner--quarter{
  width: var(--csize);
  height: var(--csize);
  background: var(--corner);
  /* on gère le rayon via l’ancrage */
}
.corner--top-left.corner--quarter{
  border-bottom-right-radius: 100%;
}
.corner--top-right.corner--quarter{
  border-bottom-left-radius: 100%;
}
.corner--bottom-left.corner--quarter{
  border-top-right-radius: 100%;
}
.corner--bottom-right.corner--quarter{
  border-top-left-radius: 100%;
}

/* ===== 2) DIAGONAL — grand triangle ===== */
/* version “haut” (triangle côté top) */
.corner--diagonal{
  width: 0; height: 0;
}
.corner--top-left.corner--diagonal{
  border-top:  var(--csize) solid var(--corner);
  border-right: var(--csize) solid transparent;
}
.corner--top-right.corner--diagonal{
  border-top:  var(--csize) solid var(--corner);
  border-left: var(--csize) solid transparent;
}
/* version “bas” (triangle côté bottom) */
.corner--bottom-left.corner--diagonal{
  border-bottom:  var(--csize) solid var(--corner);
  border-right:   var(--csize) solid transparent;
}
.corner--bottom-right.corner--diagonal{
  border-bottom:  var(--csize) solid var(--corner);
  border-left:    var(--csize) solid transparent;
}

/* ===== 3) NOTCH — encoche/chanfrein avec clip-path ===== */
.corner--notch{
  width:  calc(var(--csize) * 1.35);
  height: calc(var(--csize) * 0.95);
  background: var(--corner);
}
/* on change le clip-path selon l’ancrage */
.corner--top-left.corner--notch{
  -webkit-clip-path: polygon(0 0, 100% 0, 75% 100%, 0 100%);
  clip-path: polygon(0 0, 100% 0, 75% 100%, 0 100%);
}
.corner--top-right.corner--notch{
  -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 25% 100%);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 25% 100%);
}
.corner--bottom-left.corner--notch{
  -webkit-clip-path: polygon(0 100%, 100% 100%, 75% 0, 0 0);
  clip-path: polygon(0 100%, 100% 100%, 75% 0, 0 0);
}
.corner--bottom-right.corner--notch{
  -webkit-clip-path: polygon(0 100%, 100% 100%, 100% 0, 25% 0);
  clip-path: polygon(0 100%, 100% 100%, 100% 0, 25% 0);
}

/* ===== 4) RIBBON — bloc + petite barre décalée ===== */
.corner--ribbon{
  width:  calc(var(--csize) * 1.6);
  height: calc(var(--csize) * 1.1);
  background: var(--corner2);
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,.06);
}
.corner--ribbon::after{
  content:"";
  position:absolute;
  width:  calc(var(--csize) * .8);
  height: 4mm;
  background: var(--corner);
}
/* Top-left */
.corner--top-left.corner--ribbon::after{
  top: calc(var(--csize) * .55);
  left: calc(var(--csize) * 1.2);
}
/* Top-right */
.corner--top-right.corner--ribbon::after{
  top: calc(var(--csize) * .55);
  right: calc(var(--csize) * 1.2);
}
/* Bottom-left */
.corner--bottom-left.corner--ribbon::after{
  bottom: calc(var(--csize) * .35);
  left:   calc(var(--csize) * 1.2);
}
/* Bottom-right */
.corner--bottom-right.corner--ribbon::after{
  bottom: calc(var(--csize) * .35);
  right:  calc(var(--csize) * 1.2);
}

/* ===== 5) DUAL-SLOPE — double diagonale superposée ===== */
.corner--dual-slope{
  position: relative;
  width:  calc(var(--csize) * 1.3);
  height: calc(var(--csize) * 1.3);
}
.corner--dual-slope::before,
.corner--dual-slope::after{
  content:"";
  position:absolute; inset:0;
}
.corner--top-left.corner--dual-slope::before,
.corner--top-left.corner--dual-slope::after{
  -webkit-clip-path: polygon(0 0, 100% 0, 65% 100%, 0 100%);
  clip-path: polygon(0 0, 100% 0, 65% 100%, 0 100%);
}
.corner--top-right.corner--dual-slope::before,
.corner--top-right.corner--dual-slope::after{
  -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 35% 100%);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 35% 100%);
}
.corner--bottom-left.corner--dual-slope::before,
.corner--bottom-left.corner--dual-slope::after{
  -webkit-clip-path: polygon(0 100%, 100% 100%, 65% 0, 0 0);
  clip-path: polygon(0 100%, 100% 100%, 65% 0, 0 0);
}
.corner--bottom-right.corner--dual-slope::before,
.corner--bottom-right.corner--dual-slope::after{
  -webkit-clip-path: polygon(0 100%, 100% 100%, 100% 0, 35% 0);
  clip-path: polygon(0 100%, 100% 100%, 100% 0, 35% 0);
}
.corner--dual-slope::before{ background: var(--corner2); }
.corner--top-left.corner--dual-slope::after{  background: var(--corner); transform: translate(6mm, 6mm); }
.corner--top-right.corner--dual-slope::after{ background: var(--corner); transform: translate(-6mm, 6mm); }
.corner--bottom-left.corner--dual-slope::after{ background: var(--corner); transform: translate(6mm, -6mm); }
.corner--bottom-right.corner--dual-slope::after{background: var(--corner); transform: translate(-6mm, -6mm); }
</style>
