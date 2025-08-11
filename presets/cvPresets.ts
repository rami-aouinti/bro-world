// presets/cvPresets.ts
export type CvPresetKey =
  | 'sidebarRight' | 'stylish' | 'latest'
  | 'photoLeft' | 'photoLeft-1' | 'photoLeft-2' | 'photoLeft-3' | 'photoLeft-4'
  | `corner-${'quarter'|'diagonal'|'notch'|'ribbon'|'dual-slope'}-${'tl'|'tr'|'bl'|'br'}`

export type CornerType = 'quarter' | 'diagonal' | 'notch' | 'ribbon' | 'dual-slope'
export type CornerAnchor = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
type VBarConfig = {
  show: boolean
  side?: 'left'|'right'
  color?: string
  widthMm?: number
  offsetMm?: number
}
export type CvPreset = {
  key: CvPresetKey
  label: string
  fontFamily: string
  baseSize: string
  previewImg?: string
  palette: { primary: string; accent: string; paper: string; text: string }
  photo: { show: boolean; position: 'left'|'right'|'top'; widthMm: number; heightMm: number; rounded: boolean }
  photoShadow?: {
    enabled?: boolean           // défaut: false
    elevation?: number          // 0–24 (Material-like)
    color?: string              // ex: 'rgba(0,0,0,.24)'
    custom?: string             // override total: ex '0 10px 30px rgba(0,0,0,.3)'
  }
  layout: 'sidebar-right' | 'stylish' | 'latest' | 'photo-left' | 'sidebar-left'
  sidebar?: {
    background: string        // ✅ NOUVEAU: couleur de fond
    text?: string             // optionnel: couleur du texte dans la sidebar
    borderColor?: string      // optionnel: couleur de la bordure
  }
  corner?: {
    type: CornerType
    anchor?: CornerAnchor
    color?: string
    color2?: string
    sizeMm?: number
    offsetMmX?: number
    offsetMmY?: number
    rotateDeg?: number
  }
  vbar?: VBarConfig
}

/* ------------------ TES 8 PRESETS EXISTANTS ------------------ */

const BASE_PRESETS: CvPreset[] = [
  {
    key: 'sidebarRight',
    label: 'CV sidebar on the right',
    fontFamily: 'Inter',
    baseSize: '14px',
    palette: { primary: '#320604', accent: '#f29f05', paper: '#ffffff', text: '#111' },
    photo: { show: true, position: 'right', widthMm: 42, heightMm: 54, rounded: true },
    previewImg: '/img/cv/cv-1.png',
    photoShape: 'square',
    layout: 'sidebar-right',
    sidebar: {
      background: '#3e61a6',     // ✅ couleur du panneau
      text: '#0f172a',           // optionnel
      borderColor: '#0b0c0e'     // optionnel
    },
    corner: { type: 'quarter', anchor: 'top-left', color: '#f2c100', sizeMm: 28 }
  },
  {
    key: 'stylish',
    label: 'Stylish CV',
    fontFamily: 'Merriweather',
    baseSize: '13px',
    palette: { primary: '#d94f3d', accent: '#03203d', paper: '#ffffff', text: '#161616' },
    previewImg: '/img/cv/cv-2.png',
    photo: { show: true, position: 'left', widthMm: 28, heightMm: 28, rounded: false },
    photoShape: 'circle',
    photoShadow: { enabled: true, elevation: 8, color: 'rgba(0,0,0,.25)' },
    layout: 'stylish',
    corner: { type: 'quarter', anchor: 'top-right', color: '#ff9e1a', sizeMm: 30 }
  },
  {
    key: 'latest',
    label: 'Latest CV',
    fontFamily: 'Inter',
    baseSize: '13.5px',
    palette: { primary: '#1f3d6d', accent: '#ff9e1a', paper: '#ffffff', text: '#0e0e0e' },
    previewImg: '/img/cv/cv-3.png',
    photo: { show: true, position: 'right', widthMm: 30, heightMm: 30, rounded: false },
    photoShadow: { enabled: true, elevation: 4, color: 'rgba(180,34,34,0.25)' },
    photoShape: 'circle',
    layout: 'latest',
    corner: { type: 'diagonal', anchor: 'top-left', color: '#26a4d3', sizeMm: 34 }
  },
  {
    key: 'photoLeft',
    label: 'CV photo left side',
    previewImg: '/img/cv/cv-4.png',
    fontFamily: 'Lato',
    baseSize: '13.5px',
    palette: { primary: '#26a4d3', accent: '#ce2626', paper: '#ffffff', text: '#0e0e0e' },
    photo: { show: true, position: 'left', widthMm: 38, heightMm: 48, rounded: false },
    photoShape: 'circle',
    layout: 'sidebar-left',
    corner: { type: 'diagonal', anchor: 'top-right', color: '#26a4d3', sizeMm: 34 },
    vbar: { show: true, side: 'left', color: '#c23d3d', widthMm: 3, offsetMm: 0 }

  },
  {
    key: 'photoLeft-1',
    label: 'CV photo 1',
    fontFamily: 'Lato',
    previewImg: '/img/cv/cv-5.png',
    baseSize: '13.5px',
    palette: { primary: '#000000', accent: '#332f2f', paper: '#ffffff', text: '#0e0e0e' },
    photo: { show: true, position: 'left', widthMm: 38, heightMm: 48, rounded: false },
    photoShape: 'circle',
    layout: 'sidebar-left',
    corner: { type: 'diagonal', anchor: 'bottom-left', color: '#ff6f61', sizeMm: 34 }
  },
  {
    key: 'photoLeft-2',
    label: 'CV photo 2',
    fontFamily: 'Lato',
    previewImg: '/img/cv/cv-1.png',
    baseSize: '13.5px',
    palette: { primary: '#c51616', accent: '#000000', paper: '#ffffff', text: '#0e0e0e' },
    photo: { show: true, position: 'left', widthMm: 38, heightMm: 48, rounded: false },
    layout: 'photo-left',
    corner: { type: 'notch', anchor: 'top-right', color: '#ff9e1a', sizeMm: 32 }
  },
  {
    key: 'photoLeft-3',
    label: 'CV photo 3',
    fontFamily: 'Lato',
    previewImg: '/img/cv/cv-2.png',
    baseSize: '13.5px',
    palette: { primary: '#4db928', accent: '#e00a1e', paper: '#ffffff', text: '#0e0e0e' },
    photo: { show: true, position: 'left', widthMm: 38, heightMm: 48, rounded: false },
    layout: 'photo-left',
    corner: { type: 'quarter', anchor: 'top-right', color: '#ff9e1a', color2: '#162235', sizeMm: 30 }
  },
  {
    key: 'photoLeft-4',
    label: 'CV photo 4',
    fontFamily: 'Lato',
    previewImg: '/img/cv/cv-3.png',
    baseSize: '13.5px',
    palette: { primary: '#818181', accent: '#320604', paper: '#ffffff', text: '#0e0e0e' },
    photo: { show: true, position: 'right', widthMm: 38, heightMm: 48, rounded: false },
    layout: 'photo-left',
    corner: { type: 'dual-slope', anchor: 'top-left', color: '#b88b6a', color2: '#2f2f2f', sizeMm: 32 }
  },
]

/* ------------------ GÉNÉRATEUR DES 20 COINS ------------------ */

const PAPER = '#ffffff'
const TEXT  = '#111111'

const TYPES: CornerType[] = ['quarter','diagonal','notch','ribbon','dual-slope']
const ANCHORS: CornerAnchor[] = ['top-left','top-right','bottom-left','bottom-right']

const ANCHOR_TO_SUFFIX: Record<CornerAnchor,'tl'|'tr'|'bl'|'br'> = {
  'top-left': 'tl',
  'top-right': 'tr',
  'bottom-left': 'bl',
  'bottom-right': 'br',
}

/** Couleurs par type (tu peux ajuster à ton goût) */
const TYPE_COLORS: Record<CornerType, {accent: string, primary: string, size: number}> = {
  'quarter':    { accent: '#ffb400', primary: '#0b5cab', size: 30 },
  'diagonal':   { accent: '#26a4d3', primary: '#17324d', size: 34 },
  'notch':      { accent: '#ff6f61', primary: '#8a1d1d', size: 32 },
  'ribbon':     { accent: '#ff9e1a', primary: '#162235', size: 30 },
  'dual-slope': { accent: '#b88b6a', primary: '#2f2f2f', size: 32 },
}

function createCornerPreset(type: CornerType, anchor: CornerAnchor): CvPreset {
  const colors = TYPE_COLORS[type]
  const suffix = ANCHOR_TO_SUFFIX[anchor]
  const key = `corner-${type}-${suffix}` as CvPresetKey
  const label = `${type.replace('-', ' ')} – ${anchor.toUpperCase()}`

  const cornerCommon = {
    type,
    anchor,
    color: colors.accent,
    sizeMm: colors.size,
  } as CvPreset['corner']

  // certains types ont color2
  if (type === 'ribbon' || type === 'dual-slope') {
    (cornerCommon as any).color2 = colors.primary
  }

  return {
    key,
    label,
    fontFamily: 'Inter',
    baseSize: '14px',
    previewImg: '/img/cv/cv-1.png',
    palette: { primary: colors.primary, accent: colors.accent, paper: PAPER, text: TEXT },
    photo: { show: false, position: 'left', widthMm: 30, heightMm: 30, rounded: false },
    layout: 'photo-left',

    corner: cornerCommon,
  }
}

function createAllCornerPresets(): CvPreset[] {
  const out: CvPreset[] = []
  for (const t of TYPES) {
    for (const a of ANCHORS) {
      out.push(createCornerPreset(t, a))
    }
  }
  return out
}

const CORNER_PRESETS = createAllCornerPresets()

/* -------------- EXPORT FINAL : fusion (8 + 20 = 28) -------------- */
export const CV_PRESETS: CvPreset[] = [
  ...BASE_PRESETS,
  ...CORNER_PRESETS,
]
