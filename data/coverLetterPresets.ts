// data/coverLetterPresets.ts

/* ========= Types simples (compatibles avec ton UI) ========= */

export type PhotoVariant =
  | 'plain'
  | 'frame'
  | 'guidelines'
  | 'elevated'
  | 'elevated-frame'

export type PhotoShape = 'square' | 'circle'
export type PhotoPos = 'left' | 'right' | 'top'

export type CornerType =
  | 'quarter'
  | 'diagonal'
  | 'notch'
  | 'ribbon'
  | 'dual-slope'
  | 'none'

export type CornerAnchor = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export type CoverUIPartial = {
  fontFamily?: string
  fontSize?: string
  accent?: string

  photo?: {
    show?: boolean
    position?: PhotoPos
    shape?: PhotoShape
    widthMm?: number
    heightMm?: number
    variant?: PhotoVariant
    borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted'
    borderWidthPx?: number
    borderColor?: string
  }

  corner?: {
    enabled?: boolean
    type?: CornerType
    anchor?: CornerAnchor
    sizeMm?: number
    color?: string
    color2?: string
  }
}

export type CoverPreset = {
  key: string
  label: string
  description?: string
  apply: (ui: any) => void
}

/* ========= Listes pour les selects ========= */

export const fonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Merriweather',
  'Georgia',
  'Times New Roman',
]

export const fontSizes = ['12px', '13px', '14px', '15px', '16px', '18px'] as const

export const photoVariants: PhotoVariant[] = [
  'plain',
  'frame',
  'guidelines',
  'elevated',
  'elevated-frame',
]

export const cornerTypes: CornerType[] = [
  'quarter',
  'diagonal',
  'notch',
  'ribbon',
  'dual-slope',
  'none',
]

export const cornerAnchors: CornerAnchor[] = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
]

/* ========= Helper d’application robuste ========= */

function ensureBranches(ui: any) {
  ui.photo ??= {}
  ui.corner ??= {}
}

export function applyCoverPreset(ui: any, preset: CoverPreset) {
  if (!ui || !preset) return
  ensureBranches(ui)
  try {
    preset.apply(ui)
  } catch (e) {
    // On évite tout crash silencieux
    console.error('[applyCoverPreset] failed for', preset?.key, e)
  }
}

/* ========= Presets =========
   Tous ces presets ne supposent rien : ils créent les branches manquantes.
*/

export const COVER_PRESETS: CoverPreset[] = [
  // --- Classiques de base ---
  {
    key: 'classic',
    label: 'Classique',
    description: 'Georgia, rouge brique, coin quart',
    apply: (ui: any) => {
      ensureBranches(ui)
      ui.fontFamily = 'Georgia'
      ui.fontSize = '14px'
      ui.accent = '#c43d3d'

      Object.assign(ui.photo, {
        show: true,
        position: 'right',
        shape: 'square',
        widthMm: 38,
        heightMm: 48,
        variant: 'frame',
        borderStyle: 'solid',
        borderWidthPx: 2,
        borderColor: '#c43d3d',
      } as CoverUIPartial['photo'])

      Object.assign(ui.corner, {
        enabled: true,
        type: 'quarter',
        anchor: 'top-left',
        sizeMm: 28,
        color: '#c43d3d',
        color2: '',
      } as CoverUIPartial['corner'])
    },
  },
  {
    key: 'modern',
    label: 'Moderne',
    description: 'Inter, bleu, diagonal',
    apply: (ui: any) => {
      ensureBranches(ui)
      ui.fontFamily = 'Inter'
      ui.fontSize = '15px'
      ui.accent = '#2f6ec4'

      Object.assign(ui.photo, {
        show: true,
        position: 'right',
        shape: 'square',
        widthMm: 40,
        heightMm: 50,
        variant: 'elevated',
        borderStyle: 'none',
        borderWidthPx: 0,
        borderColor: '#2f6ec4',
      } as CoverUIPartial['photo'])

      Object.assign(ui.corner, {
        enabled: true,
        type: 'diagonal',
        anchor: 'top-left',
        sizeMm: 28,
        color: '#2f6ec4',
        color2: '',
      } as CoverUIPartial['corner'])
    },
  },
  {
    key: 'clean',
    label: 'Épuré',
    description: 'Roboto, gris, sans coin',
    apply: (ui: any) => {
      ensureBranches(ui)
      ui.fontFamily = 'Roboto'
      ui.fontSize = '14px'
      ui.accent = '#999999'

      Object.assign(ui.photo, {
        show: false,
      } as CoverUIPartial['photo'])

      Object.assign(ui.corner, {
        enabled: false,
      } as CoverUIPartial['corner'])
    },
  },

  // --- Variations supplémentaires (demandées) ---
  {
    key: 'modern-blue',
    label: 'Modern Blue',
    description: 'Inter 15, bleu, coin diagonal',
    apply: (ui: any) => {
      ensureBranches(ui)
      ui.fontFamily = 'Inter'
      ui.fontSize = '15px'
      ui.accent = '#2f6ec4'

      Object.assign(ui.photo, {
        show: true,
        position: 'right',
        shape: 'square',
        widthMm: 40,
        heightMm: 50,
        variant: 'elevated',
        borderStyle: 'none',
        borderWidthPx: 0,
        borderColor: '#2f6ec4',
      } as CoverUIPartial['photo'])

      Object.assign(ui.corner, {
        enabled: true,
        type: 'diagonal',
        anchor: 'top-left',
        sizeMm: 28,
        color: '#2f6ec4',
        color2: '',
      } as CoverUIPartial['corner'])
    },
  },
  {
    key: 'minimal-mono',
    label: 'Minimal Mono',
    description: 'Open Sans 14, gris, sans coin, sans photo',
    apply: (ui: any) => {
      ensureBranches(ui)
      ui.fontFamily = 'Open Sans'
      ui.fontSize = '14px'
      ui.accent = '#888888'
      Object.assign(ui.photo, { show: false } as CoverUIPartial['photo'])
      Object.assign(ui.corner, { enabled: false } as CoverUIPartial['corner'])
    },
  },
  {
    key: 'emerald-left-ribbon',
    label: 'Emerald Ribbon (Left)',
    description: 'Inter, vert émeraude, ruban gauche + photo encadrée',
    apply: (ui: any) => {
      ensureBranches(ui)
      ui.fontFamily = 'Inter'
      ui.fontSize = '15px'
      ui.accent = '#2e7d32'

      Object.assign(ui.photo, {
        show: true,
        position: 'left',
        shape: 'square',
        widthMm: 38,
        heightMm: 48,
        variant: 'frame',
        borderStyle: 'solid',
        borderWidthPx: 2,
        borderColor: '#2e7d32',
      } as CoverUIPartial['photo'])

      Object.assign(ui.corner, {
        enabled: true,
        type: 'ribbon',
        anchor: 'top-left',
        sizeMm: 34,
        color: '#2e7d32',
        color2: '#1b5e20',
      } as CoverUIPartial['corner'])
    },
  },
  {
    key: 'serif-warm-top-photo',
    label: 'Serif Warm (Top Photo)',
    description: 'Merriweather 15, accent brique, photo en haut ronde',
    apply: (ui: any) => {
      ensureBranches(ui)
      ui.fontFamily = 'Merriweather'
      ui.fontSize = '15px'
      ui.accent = '#b23a48'

      Object.assign(ui.photo, {
        show: true,
        position: 'top',
        shape: 'circle',
        widthMm: 36,
        heightMm: 36,
        variant: 'frame',
        borderStyle: 'solid',
        borderWidthPx: 2,
        borderColor: '#b23a48',
      } as CoverUIPartial['photo'])

      Object.assign(ui.corner, {
        enabled: true,
        type: 'quarter',
        anchor: 'top-right',
        sizeMm: 26,
        color: '#b23a48',
        color2: '',
      } as CoverUIPartial['corner'])
    },
  },
  {
    key: 'tech-gray-right',
    label: 'Tech Gray',
    description: 'Roboto 14, gris froid, coin notch',
    apply: (ui: any) => {
      ensureBranches(ui)
      ui.fontFamily = 'Roboto'
      ui.fontSize = '14px'
      ui.accent = '#607d8b'

      Object.assign(ui.photo, {
        show: true,
        position: 'right',
        shape: 'square',
        widthMm: 38,
        heightMm: 48,
        variant: 'guidelines',
        borderStyle: 'dashed',
        borderWidthPx: 1,
        borderColor: '#607d8b',
      } as CoverUIPartial['photo'])

      Object.assign(ui.corner, {
        enabled: true,
        type: 'notch',
        anchor: 'top-right',
        sizeMm: 30,
        color: '#607d8b',
        color2: '',
      } as CoverUIPartial['corner'])
    },
  },
  {
    key: 'executive-purple',
    label: 'Executive Purple',
    description: 'Lato 15, violet profond, dual-slope bas droite',
    apply: (ui: any) => {
      ensureBranches(ui)
      ui.fontFamily = 'Lato'
      ui.fontSize = '15px'
      ui.accent = '#6a1b9a'

      Object.assign(ui.photo, {
        show: true,
        position: 'right',
        shape: 'square',
        widthMm: 40,
        heightMm: 50,
        variant: 'elevated-frame',
        borderStyle: 'solid',
        borderWidthPx: 2,
        borderColor: '#6a1b9a',
      } as CoverUIPartial['photo'])

      Object.assign(ui.corner, {
        enabled: true,
        type: 'dual-slope',
        anchor: 'bottom-right',
        sizeMm: 34,
        color: '#6a1b9a',
        color2: '#4a148c',
      } as CoverUIPartial['corner'])
    },
  },
  {
    key: 'clean-blackline',
    label: 'Clean Blackline',
    description: 'Inter 14, noir, coin diagonal fin, photo off',
    apply: (ui: any) => {
      ensureBranches(ui)
      ui.fontFamily = 'Inter'
      ui.fontSize = '14px'
      ui.accent = '#222222'

      Object.assign(ui.photo, { show: false } as CoverUIPartial['photo'])

      Object.assign(ui.corner, {
        enabled: true,
        type: 'diagonal',
        anchor: 'top-left',
        sizeMm: 18,
        color: '#222222',
        color2: '',
      } as CoverUIPartial['corner'])
    },
  },
  {
    key: 'warm-sand-left',
    label: 'Warm Sand (Left)',
    description: 'Georgia 15, sable, photo gauche ronde',
    apply: (ui: any) => {
      ensureBranches(ui)
      ui.fontFamily = 'Georgia'
      ui.fontSize = '15px'
      ui.accent = '#b88b6a'

      Object.assign(ui.photo, {
        show: true,
        position: 'left',
        shape: 'circle',
        widthMm: 36,
        heightMm: 36,
        variant: 'elevated',
        borderStyle: 'solid',
        borderWidthPx: 1,
        borderColor: '#b88b6a',
      } as CoverUIPartial['photo'])

      Object.assign(ui.corner, {
        enabled: true,
        type: 'quarter',
        anchor: 'top-left',
        sizeMm: 30,
        color: '#b88b6a',
        color2: '',
      } as CoverUIPartial['corner'])
    },
  },
]

/* Optionnel : petit utilitaire */
export function getCoverPreset(key: string): CoverPreset | undefined {
  return COVER_PRESETS.find(p => p.key === key)
}
