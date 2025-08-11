// ui/types.ts
export type UiPhotoShape = 'square' | 'circle'
export type UiSidebarSide = 'left' | 'right'
export type UiCornerType = 'quarter' | 'diagonal' | 'notch' | 'ribbon' | 'dual-slope'
export type UiCornerAnchor = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

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
    show: boolean
    shape: UiPhotoShape          // square|circle
    widthMm: number
    heightMm: number
    position: 'left'|'right'|'top'
    rounded?: boolean            // si tu veux rester compatible avec preset
    shadow: {
      enabled: boolean
      elevation: number          // 0–24
      color?: string
      custom?: string
    }
  }

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
