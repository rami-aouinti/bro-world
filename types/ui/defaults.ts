// ui/defaults.ts
import type { UiState } from './types'

export const defaultUi: UiState = {
  fontFamily: 'Inter',
  fontSize: '14px',
  accent: '#091b2d',
  text: '#111',
  paper: '#fff',
  primary: '#0b5cab',
  a4Padding: undefined, // laissé au layout/CvA4 si non défini

  photo: {
    show: true,
    shape: 'square',
    widthMm: 42,
    heightMm: 54,
    position: 'right',
    rounded: false,
    shadow: {
      enabled: false,
      elevation: 0,
      color: undefined,
      custom: undefined,
    }
  },

  sidebar: {
    enabled: false,
    side: 'right',
    background: '#f7f8fa',
    text: 'inherit',
    borderColor: '#e6e8ec',
  },

  corner: {
    enabled: false,
    type: 'quarter',
    anchor: 'top-left',
    sizeMm: 28,
    color: '#f2c100',
    color2: undefined,
    offsetMmX: 0,
    offsetMmY: 0,
    rotateDeg: 0,
  },

  vbar: {
    show: false,
    side: 'left',
    color: '#b88b6a',
    widthMm: 3,
    offsetMm: 0,
  }
}
