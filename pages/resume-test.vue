<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useTheme } from 'vuetify'
import draggable from 'vuedraggable'
import { nanoid } from 'nanoid/non-secure'

import { CV_PRESETS } from '@/presets/cvPresets'
import type { UiState } from '@/types/ui/types'
import { defaultUi } from '@/types/ui/defaults'

import CvA4 from '~/components/cv/CvA4.vue'
import PersonalGrid from '~/components/cv/PersonalGrid.vue'
import SectionHeaderEditable from '~/components/cv/SectionHeaderEditable.vue'
import ExperienceList from '~/components/cv/ExperienceList.vue'
import EducationList from '~/components/cv/EducationList.vue'
import SkillsBlock from '~/components/cv/SkillsBlock.vue'
import InterestsBlock from '~/components/cv/InterestsBlock.vue'
import LanguagesBlock from '~/components/cv/LanguagesBlock.vue'
import Signature from '~/components/cv/Signature.vue'
import EditableText from '~/components/common/EditableText.vue'

import { useCvModel } from '~/composables/useCvModel'
import { exportCvAsPdf } from '~/utils/pdf'
import ListCVManager from '~/components/cv/ListCVManager.vue'
import SectionCvLayout from '~/components/cv/SectionCvLayout.vue'
import SectionSettingsMenu from '~/components/cv/SectionSettingsMenu.vue'

/* ---------------- Presets & sélection ---------------- */
const presets = CV_PRESETS
const chosenKey = ref<string>(presets.find(p => (p as any).default)?.key ?? presets[1]?.key ?? presets[0].key)
const chosen = computed(() => presets.find(p => p.key === chosenKey.value) ?? presets[0])

const hoverSection = ref<number|null>(null)
const hoverCanvas = ref(false)

/* ---------------- UI pilotable ---------------- */
const ui = reactive<UiState>({
  ...defaultUi,
  layout: chosen.value.layout,
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
    show: defaultUi.photo.show,
    shadow: { ...(defaultUi.photo.shadow ?? {}), ...(chosen.value.photoShadow ?? {}) },
  },
  // @ts-ignore
  corner:  chosen.value.corner  ? { ...chosen.value.corner }  : undefined,
  // @ts-ignore
  sidebar: chosen.value.sidebar ? { ...chosen.value.sidebar } : undefined,
  // @ts-ignore
  vbar:    chosen.value.vbar    ? { ...chosen.value.vbar }    : undefined,

  skills: {
    chipVariant: chosen.value.skills?.chipVariant ?? 'text',
    chipColor:   chosen.value.skills?.chipColor   ?? chosen.value.palette.accent,
    chipDensity: chosen.value.skills?.chipDensity ?? 'compact',
    columns: 1,
    editable: true,
    draggable: true,
  },
  languages: {
    variant: 'stars',
    maxLevel: 5,
    sizePx: 18,
    accent: chosen.value.palette.accent,
    editable: true,
    draggable: true,
  },
  experience: {
    variant: 'two-col',
    dateLine: 'underline',
    dateLineWidth: 100,
    dateLineStyle: 'solid',
  },
  education: {
    variant: 'two-col',
    dateLine: 'underline',
    dateLineWidth: 100,
    dateLineStyle: 'solid',
  },
})

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
  ui.photo.shadow   = { ...(ui.photo.shadow ?? {}), ...(p.photoShadow ?? {}) }

  ui.corner ??= {} as any
  Object.assign(ui.corner, p.corner ?? { enabled: false })

  ui.sidebar ??= {} as any
  Object.assign(ui.sidebar, p.sidebar ?? { enabled: false })

  ui.vbar ??= {} as any
  Object.assign(ui.vbar, p.vbar ?? { show: false })

  ui.vbar    = p.vbar    ? { ...p.vbar }    :
  ui.skills!.chipColor   = p.skills?.chipColor ?? p.palette.accent
  ui.languages!.accent   = p.languages?.accent ?? p.palette.accent
}

/* ---------------- Modèle / Divers ---------------- */
const { model, readFile } = useCvModel()
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

/* ---------------- Sections dynamiques ---------------- */
type SectionType = 'experience'|'education'|'skills'|'languages'|'interests'|'custom'
type CvSection = {
  id: string
  type: SectionType
  title: string
  icon?: string
  enabled: boolean
  props?: Record<string, any>
}

const SECTION_DEFS: Record<SectionType, { label: string }> = {
  experience: { label: 'Career' },
  education:  { label: 'Education' },
  skills:     { label: 'Skills' },
  languages:  { label: 'Languages' },
  interests:  { label: 'Interests' },
  custom:     { label: 'Custom' },
}
function defaultIconFor(type: SectionType) {
  return ({
    experience: 'mdi-briefcase',
    education:  'mdi-school',
    skills:     'mdi-lightbulb',
    languages:  'mdi-translate',
    interests:  'mdi-heart',
    custom:     'mdi-shape-outline',
  }[type])
}

const sections = ref<CvSection[]>([
  { id: nanoid(), type:'experience', title: SECTION_DEFS.experience.label, icon: defaultIconFor('experience'), enabled:true },
  { id: nanoid(), type:'education',  title: SECTION_DEFS.education.label,  icon: defaultIconFor('education'),  enabled:true },
  { id: nanoid(), type:'skills',     title: 'Skills',          icon: defaultIconFor('skills'),     enabled:true },
  { id: nanoid(), type:'languages',  title: SECTION_DEFS.languages.label,  icon: defaultIconFor('languages'),  enabled:true },
  { id: nanoid(), type:'interests',  title: SECTION_DEFS.interests.label,  icon: defaultIconFor('interests'),  enabled:true },
])

function resolveComp(s: CvSection) {
  switch (s.type) {
    case 'experience': return ExperienceList
    case 'education':  return EducationList
    case 'skills':     return SkillsBlock
    case 'languages':  return LanguagesBlock
    case 'interests':  return InterestsBlock
    case 'custom':     return EditableText
  }
}
function resolveProps(s: CvSection) {
  switch (s.type) {
    case 'experience':
      return {
        variant:       ui.experience?.variant,
        dateLine:      ui.experience?.dateLine,
        dateLineWidth: ui.experience?.dateLineWidth,
        dateLineStyle: ui.experience?.dateLineStyle,
        accent:        chosen.value.palette.accent,
      }
    case 'education':
      return {
        variant:       ui.education?.variant ?? ui.experience?.variant,
        dateLine:      ui.education?.dateLine ?? ui.experience?.dateLine,
        dateLineWidth: ui.education?.dateLineWidth ?? ui.experience?.dateLineWidth,
        dateLineStyle: ui.education?.dateLineStyle ?? ui.experience?.dateLineStyle,
        accent:        chosen.value.palette.accent,
      }
    case 'skills':
      return {
        ui,
        accent:      ui.skills?.chipColor ?? chosen.value.palette.accent,
        chipVariant: ui.skills?.chipVariant ?? 'text',
        chipColor:   ui.skills?.chipColor ?? chosen.value.palette.accent,
        chipDensity: ui.skills?.chipDensity ?? 'compact',
        columns:          ui.skills?.columns ?? 2,
        groupLine:        ui.skills?.groupLine ?? 'underline',
        groupLineWidth:   ui.skills?.groupLineWidth ?? 40,
        groupLineStyle:   ui.skills?.groupLineStyle ?? 'solid',
        groupLineColor:   ui.skills?.groupLineColor ?? (ui.skills?.chipColor ?? chosen.value.palette.accent),
      }
    case 'languages':
      return {
        ui,
        variant:   ui.languages?.variant  ?? 'stars',
        accent:    ui.languages?.accent   ?? chosen.value.palette.accent,
        maxLevel:  ui.languages?.maxLevel ?? 5,
        sizePx:    ui.languages?.sizePx   ?? 18,
        editable:  ui.languages?.editable ?? true,
        draggable: ui.languages?.draggable?? true,
      }
    case 'interests':
      return {
        ui,
        accent:      ui.skills?.chipColor ?? chosen.value.palette.accent,
        chipVariant: ui.skills?.chipVariant ?? 'text',
        chipColor:   ui.skills?.chipColor ?? chosen.value.palette.accent,
        chipDensity: ui.skills?.chipDensity ?? 'compact',
      }
    case 'custom':
      return { class: 'pa-2', placeholder: 'Content...' }
  }
}
function getModelValue(t: SectionType) {
  switch (t) {
    case 'experience': return model.experience
    case 'education':  return model.education
    case 'skills':     return model.skills
    case 'languages':  return model.languages
    case 'interests':  return model.interests
    case 'custom':     return ''
  }
}
function setModelValue(t: SectionType, v: any) {
  switch (t) {
    case 'experience': model.experience = v; break
    case 'education':  model.education  = v; break
    case 'skills':     model.skills     = v; break
    case 'languages':  model.languages  = v; break
    case 'interests':  model.interests  = v; break
    case 'custom':     break
  }
}
function move(i:number, dir:number){
  const list = [...sections.value]
  const j = i+dir
  if (j<0 || j>=list.length) return
    ;[list[i],list[j]] = [list[j],list[i]]
  sections.value = list
}
function removeSection(index:number){ sections.value.splice(index,1) }
function addSection(type: SectionType) {
  sections.value.push({
    id: nanoid(),
    type,
    title: SECTION_DEFS[type].label,
    icon: defaultIconFor(type),
    enabled: true,
    props: {},
  })
}

/* Seed data */
function seedDemoContent() {
  if (!Array.isArray(model.experience) || model.experience.length === 0) {
    model.experience = [
      { id: nanoid(), period: '2022 – 2025', company: 'Acme GmbH', role: 'Senior Full-Stack Developer',
        bullets: ['Dev Vue/Nuxt + API Symfony','Mise en place CI/CD & tests','Mentorat de 3 développeurs'] },
      { id: nanoid(), period: '2020 – 2022', company: 'Bro World GmbH', role: 'Frontend Engineer',
        bullets: ['Refonte design system (Vuetify)','Optimisation performance (LCP < 2.5s)'] },
    ]
  }
  if (!Array.isArray(model.education) || model.education.length === 0) {
    model.education = [
      { id: nanoid(), period: '2016 – 2019', school: 'Université Technique', degree: 'Licence Informatique',
        bullets: ['Algorithmique, Web, Bases de données'] },
    ]
  }
  if (!Array.isArray(model.skills) || model.skills.length === 0) {
    model.skills = [
      { id: nanoid(), label: 'Frontend', items: ['Vue', 'Nuxt', 'Vuetify', 'Vite'] },
      { id: nanoid(), label: 'Backend',  items: ['Node', 'Symfony', 'Laravel'] },
      { id: nanoid(), label: 'Tools',    items: ['Git', 'Docker', 'CI/CD'] },
    ]
  }
  if (!Array.isArray(model.languages) || model.languages.length === 0) {
    model.languages = [
      { id: nanoid(), name: 'Français', level: 5, note: 'Courant' },
      { id: nanoid(), name: 'Deutsch',  level: 4, note: 'Fließend' },
      { id: nanoid(), name: 'English',  level: 4, note: 'Fluent' },
    ]
  }
  if (!Array.isArray(model.interests) || model.interests.length === 0) {
    model.interests = ['Photographie', 'Randonnée', 'UI Design', 'Tech watch']
  }
}

/* --------- modèles de menu haut --------- */
const models = ref<any>({
  key: 'models',
  label: 'Layout',
  icon: 'mdi-vector-square',
  actions: [
    { key: 'stylish',       label: 'Stylish',     icon: 'mdi-palette-outline' },
    { key: 'sidebar-left',  label: 'Sidebar L',   icon: 'mdi-view-sidebar' },
    { key: 'sidebar-right', label: 'Sidebar R',   icon: 'mdi-view-sidebar-outline' },
    { key: 'photo-left',    label: 'Photo Left',  icon: 'mdi-image-filter-center-focus-weak' },
  ]
})

/* setter centralisé du layout */
function setLayout(mode: string) {
  // clés qu’on accepte depuis le picker
  const allowed = new Set([
    'stacked', 'latest', 'stylish', 'sidebar-left', 'sidebar-right', 'photo-left',
    'bar-left', 'bar-right' // on garde la compat si tu les utilises ailleurs
  ])

  if (!allowed.has(mode)) return

  if (mode === 'bar-left' || mode === 'bar-right') {
    ui.layout = 'stacked' as any
    ui.vbar   = { ...(ui.vbar ?? {}), show:true, side: mode === 'bar-left' ? 'left' : 'right' }
  } else {
    ui.layout = mode as any
    ui.vbar   = { ...(ui.vbar ?? {}), show:false }
  }
  selected.models = mode
}

const sectionModels = [
  { key: 'personal',  label: 'Personal',  icon: 'mdi-account-outline', actions: [] },
  { key: 'photo',     label: 'Images',    icon: 'mdi-emoticon',
    actions: [{ key: 'circle', label: 'Circle', icon: 'mdi-eye-outline' },
      { key: 'square', label: 'Square', icon: 'mdi-content-save-outline' }] },
  { key: 'corner',    label: 'Corner',    icon: 'mdi-chart-bubble', actions: [] },
  { key: 'experience', label: 'Experience', icon: 'mdi-briefcase-outline',
    actions: [{ key: 'stacked', label:'One Col', icon:'mdi-view-agenda-outline' },
      { key: 'two-col', label:'Two Col', icon:'mdi-view-column-outline' }] },
  { key: 'education', label: 'Education', icon: 'mdi-school-outline',
    actions: [{ key: 'stacked', label:'One Col', icon:'mdi-view-agenda-outline' },
      { key: 'two-col', label:'Two Col', icon:'mdi-view-column-outline' }] },
  { key: 'skills', label: 'Skills', icon: 'mdi-star-outline',
    actions: [{ key:'stacked', label:'One Col', icon:'mdi-view-agenda-outline' },
      { key:'two-col', label:'Two Col', icon:'mdi-view-column-outline' }] },
  { key: 'languages', label: 'Languages', icon: 'mdi-flag-outline',
    actions: [{ key:'stars', label:'Stars', icon:'mdi-eye-outline' },
      { key:'bars',  label:'Bars',  icon:'mdi-content-save-outline' },
      { key:'dots',  label:'Dots',  icon:'mdi-content-save-outline' }] },
  { key: 'signature', label: 'Signature', icon: 'mdi-draw', actions: [] },
  { key: 'custom',    label: 'Custom',    icon: 'mdi-shape-outline', actions: [] },
]

function onAction(sectionKey: string, actionKey: string) {
  switch (sectionKey) {
    case 'skills':
      ui.skills.columns = colByAction[actionKey] ?? ui.skills.columns
      break

    // ✅ layouts valides pour CvA4
    case 'models': {
      const allowed = ['latest','stylish','sidebar-right','sidebar-left','photo-left'] as const
      if ((allowed as readonly string[]).includes(actionKey)) {
        // tu modifies juste le layout (pas besoin de preset complet ici)
        ui.layout = actionKey as any
      }
      break
    }

    // ✅ corner.type (pas .style)
    case 'corner':
      (ui.corner ??= {} as any).type = actionKey
      ;(ui.corner as any).enabled = true
      break

    case 'experience':
      ui.experience.variant = actionKey as 'stacked' | 'two-col'
      break
    case 'education':
      ui.education.variant = actionKey as 'stacked' | 'two-col'
      break
    case 'photo':
      ui.photo.shape = actionKey as 'circle' | 'square'
      break
    case 'languages':
      ui.languages.variant = actionKey as 'stars' | 'bars' | 'dots'
      break
    case 'signature':
      if (actionKey === 'open')   signatureModal.value = true
      if (actionKey === 'remove') model.signature = null
      break
  }
}

/* --------- ancrage & focus --------- */
const anchors = reactive<Record<string, HTMLElement | null>>({
  experience: null, education:  null, skills:     null,
  languages:  null, interests:  null, personal:   null, custom: null,
})
function setAnchorIfEmpty(key: keyof typeof anchors) {
  return (el: HTMLElement | null) => { if (el && !anchors[key]) anchors[key] = el }
}
/* --------- header actions --------- */
const colByAction: Record<string, number> = { 'stacked': 1, 'two-col': 2 }
const actions = [
  { key: 'preview',  label: 'Preview',  icon: 'mdi-eye-outline' },
  { key: 'save',     label: 'Save',     icon: 'mdi-content-save-outline' },
  { key: 'download', label: 'Download', icon: 'mdi-download-outline' },
]

const languages = [
  { code: 'en', iso: 'en-GB', name: 'English',  icon: 'fi-gb gb' },
  { code: 'fr', iso: 'fr-FR', name: 'Français', icon: 'fi-fr fr' },
  { code: 'de', iso: 'de-DE', name: 'Deutsch',  icon: 'fi-de de' },
  { code: 'ar', iso: 'ar-AR', name: 'العربية',  icon: 'fi-tn tn' },
]
const language = ref(languages[0])

const flatSwatches = ['#1E88E5','#43A047','#8E24AA','#37474F','#0D47A1','#FB8C00','#E53935','#D81B60','#3949AB','#4E342E']
const color = ref(flatSwatches[0])
const selected = reactive<Record<string, string | null>>({})
function syncSelectedFromUi() {
  // modèle sélectionné (doit correspondre EXACTEMENT aux clés des actions)
  if (ui.vbar?.show) {
    selected.models = ui.vbar.side === 'left' ? 'bar-left' : 'bar-right'
  } else if (['latest','stylish','sidebar-left','sidebar-right','photo-left','stacked'].includes(ui.layout as any)) {
    selected.models = ui.layout as any
  } else {
    selected.models = 'stacked'
  }

  selected.photo      = ui.photo?.shape ?? 'circle'
  selected.languages  = ui.languages?.variant ?? 'stars'
  selected.skills     = (ui.skills?.columns ?? 1) >= 2 ? 'two-col' : 'stacked'
  selected.experience = ui.experience?.variant ?? 'two-col'
  selected.education  = ui.education?.variant ?? 'two-col'
  // évite 'triangle' (qui n’existe pas) → défaut propre :
  selected.corner     = (ui.corner as any)?.type ?? (ui.corner as any)?.style ?? 'quarter'
}

/* --------- Settings menu global --------- */
const panels = [
  // THEME
  { key:'theme', label:'Theme', icon:'mdi-palette-outline', fields:[
      { type:'select', key:'fontFamily', label:'Font family',
        items: ['Inter','Roboto','Open Sans','Lato','Merriweather','Georgia','Times New Roman'].map(x=>({title:x,value:x})) },
      { type:'select', key:'fontSize', label:'Font size',
        items: ['12px','13px','14px','15px','16px','18px'].map(x=>({title:x,value:x})) },
      { type:'swatches', key:'accent', label:'Accent' },
    ]},

  // PHOTO
  { key:'photo', label:'Photo', icon:'mdi-camera-outline',
    fields:[
      { type:'switch',    key:'show',    label:'Show photo' },

      { type:'segmented', key:'variant', label:'Variant',
        options:[
          { value:'plain',           label:'Plain' },
          { value:'frame',           label:'Frame' },
          { value:'elevated',        label:'Elevated' },
          { value:'elevated-frame',  label:'Elev+Frame' },
        ]
      },

      { type:'segmented', key:'shape', label:'Shape',
        options:[
          { value:'circle', label:'Circle', icon:'mdi-circle-outline' },
          { value:'square', label:'Square', icon:'mdi-square-outline' },
        ]
      },

      { type:'select', key:'position', label:'Position',
        items:[
          { title:'Left',  value:'left'  },
          { title:'Right', value:'right' },
          { title:'Top',   value:'top'   },
        ]
      },

      { type:'slider', key:'widthMm',  label:'Width (mm)',  min:20, max:90, step:1, cols:6 },
      { type:'slider', key:'heightMm', label:'Height (mm)', min:20, max:90, step:1, cols:6 },

      // ---- Cadre (actif si variant = frame / elevated-frame) ----
      { type:'slider',   key:'frameWidth',   label:'Border (px)',  min:0,  max:12, step:1, cols:6 },
      { type:'slider',   key:'framePadding', label:'Padding (px)', min:0,  max:24, step:1, cols:6 },
      { type:'swatches', key:'frameColor',   label:'Frame color'   },

      // ---- Ombre (peut aussi s’appliquer tout seul avec variant elevated*) ----
      { type:'switch', key:'shadowEnabled',    label:'Shadow enabled' },
      { type:'slider', key:'shadowElevation',  label:'Elevation (0–24)', min:0, max:24, step:1 },
      { type:'swatches', key:'shadowColor',    label:'Shadow color' },
    ]
  },

  // CORNER
  { key:'corner', label:'Corner', icon:'mdi-chart-bubble', fields:[
      { type:'switch', key:'enabled', label:'Enabled' },
      { type:'segmented', key:'type', label:'Type',
        options:[
          { value:'quarter', label:'Quarter' },
          { value:'diagonal', label:'Diagonal' },
          { value:'notch', label:'Notch' },
          { value:'ribbon', label:'Ribbon' },
          { value:'dual-slope', label:'Dual Slope' },
        ]},
      { type:'select', key:'anchor', label:'Anchor',
        items:[
          { title:'Top-Left', value:'top-left' }, { title:'Top-Right', value:'top-right' },
          { title:'Bottom-Left', value:'bottom-left' }, { title:'Bottom-Right', value:'bottom-right' },
        ]},
      { type:'slider',   key:'sizeMm',    label:'Size (mm)',   min:10, max:80, step:2 },
      { type:'swatches', key:'color',     label:'Primary color' },
    ]},

  // SIDEBAR
  { key:'sidebar', label:'Sidebar', icon:'mdi-view-sidebar', fields:[
      { type:'switch', key:'enabled', label:'Enable sidebar' },
      { type:'select', key:'side', label:'Side', items:[{title:'Left',value:'left'},{title:'Right',value:'right'}] },
      { type:'slider', key:'widthMm', label:'Width (mm)', min:40, max:110, step:1 },
      { type:'swatches', key:'background', label:'Background' },
      { type:'swatches', key:'text',       label:'Text color' },
      { type:'swatches', key:'borderColor',label:'Border color' },
    ]},

  // VERTICAL BAR
  { key:'vbar', label:'Vertical bar', icon:'mdi-pan-vertical', fields:[
      { type:'switch', key:'show', label:'Show vbar' },
      { type:'select', key:'side', label:'Side', items:[{title:'Left',value:'left'},{title:'Right',value:'right'}] },
      { type:'slider', key:'widthMm',  label:'Width (mm)',  min:0, max:30, step:1, cols:6  },
      { type:'slider', key:'offsetMm', label:'Offset (mm)', min:-20, max:20, step:1, cols:6  },
      { type:'swatches', key:'color', label:'Color' },
    ]},

  // EXPERIENCE
  { key:'experience', label:'Experience', icon:'mdi-briefcase-outline', fields:[
      { type:'segmented', key:'variant', label:'Layout',
        options:[{value:'stacked',label:'One Col',icon:'mdi-view-agenda-outline'},{value:'two-col',label:'Two Col',icon:'mdi-view-column-outline'}]},

      { type:'switch', key:'dateLineEnabled', label:'Date line', cols:6 },
      { type:'switch', key:'dateLineFullWidth', label:'Full width', cols:6 },
      { type:'select', key:'dateLineStyle',   label:'Line style',
        items:[{title:'Solid',value:'solid'},{title:'Dashed',value:'dashed'},{title:'Dotted',value:'dotted'}]},
      { type:'slider', key:'dateLineWidthPx', label:'Thickness (px)', min:1, max:12, step:1, cols:6 },
      { type:'slider', key:'dateLineMarginBottomPx', label:'Bottom (px)', min:0, max:32, step:1, cols:6 },
      { type:'slider', key:'dateLineFixedPx', label:'Fixed length (px)', min:0, max:240, step:5 },
      { type:'swatches', key:'dateLineColor', label:'Line color' },
    ]},

  // EDUCATION
  { key:'education', label:'Education', icon:'mdi-school-outline', fields:[
      { type:'segmented', key:'variant', label:'Layout',
        options:[{value:'stacked',label:'One Col'},{value:'two-col',label:'Two Col'}]},

      { type:'switch', key:'dateLineEnabled', label:'Period line', cols: 6 },
      { type:'switch', key:'dateLineFullWidth', label:'Full width', cols: 6 },
      { type:'select', key:'dateLineStyle',   label:'Line style',
        items:[{title:'Solid',value:'solid'},{title:'Dashed',value:'dashed'},{title:'Dotted',value:'dotted'}]},
      { type:'slider', key:'dateLineWidthPx', label:'Thickness (px)', min:1, max:12, step:1, cols:6  },
      { type:'slider', key:'dateLineMarginBottomPx', label:'Bottom (px)', min:0, max:32, step:1, cols:6  },
      { type:'slider', key:'dateLineFixedPx', label:'Fixed length (px)', min:0, max:240, step:5 },
      { type:'swatches', key:'dateLineColor', label:'Line color' },
    ]},

  // SKILLS
  { key:'skills', label:'Skills', icon:'mdi-star-outline', fields:[
      { type:'segmented', key:'columns', label:'Columns', options:[{value:1,label:'1'},{value:2,label:'2'}]},

      { type:'segmented', key:'groupLine', label:'Group underline',
        options:[{value:'underline',label:'On'},{value:'none',label:'Off'}]},
      { type:'select', key:'groupLineStyle', label:'Line style',
        items:[{title:'Solid',value:'solid'},{title:'Dashed',value:'dashed'},{title:'Dotted',value:'dotted'}]},
      { type:'slider', key:'groupLineWidth', label:'Line width (%)', min:0, max:100, step:1 },
      { type:'swatches', key:'groupLineColor', label:'Line color' },

      { type:'select', key:'chipVariant', label:'Chip variant',
        items:['text','tonal','elevated','outlined','flat','plain'].map(x=>({title:x,value:x})) },
      { type:'select', key:'chipDensity', label:'Chip density',
        items:['compact','comfortable','default'].map(x=>({title:x,value:x})) },
      { type:'swatches', key:'chipColor', label:'Chip color' },
    ]},

  // LANGUAGES
  { key:'languages', label:'Languages', icon:'mdi-flag-outline', fields:[
      { type:'segmented', key:'variant', label:'Style',
        options:[{value:'stars',label:'Stars'},{value:'bars',label:'Bars'},{value:'dots',label:'Dots'}]},
      { type:'slider', key:'sizePx',   label:'Size (px)', min:8, max:32, step:1, cols:6  },
      { type:'slider', key:'maxLevel', label:'Max level',      min:3, max:10, step:1, cols:6  },
      { type:'swatches', key:'accent', label:'Accent color' },
    ]},

  // SIGNATURE
  { key:'signature', label:'Signature', icon:'mdi-draw', fields:[
      { type:'button', key:'open',   action:'open',   label:'Open pad', icon:'mdi-draw',  color:'primary' },
      { type:'button', key:'remove', action:'remove', label:'Remove',   icon:'mdi-close', color:'error' },
    ]},
]
function ensurePhotoShadow(){ ui.photo.shadow ??= {} as any }

const photoBind = {
  // visibilité & placement
  get show(){ return ui.photo.show },                 set show(v){ ui.photo.show = v },
  get position(){ return ui.photo.position },         set position(v){ ui.photo.position = v },
  get shape(){ return ui.photo.shape },               set shape(v){ ui.photo.shape = v as any },
  get widthMm(){ return ui.photo.widthMm },           set widthMm(v){ ui.photo.widthMm = Number(v) || 0 },
  get heightMm(){ return ui.photo.heightMm },         set heightMm(v){ ui.photo.heightMm = Number(v) || 0 },

  // NEW: variantes d’habillage
  get variant(){ return ui.photo.variant },           set variant(v){ ui.photo.variant = v as any },

  // Cadre
  get frameWidth(){ return ui.photo.frameWidth },     set frameWidth(v){ ui.photo.frameWidth = Number(v) || 0 },
  get framePadding(){ return ui.photo.framePadding }, set framePadding(v){ ui.photo.framePadding = Number(v) || 0 },
  get frameColor(){ return ui.photo.frameColor },     set frameColor(v){ ui.photo.frameColor = v },
  get frameBg(){ return ui.photo.frameBg },           set frameBg(v){ ui.photo.frameBg = v },

  // Ombre (aplaties depuis photo.shadow)
  get shadowEnabled(){ return ui.photo.shadow?.enabled ?? false },
  set shadowEnabled(v){ ensurePhotoShadow(); ui.photo.shadow!.enabled = v },

  get shadowElevation(){ return ui.photo.shadow?.elevation ?? 0 },
  set shadowElevation(v){ ensurePhotoShadow(); ui.photo.shadow!.elevation = Number(v) || 0 },

  get shadowColor(){ return ui.photo.shadow?.color ?? '' },
  set shadowColor(v){ ensurePhotoShadow(); ui.photo.shadow!.color = v },

  get shadowCustom(){ return ui.photo.shadow?.custom ?? '' },
  set shadowCustom(v){ ensurePhotoShadow(); ui.photo.shadow!.custom = v },
}

const bindings = {
  // THEME
  theme: {
    get fontFamily(){ return ui.fontFamily }, set fontFamily(v){ ui.fontFamily = v as any },
    get fontSize(){ return ui.fontSize },     set fontSize(v){ ui.fontSize = v as any },
    get accent(){ return ui.accent },         set accent(v){ ui.accent = v as any },
  },

  // PHOTO
  photo: photoBind,

  // CORNER
  corner: {
    get enabled(){ return ui.corner?.enabled ?? true }, set enabled(v){ (ui.corner??={type:'quarter'}).enabled = !!v },
    get type(){ return ui.corner?.type ?? 'quarter' },  set type(v){ (ui.corner??={type:'quarter'}).type = v as any },
    get anchor(){ return ui.corner?.anchor ?? 'top-left' }, set anchor(v){ (ui.corner??={type:'quarter'}).anchor = v as any },
    get sizeMm(){ return ui.corner?.sizeMm ?? 30 },     set sizeMm(v){ (ui.corner??={type:'quarter'}).sizeMm = Number(v)||0 },
    get color(){ return ui.corner?.color ?? ui.accent },set color(v){ (ui.corner??={type:'quarter'}).color = v as any },
    get color2(){ return ui.corner?.color2 },           set color2(v){ (ui.corner??={type:'quarter'}).color2 = v as any },
    get offsetMmX(){ return ui.corner?.offsetMmX ?? 0 },set offsetMmX(v){ (ui.corner??={type:'quarter'}).offsetMmX = Number(v)||0 },
    get offsetMmY(){ return ui.corner?.offsetMmY ?? 0 },set offsetMmY(v){ (ui.corner??={type:'quarter'}).offsetMmY = Number(v)||0 },
    get rotateDeg(){ return ui.corner?.rotateDeg ?? 0 },set rotateDeg(v){ (ui.corner??={type:'quarter'}).rotateDeg = Number(v)||0 },
  },

  // SIDEBAR
  sidebar: {
    get enabled(){ return ui.sidebar?.enabled ?? false }, set enabled(v){ (ui.sidebar??={background:'#f7f8fa'}).enabled = !!v },
    get side(){ return ui.sidebar?.side ?? 'left' },      set side(v){ (ui.sidebar??={background:'#f7f8fa'}).side = v as any },
    get widthMm(){ return ui.sidebar?.widthMm ?? 70 },    set widthMm(v){ (ui.sidebar??={background:'#f7f8fa'}).widthMm = Number(v)||0 },
    get background(){ return ui.sidebar?.background ?? '#f7f8fa' }, set background(v){ (ui.sidebar??={background:'#f7f8fa'}).background = v as any },
    get text(){ return ui.sidebar?.text ?? 'inherit' },   set text(v){ (ui.sidebar??={background:'#f7f8fa'}).text = v as any },
    get borderColor(){ return ui.sidebar?.borderColor ?? '#e6e8ec' }, set borderColor(v){ (ui.sidebar??={background:'#f7f8fa'}).borderColor = v as any },
  },

  // VBAR
  vbar: {
    get show(){ return ui.vbar?.show ?? false },     set show(v){ (ui.vbar??={}).show = !!v },
    get side(){ return ui.vbar?.side ?? 'left' },    set side(v){ (ui.vbar??={}).side = v as any },
    get widthMm(){ return ui.vbar?.widthMm ?? 0 },   set widthMm(v){ (ui.vbar??={}).widthMm = Number(v)||0 },
    get offsetMm(){ return ui.vbar?.offsetMm ?? 0 }, set offsetMm(v){ (ui.vbar??={}).offsetMm = Number(v)||0 },
    get color(){ return ui.vbar?.color ?? ui.primary }, set color(v){ (ui.vbar??={}).color = v as any },
  },

  // EXPERIENCE (avec mapping objet dateLine)
  experience: {
    get variant(){ return ui.experience?.variant ?? 'two-col' }, set variant(v){ (ui.experience??={}).variant = v as any },

    get dateLineEnabled(){ return ui.experience?.dateLine?.enabled ?? true },
    set dateLineEnabled(v){ (ui.experience??={}).dateLine = { ...(ui.experience?.dateLine??{}), enabled: !!v } },

    get dateLineStyle(){ return ui.experience?.dateLine?.style ?? 'solid' },
    set dateLineStyle(v){ (ui.experience??={}).dateLine = { ...(ui.experience?.dateLine??{}), style: v as any } },

    get dateLineWidthPx(){ return ui.experience?.dateLine?.widthPx ?? 3 },
    set dateLineWidthPx(v){ (ui.experience??={}).dateLine = { ...(ui.experience?.dateLine??{}), widthPx: Number(v)||1 } },

    get dateLineMarginBottomPx(){ return ui.experience?.dateLine?.marginBottomPx ?? 0 },
    set dateLineMarginBottomPx(v){ (ui.experience??={}).dateLine = { ...(ui.experience?.dateLine??{}), marginBottomPx: Number(v)||0 } },

    get dateLineFullWidth(){ return ui.experience?.dateLine?.fullWidth ?? false },
    set dateLineFullWidth(v){ (ui.experience??={}).dateLine = { ...(ui.experience?.dateLine??{}), fullWidth: !!v } },

    get dateLineFixedPx(){ return ui.experience?.dateLine?.lineLengthPx ?? 0 },
    set dateLineFixedPx(v){ (ui.experience??={}).dateLine = { ...(ui.experience?.dateLine??{}), lineLengthPx: Number(v)||0 } },

    get dateLineColor(){ return ui.experience?.dateLine?.color ?? undefined },
    set dateLineColor(v){ (ui.experience??={}).dateLine = { ...(ui.experience?.dateLine??{}), color: v as any } },
  },

  // EDUCATION (idem)
  education: {
    get variant(){ return ui.education?.variant ?? 'two-col' }, set variant(v){ (ui.education??={}).variant = v as any },

    get dateLineEnabled(){ return ui.education?.dateLine?.enabled ?? true },
    set dateLineEnabled(v){ (ui.education??={}).dateLine = { ...(ui.education?.dateLine??{}), enabled: !!v } },

    get dateLineStyle(){ return ui.education?.dateLine?.style ?? 'solid' },
    set dateLineStyle(v){ (ui.education??={}).dateLine = { ...(ui.education?.dateLine??{}), style: v as any } },

    get dateLineWidthPx(){ return ui.education?.dateLine?.widthPx ?? 3 },
    set dateLineWidthPx(v){ (ui.education??={}).dateLine = { ...(ui.education?.dateLine??{}), widthPx: Number(v)||1 } },

    get dateLineMarginBottomPx(){ return ui.education?.dateLine?.marginBottomPx ?? 0 },
    set dateLineMarginBottomPx(v){ (ui.education??={}).dateLine = { ...(ui.education?.dateLine??{}), marginBottomPx: Number(v)||0 } },

    get dateLineFullWidth(){ return ui.education?.dateLine?.fullWidth ?? false },
    set dateLineFullWidth(v){ (ui.education??={}).dateLine = { ...(ui.education?.dateLine??{}), fullWidth: !!v } },

    get dateLineFixedPx(){ return ui.education?.dateLine?.lineLengthPx ?? 0 },
    set dateLineFixedPx(v){ (ui.education??={}).dateLine = { ...(ui.education?.dateLine??{}), lineLengthPx: Number(v)||0 } },

    get dateLineColor(){ return ui.education?.dateLine?.color ?? undefined },
    set dateLineColor(v){ (ui.education??={}).dateLine = { ...(ui.education?.dateLine??{}), color: v as any } },
  },

  // SKILLS avancé
  skills: {
    get columns(){ return ui.skills?.columns ?? 2 }, set columns(v){ (ui.skills??={}).columns = v as any },

    get groupLine(){ return ui.skills?.groupLine ?? 'underline' },
    set groupLine(v){ (ui.skills??={}).groupLine = v as any },

    get groupLineStyle(){ return ui.skills?.groupLineStyle ?? 'solid' },
    set groupLineStyle(v){ (ui.skills??={}).groupLineStyle = v as any },

    get groupLineWidth(){ return ui.skills?.groupLineWidth ?? 100 },
    set groupLineWidth(v){ (ui.skills??={}).groupLineWidth = Number(v)||0 },

    get groupLineColor(){ return ui.skills?.groupLineColor ?? ui.skills?.chipColor ?? ui.accent },
    set groupLineColor(v){ (ui.skills??={}).groupLineColor = v as any },

    get chipVariant(){ return ui.skills?.chipVariant ?? 'text' },
    set chipVariant(v){ (ui.skills??={}).chipVariant = v as any },

    get chipDensity(){ return ui.skills?.chipDensity ?? 'compact' },
    set chipDensity(v){ (ui.skills??={}).chipDensity = v as any },

    get chipColor(){ return ui.skills?.chipColor ?? ui.accent },
    set chipColor(v){ (ui.skills??={}).chipColor = v as any },

  },

  // LANGUAGES
  languages: {
    get variant(){ return ui.languages?.variant ?? 'stars' },
    set variant(v){ (ui.languages??={}).variant = v as any },

    get sizePx(){ return ui.languages?.sizePx ?? 18 },
    set sizePx(v){ (ui.languages??={}).sizePx = Number(v)||18 },

    get maxLevel(){ return ui.languages?.maxLevel ?? 5 },
    set maxLevel(v){ (ui.languages??={}).maxLevel = Number(v)||5 },

    get accent(){ return ui.languages?.accent ?? ui.accent },
    set accent(v){ (ui.languages??={}).accent = v as any },
  },

  // SIGNATURE (inchangé)
  signature: {},
}

/* État du menu + source (1 section ou toutes) + ancrage activator */
const panelOpen      = ref(false)
const panelActive    = ref<string>(panels[0]?.key ?? 'experience')
const panelSource    = ref(panels)
const panelActivator = ref<Element | null>(null)

/* bouton dans la toolbar (Teleport) */
const toolbarBtnRef  = ref<HTMLElement | null>(null)

/* refs pour chaque bouton “tune” de section */
const tuneRefs = reactive<Record<string, HTMLElement | null>>({})
function setTuneRef(id: string, el: HTMLElement | null) {
  tuneRefs[id] = el
}

/* Ouvre le menu pour TOUTES les sections (anchored) */
function openSettingsAll() {
  panelSource.value    = panels
  panelActive.value    = panels[0]?.key || 'experience'
  panelActivator.value = toolbarBtnRef.value
  panelOpen.value      = true
}

/* Ouvre le menu pour 1 section (anchored) */
function openSettingsSingle(key: string, id: string) {
  panelSource.value    = panels.filter(p => p.key === key)
  panelActive.value    = key
  panelActivator.value = tuneRefs[id] || toolbarBtnRef.value
  panelOpen.value      = true
}

/* actions spéciales */
function handlePanelAction(sectionKey: string, actionKey: string) {
  if (sectionKey === 'signature') {
    if (actionKey === 'open')   signatureModal.value = true
    if (actionKey === 'remove') model.signature = null
  }
}

/* sync selected[] si changement via menu */
function handlePanelChanged(sectionKey: string, fieldKey: string, value: any) {
  if (sectionKey === 'experience' && fieldKey === 'variant') selected.experience = value
  if (sectionKey === 'education'  && fieldKey === 'variant') selected.education  = value
  if (sectionKey === 'skills'     && fieldKey === 'columns') selected.skills     = value >= 2 ? 'two-col' : 'stacked'
  if (sectionKey === 'languages'  && fieldKey === 'variant') selected.languages  = value
  if (sectionKey === 'photo'      && fieldKey === 'shape')   selected.photo      = value
  if (sectionKey === 'corner'     && (fieldKey === 'type' || fieldKey === 'style')) selected.corner = value
}

/* watchers & init */
watch(chosenKey, (k) => {
  const p = presets.find(x => x.key === k)
  if (p) {
    applyPreset(p)
    syncSelectedFromUi()
  }
}, { immediate: true })

onMounted(async () => {
  seedDemoContent()
  await nextTick()
  syncSelectedFromUi()
})
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-0">
          <v-list class="custom-list pa-0" :lines="false">
              <v-list-item color="primary">
                <v-list-subheader class="text-uppercase text-default font-weight-bold py-0 px-1">
                  Forms & Models
                </v-list-subheader>

                <v-item-group
                  v-model="selected.models"
                  mandatory
                  @update:modelValue="val => setLayout(val as any)"
                >
                  <div class="d-flex flex-wrap">
                    <v-btn
                      ref="toolbarBtnRef"
                      size="small"
                      variant="elevated"
                      color="primary"
                      class="text-none rounded-xl model-btn my-2"
                      @click="openSettingsAll()"
                      :title="'Open settings'"
                    >
                      <v-icon start icon="mdi-tune-variant" />
                    </v-btn>
                    <v-item
                      v-for="a in models.actions"
                      :key="a.key"
                      :value="a.key"
                      v-slot="{ isSelected, toggle }"
                    >
                      <v-btn
                        class="text-none mx-1 my-1"
                        :class="isSelected ? 'border border-radius-xl border-secondary border-md shadow-2xl shadow-primary' : 'border border-radius-xl border-secondary border-md'"
                        :variant="isSelected ? 'elevated' : 'text'"
                        size="small"
                        rounded="lg"
                        @click="toggle"
                      >
                        <v-icon v-if="a.icon" start :icon="a.icon" />
                        {{ a.label ?? a.key }}
                      </v-btn>
                    </v-item>
                  </div>
                </v-item-group>
              </v-list-item>

              <!-- Langues (UI) -->
              <v-list-item color="primary">
                <v-list-subheader dense class="text-uppercase text-default font-weight-bold py-0 px-1">
                  Languages
                </v-list-subheader>
                <v-item-group v-model="ui.accent" mandatory>
                  <div class="d-flex align-center justify-center flex-wrap">
                    <v-item v-for="l in languages" :key="l.code" :value="l.code" v-slot="{ isSelected, toggle }">
                      <v-btn :class="isSelected ? 'border border-radius-xl border-secondary border-md shadow-2xl shadow-primary' : ''" variant="text" @click="toggle">
                        <span class="border border-radius-xl shadow-2xl shadow-primary object-cover" :class="`fi ${l.icon}`" style="width: 36px; height: 30px;" />
                      </v-btn>
                    </v-item>
                  </div>
                </v-item-group>
              </v-list-item>

              <!-- Couleurs -->
              <v-list-item color="primary">
                <v-list-subheader class="text-uppercase text-default font-weight-bold py-0 px-1">
                  Colors
                </v-list-subheader>
                <v-item-group v-model="ui.accent" mandatory>
                  <div class="d-flex flex-wrap">
                    <v-item v-for="c in flatSwatches" :key="c" :value="c" v-slot="{ isSelected, toggle }">
                      <v-btn
                        class="ma-1"
                        :class="isSelected ? 'border border-radius-xl border-secondary border-md shadow-2xl shadow-primary' : ''"
                        size="x-small"
                        :style="{ backgroundColor: c, borderRadius: '8px' }"
                        :elevation="isSelected ? 24 : 1"
                        @click="toggle"
                      />
                    </v-item>
                  </div>
                </v-item-group>
              </v-list-item>

              <!-- Raccourcis -->
              <v-list-item color="primary">
                <div class="d-flex align-center justify-center">
                  <v-btn class="mx-1" size="small" variant="outlined" :color="ui.photo.show ? 'default' : 'primary'"
                         :prepend-icon="ui.photo.show ? 'mdi-eye-off' : 'mdi-image-plus'"
                         @click="ui.photo.show = !ui.photo.show">
                    Image
                  </v-btn>
                  <v-btn class="mx-1" size="small" variant="outlined" color="primary" prepend-icon="mdi-shape-outline"
                         @click="openSettingsSingle('corner', 'toolbar-corner')">
                    Corner
                  </v-btn>
                  <v-btn class="mx-1" size="small" variant="outlined" color="primary" prepend-icon="mdi-draw"
                         @click="signatureModal = true">
                    Sign
                  </v-btn>
                </div>
              </v-list-item>

              <!-- Export -->
              <v-list-item color="primary">
                <div class="d-flex mt-1 align-center justify-center">
                  <v-btn rounded="pill" size="x-small" variant="outlined" class="mx-1" color="default" icon="mdi-eye" @click="exportPdf" :loading="ui.exporting" />
                  <v-btn rounded="pill" size="x-small" variant="outlined" class="mx-1" color="primary" icon="mdi-content-save" @click="exportPdf" :loading="ui.exporting" />
                  <v-btn rounded="pill" size="x-small" variant="outlined" class="mx-1" color="primary" icon="mdi-download" @click="exportPdf" :loading="ui.exporting" />
                  <v-btn rounded="pill" size="x-small" variant="outlined" color="default" icon="mdi-draw" @click="signatureModal = true" />
                </div>
              </v-list-item>
          </v-list>
        </div>
      </teleport>
    </client-only>

    <v-dialog v-model="signatureModal" max-width="600">
      <Signature v-model="signatureModal" @signature="onSignatureFromPad" />
    </v-dialog>

    <v-row>
      <v-col cols="11">
        <v-card class="pa-0 ma-0" flat elevation="24" rounded="xl" style="width:97%; height:100%; background-color: transparent">
          <div ref="pdfRef">
            <div class="cv-page-wrap"
                 @mouseenter="hoverCanvas = true" @mouseleave="hoverCanvas = false"
                 @focusin="hoverCanvas = true" @focusout="hoverCanvas = false">
              <CvA4 :key="chosenKey" :ui="ui" :model="model" :preset="chosen">
                <template #personal>
                  <div :ref="setAnchorIfEmpty('personal')">
                    <PersonalGrid v-model="model.personal" @update-name="model.identity.name = $event" />
                  </div>
                </template>

                <!-- ====== Rendu dynamique des sections (main) ====== -->
                <template #experience>
                  <draggable v-model="sections" item-key="id" handle=".drag-handle" animation="150" :force-fallback="true">
                    <template #item="{ element: s, index }">
                      <div :ref="setAnchorIfEmpty(s.type as any)">
                        <div v-if="s.enabled" class="cv-section mb-8"
                             @mouseenter="hoverSection = index" @mouseleave="hoverSection = null">

                          <div class="section-actions" :class="{ show: hoverSection === index }">


                            <SectionCvLayout
                              :section-key="s.type"
                              :section-models="sectionModels"
                              :model-value="selected[s.type] ?? null"
                              @update:modelValue="val => { selected[s.type] = val; onAction(s.type, val) }"
                            />

                            <v-btn icon density="comfortable" variant="text" @click="move(index,-1)" :title="'move up'">
                              <v-icon icon="mdi-arrow-up" />
                            </v-btn>
                            <v-btn icon density="comfortable" variant="text" @click="move(index, 1)" :title="'move down'">
                              <v-icon icon="mdi-arrow-down"/>
                            </v-btn>
                            <v-btn icon density="comfortable" variant="text" @click.stop="removeSection(index)" :title="'delete'">
                              <v-icon icon="mdi-delete" color="error" />
                            </v-btn>
                            <!-- bouton paramètres section (ouvre le menu global sur CETTE section) -->
                            <v-btn
                              :ref="el => setTuneRef(s.id, el as any)"
                              icon
                              density="comfortable"
                              variant="text"
                              :title="'Section settings'"
                              @click="openSettingsSingle(s.type, s.id)"
                            >
                              <v-icon icon="mdi-tune-variant" />
                            </v-btn>
                            <v-btn icon density="comfortable" variant="text" class="drag-handle" :title="'drag'">
                              <v-icon icon="mdi-dots-grid" />
                            </v-btn>
                          </div>

                          <SectionHeaderEditable
                            v-model:title="s.title"
                            v-model:icon="s.icon"
                            class="mb-3"
                            @remove="removeSection(index)"
                          />

                          <component
                            :is="resolveComp(s)"
                            :model-value="s.type === 'custom' ? (s.props?.content ?? '') : getModelValue(s.type)"
                            @update:modelValue="val => {
                              if (s.type === 'custom') s.props = { ...(s.props||{}), content: val }
                              else setModelValue(s.type, val)
                            }"
                            v-bind="resolveProps(s)"
                          />
                        </div>
                      </div>
                    </template>
                  </draggable>

                  <!-- Pied de page : ajouter une section -->
                  <div class="add-section-fab" :class="{ show: hoverCanvas }">
                    <v-menu>
                      <template #activator="{ props }">
                        <v-btn v-bind="props" variant="outlined" color="primary" prepend-icon="mdi-plus">
                          Add section
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item v-for="t in Object.keys(SECTION_DEFS)" :key="t" @click="addSection(t as any)">
                          <template #prepend>
                            <v-icon :icon="({experience:'mdi-briefcase',education:'mdi-school',skills:'mdi-lightbulb',languages:'mdi-translate',interests:'mdi-heart',custom:'mdi-shape-outline'} as any)[t]" />
                          </template>
                          <v-list-item-title>{{ (SECTION_DEFS as any)[t].label }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </template>

                <template #sidebar>
                  <PersonalGrid v-model="model.personal" @update-name="model.identity.name = $event" in-sidebar />
                </template>

                <template #footer>
                  <img v-if="model.signature" class="signature" :src="model.signature" style="max-height:18mm" />
                  <div class="name">{{ model.identity.name }}</div>
                </template>
              </CvA4>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="1">
        <ListCVManager v-model="chosenKey" :presets="presets" class="mb-4" :drawer="drawer" :ui="ui" />
      </v-col>
    </v-row>

    <!-- ✅ Menu global unique — on lui passe l’activator et la source (1 ou plusieurs sections) -->
    <SectionSettingsMenu
      v-model="panelOpen"
      :hide-activator="true"
      :active="panelActive"
      :sections="panelSource"
      :bindings="bindings"
      :swatches="flatSwatches"
      :activator="panelActivator"
    @action="handlePanelAction"
    @changed="handlePanelChanged"
    />

  </v-container>
</template>

<style scoped>
.custom-list { background-color: transparent; }
.custom-item { transition: all .2s; border-radius: 12px; padding-left: 12px; margin-bottom: 4px; }
.custom-item:hover { background-color: rgba(0,0,0,.04); box-shadow: 0 3px 9px rgb(var(--v-theme-primary)); transform: translateX(2px); }
.router-link-exact-active { background-color: #e3f2fd; font-weight: 700; }

.cv-section { position: relative; }
.section-actions {
  position: absolute; top: 4px; right: 4px;
  display: flex; gap: 6px; align-items: center;
  opacity: 0; pointer-events: none; transition: opacity .15s ease; z-index: 5;
}
.section-actions.show { opacity: 1; pointer-events: auto; }
.drag-handle { cursor: grab; } .drag-handle:active { cursor: grabbing; }

.cv-page-wrap { position: relative; }
.add-section-fab {
  position: absolute; left: 50%; bottom: 8px; transform: translateX(-50%);
  opacity: 0; pointer-events: none; transition: opacity .15s ease; z-index: 10;
}
.add-section-fab.show { opacity: 1; pointer-events: auto; }
.models-wrap{
  display: grid;
  grid-auto-flow: column;                 /* remplit par colonnes */
  grid-template-rows: repeat(2, auto);    /* toujours 2 lignes */
  grid-auto-columns: minmax(120px, max-content);
  gap: 6px 8px;
  align-items: stretch;
}
.model-btn{ width: 100%; }
@media print { .add-section-fab { display: none !important; } }
</style>
