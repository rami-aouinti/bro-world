// presets/cvPresets.ts

export type CvPresetKey =
  | 'sidebarRight' | 'sidebarLeft' | 'stylish' | 'stacked' | 'photoLeft'
  | `corner-${'quarter'|'diagonal'|'notch'|'ribbon'|'dual-slope'}-${'tl'|'tr'|'bl'|'br'}`

export type CornerType   = 'quarter' | 'diagonal' | 'notch' | 'ribbon' | 'dual-slope'
export type CornerAnchor = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type Category     = 'Classic' | 'Creative' | 'Premium' | 'All'
export type Template     = 'CV' | 'Cover' | 'All'

export type SkillChipVariant     = 'text' | 'elevated' | 'outlined' | 'flat' | 'tonal' | 'plain'
export type InterestChipVariant  = 'text' | 'elevated' | 'outlined' | 'flat' | 'tonal' | 'plain'
export type LanguagesVariant     = 'stars' | 'bars' | 'dots'

type VBarConfig = {
  show: boolean
  side?: 'left'|'right'
  color?: string
  widthMm?: number
  offsetMm?: number
}

type SidebarConfig = {
  enabled?: boolean
  widthMm?: number
  background: string
  text?: string
  borderColor?: string
}

export type CvPreset = {
  key: CvPresetKey
  label: string
  default?: boolean
  fontFamily: string
  baseSize: string
  previewImg?: string
  palette: { primary: string; accent: string; paper: string; text: string }
  photo: { show: boolean; position: 'left'|'right'|'top'; widthMm: number; heightMm: number; rounded: boolean }
  photoShadow?: { enabled?: boolean; elevation?: number; color?: string; custom?: string }
  /** ➜ layouts gérés par CvA4.vue (voir CSS) */
  layout: 'stylish' | 'sidebar-left' | 'sidebar-right' | 'stacked' | 'photo-left'
  sidebar?: SidebarConfig
  corner?: {
    type: CornerType
    anchor?: CornerAnchor
    color?: string
    color2?: string
    sizeMm?: number
    offsetMmX?: number
    offsetMmY?: number
    rotateDeg?: number
    enabled?: boolean
  }
  vbar?: VBarConfig
  skills?: { chipVariant: SkillChipVariant; chipColor?: string; chipDensity?: 'comfortable'|'compact'|'default'; editable?: boolean; draggable?: boolean }
  interests?: { chipVariant: InterestChipVariant; chipColor?: string; chipDensity?: 'comfortable'|'compact'|'default'; editable?: boolean; draggable?: boolean }
  languages?: { variant: LanguagesVariant; maxLevel?: number; showNote?: boolean; sizePx?: number; accent?: string }

  /** 🔥 Nouveaux champs */
  template: Template              // ex: 'Klassisch' | 'Kreativ' | 'Alle'
  category: Category              // ex: 'Klassisch' | 'Kreativ' | 'Alle'
  src: string                     // URL PDF/source
  downloads: number               // compteur downloads
  views: number                   // compteur vues
}

/* ------------------ MODELS (layouts) d’exemple ------------------ */
const BASE_PRESETS: CvPreset[] = [
  {
    key: 'stylish',
    label: 'Stylish (Default)',
    default: true,
    fontFamily: 'Merriweather',
    baseSize: '13px',
    palette: { primary: '#d94f3d', accent: '#03203d', paper: '#ffffff', text: '#161616' },
    previewImg: '/img/cv/cv-2.png',
    photo: { show: true, position: 'left', widthMm: 28, heightMm: 28, rounded: false },
    photoShadow: { enabled: true, elevation: 8, color: 'rgba(0,0,0,.25)' },
    layout: 'stylish',
    corner: { type: 'quarter', anchor: 'top-left', color: '#09143d', sizeMm: 30, enabled: true },
    skills:    { chipVariant: 'tonal', chipColor: '#03203d', chipDensity: 'compact', editable: true, draggable: true },
    languages: { variant: 'bars', maxLevel: 5, showNote: true, sizePx: 8, accent: '#03203d' },
    category: 'Creative',
    template: 'CV',
    src: '/samples/stylish.pdf',
    downloads: 0,
    views: 0,
  },
  {
    key: 'sidebarRight',
    label: 'Sidebar Right',
    fontFamily: 'Inter',
    baseSize: '14px',
    palette: { primary: '#320604', accent: '#f29f05', paper: '#ffffff', text: '#111' },
    previewImg: '/img/cv/cv-1.png',
    photo: { show: true, position: 'right', widthMm: 42, heightMm: 42, rounded: true },
    layout: 'sidebar-right',
    sidebar: { enabled: true, widthMm: 70, background: '#3e61a6', text: '#0f172a', borderColor: '#0b0c0e' },
    corner: { type: 'quarter', anchor: 'top-left', color: '#59533a', sizeMm: 28, enabled: true },
    skills:    { chipVariant: 'outlined', chipColor: '#f29f05', chipDensity: 'compact', editable: true, draggable: true },
    languages: { variant: 'stars', maxLevel: 5, showNote: true, sizePx: 18, accent: '#f29f05' },
    category: 'Classic',
    template: 'CV',
    src: '/samples/sidebar-right.pdf',
    downloads: 0,
    views: 0,
  },
  {
    key: 'sidebarLeft',
    label: 'Sidebar Left',
    fontFamily: 'Inter',
    baseSize: '14px',
    palette: { primary: '#320604', accent: '#f29f05', paper: '#ffffff', text: '#111' },
    previewImg: '/img/cv/cv-1.png',
    photo: { show: true, position: 'right', widthMm: 42, heightMm: 42, rounded: true },
    layout: 'sidebar-left',
    sidebar: { enabled: true, widthMm: 70, background: '#3e61a6', text: '#0f172a', borderColor: '#0b0c0e' },
    corner: { type: 'quarter', anchor: 'top-left', color: '#59533a', sizeMm: 28, enabled: true },
    skills:    { chipVariant: 'outlined', chipColor: '#f29f05', chipDensity: 'compact', editable: true, draggable: true },
    languages: { variant: 'stars', maxLevel: 5, showNote: true, sizePx: 18, accent: '#f29f05' },
    category: 'Creative',
    template: 'Cover',
    src: '/samples/sidebar-left.pdf',
    downloads: 0,
    views: 0,
  },
  {
    key: 'stacked',
    label: 'Stacked (One column)',
    fontFamily: 'Inter',
    baseSize: '14px',
    palette: { primary: '#1f3d6d', accent: '#ff9e1a', paper: '#ffffff', text: '#0e0e0e' },
    previewImg: '/img/cv/cv-3.png',
    photo: { show: true, position: 'right', widthMm: 30, heightMm: 30, rounded: false },
    photoShadow: { enabled: true, elevation: 4, color: 'rgba(0,0,0,.25)' },
    layout: 'stacked',
    corner: { type: 'diagonal', anchor: 'top-left', color: '#26a4d3', sizeMm: 34, enabled: true },
    skills:    { chipVariant: 'elevated', chipColor: '#ff9e1a', chipDensity: 'comfortable', editable: true, draggable: true },
    languages: { variant: 'stars', maxLevel: 5, showNote: true, sizePx: 18, accent: '#ff9e1a' },
    category: 'Classic',
    template: 'CV',
    src: '/samples/stacked.pdf',
    downloads: 0,
    views: 0,
  },
  {
    key: 'photoLeft',
    label: 'Photo Left (alias)',
    fontFamily: 'Lato',
    baseSize: '13.5px',
    palette: { primary: '#26a4d3', accent: '#ce2626', paper: '#ffffff', text: '#0e0e0e' },
    previewImg: '/img/cv/cv-4.png',
    photo: { show: true, position: 'left', widthMm: 38, heightMm: 48, rounded: false },
    layout: 'photo-left',
    sidebar: { enabled: true, widthMm: 70, background: '#f3f7ff', text: '#0f172a', borderColor: '#e6e8ec' },
    corner: { type: 'diagonal', anchor: 'top-right', color: '#26a4d3', sizeMm: 34, enabled: true },
    vbar:   { show: true, side: 'left', color: '#c23d3d', widthMm: 3, offsetMm: 0 },
    skills:    { chipVariant: 'text', chipColor: '#ce2626', chipDensity: 'compact', editable: true, draggable: true },
    languages: { variant: 'stars', maxLevel: 5, showNote: true, sizePx: 18, accent: '#ce2626' },
    category: 'Premium',
    template: 'Cover',
    src: '/samples/photo-left.pdf',
    downloads: 0,
    views: 0,
  },
]

/* ------------------ 20 presets “corner-*” (tous les types × ancres) ------------------ */
const PAPER = '#ffffff'
const TEXT  = '#111111'

const TYPES: CornerType[] = ['quarter','diagonal','notch','ribbon','dual-slope']
const ANCHORS: CornerAnchor[] = ['top-left','top-right','bottom-left','bottom-right']

const ANCHOR_TO_SUFFIX: Record<CornerAnchor,'tl'|'tr'|'bl'|'br'> = {
  'top-left': 'tl', 'top-right': 'tr', 'bottom-left': 'bl', 'bottom-right': 'br',
}

const TYPE_COLORS: Record<CornerType, {accent: string, primary: string, size: number}> = {
  'quarter':    { accent: '#ffb400', primary: '#0b5cab', size: 30 },
  'diagonal':   { accent: '#26a4d3', primary: '#17324d', size: 34 },
  'notch':      { accent: '#ff6f61', primary: '#8a1d1d', size: 32 },
  'ribbon':     { accent: '#ff9e1a', primary: '#162235', size: 30 },
  'dual-slope': { accent: '#b88b6a', primary: '#2f2f2f', size: 32 },
}

function createCornerPreset(type: CornerType, anchor: CornerAnchor): CvPreset {
  const { accent, primary, size } = TYPE_COLORS[type]
  const suffix = ANCHOR_TO_SUFFIX[anchor]
  const key = `corner-${type}-${suffix}` as CvPresetKey

  const corner = { type, anchor, color: accent, sizeMm: size, enabled: true } as CvPreset['corner']
  if (type === 'ribbon' || type === 'dual-slope') (corner as any).color2 = primary

  return {
    key,
    label: `${type} – ${anchor.toUpperCase()}`,
    fontFamily: 'Inter',
    baseSize: '14px',
    previewImg: '/img/cv/cv-1.png',
    palette: { primary, accent, paper: PAPER, text: TEXT },
    photo: { show: false, position: 'left', widthMm: 30, heightMm: 30, rounded: false },
    layout: 'stylish',
    corner,
    skills:    { chipVariant: 'text', chipColor: accent, chipDensity: 'compact', editable: true, draggable: true },
    languages: { variant: 'stars', maxLevel: 5, showNote: true, sizePx: 18, accent },
    category: 'Creative',                 // défaut pour corner-*
    template: 'CV',                 // défaut pour corner-*
    src: `/samples/${key}.pdf`,          // ex: /samples/corner-diagonal-tr.pdf
    downloads: 0,
    views: 0,
  }
}

function createAllCornerPresets(): CvPreset[] {
  const out: CvPreset[] = []
  for (const t of TYPES) for (const a of ANCHORS) out.push(createCornerPreset(t, a))
  return out
}

const CORNER_PRESETS = createAllCornerPresets()

export const CV_PRESETS: CvPreset[] = [
  ...BASE_PRESETS,
  ...CORNER_PRESETS,
]

/** Helpers */
export const getPresetByKey = (key: string) => CV_PRESETS.find(p => p.key === key)
export const addView      = (p: CvPreset) => { p.views++ }
export const addDownload  = (p: CvPreset) => { p.downloads++ }
