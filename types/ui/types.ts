// ui/types.ts
export type UiPhotoShape = 'square' | 'circle'
export type UiSidebarSide = 'left' | 'right'
export type UiCornerType = 'quarter' | 'diagonal' | 'notch' | 'ribbon' | 'dual-slope'
export type UiCornerAnchor = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export type UiPhotoVariant = 'plain'|'frame'|'elevated'|'elevated-frame';

export interface UiPhoto {
  show: boolean
  position: 'left'|'right'|'top'
  widthMm: number
  heightMm: number
  shape: 'square'|'circle'
  // NEW
  variant: UiPhotoVariant
  frameWidth: number
  framePadding: number
  frameColor?: string
  frameBg?: string
  shadow: {
    enabled: boolean
    elevation: number
    color?: string
    custom?: string
  }
}

export type UiState = {
  /** Font + couleurs globales */
  fontFamily: string
  fontSize: string
  accent: string
  text?: string
  paper?: string
  primary?: string

  /** A4 padding (override par layout) */
  a4Padding?: string              // ex: "14mm" ou "0mm 0mm 0mm 14mm"

  /** Photo */
  photo: {
    show: true,
    position: 'right',
    widthMm: 30,
    heightMm: 30,
    shape: 'square',
    // NEW
    variant: 'plain',          // 'plain' | 'frame' | 'elevated' | 'elevated-frame'
    frameWidth: 0,             // px
    framePadding: 2,           // px
    frameColor: undefined,     // par défaut: hérite du primary si tu veux
    frameBg: undefined,
    shadow: {
      enabled: false,
      elevation: 8,
      color: 'rgba(0,0,0,.22)',
      custom: '',
    },
  },

  /** Sidebar */
  sidebar: {
    enabled: boolean             // true => layout forcé left/right si tu veux
    side: UiSidebarSide          // 'left' | 'right'
    background: string
    text?: string
    borderColor?: string
  }

  /** Corner (coin décoratif) */
  corner: {
    enabled: boolean
    type: UiCornerType
    anchor: UiCornerAnchor
    sizeMm: number
    color: string
    color2?: string
    offsetMmX?: number
    offsetMmY?: number
    rotateDeg?: number
  }

  /** Barre verticale pleine hauteur */
  vbar: {
    show: boolean
    side: 'left'|'right'
    color: string
    widthMm: number
    offsetMm: number
  }
}
