// /presets/coverPresets.ts
export type CornerType =
  | 'none'
  | 'quarter'
  | 'diagonal'
  | 'notch'
  | 'ribbon'
  | 'dual-slope'

export type CornerAnchor = 'top-left'|'top-right'|'bottom-left'|'bottom-right'
export type PhotoPosition = 'left'|'right'|'top'|'none'

export type CoverPreset = {
  key: string
  label: string
  description?: string
  fontFamily: string
  fontSize: string
  palette: { accent: string; paper: string; text: string; dark?: string }
  corner: { type: CornerType; anchor: CornerAnchor; primary: string; secondary?: string; sizeMm: number; enabled: boolean }
  photo: { show: boolean; position: PhotoPosition; widthMm: number; heightMm: number; rounded: boolean }
  layout?: 'classic'|'modern'|'clean'
}

export const COVER_PRESETS: CoverPreset[] = [
  {
    key: 'classic',
    label: 'Klassisch',
    description: 'Serifen + Rouge',
    fontFamily: 'Georgia',
    fontSize: '14px',
    palette: { accent: '#C43D3D', paper: '#ffffff', text: '#161616', dark: '#2b2b2b' },
    corner: { type: 'quarter', anchor: 'top-left', primary: '#2b2b2b', sizeMm: 32, enabled: true },
    photo: { show: true, position: 'right', widthMm: 38, heightMm: 48, rounded: false },
    layout: 'classic',
  },
  {
    key: 'modern',
    label: 'Modern',
    description: 'Sans Serif + Bleu',
    fontFamily: 'Inter',
    fontSize: '15px',
    palette: { accent: '#2F6EC4', paper: '#ffffff', text: '#111111', dark: '#1a1a1a' },
    corner: { type: 'diagonal', anchor: 'top-left', primary: '#1a1a1a', sizeMm: 34, enabled: true },
    photo: { show: true, position: 'right', widthMm: 38, heightMm: 48, rounded: true },
    layout: 'modern',
  },
  {
    key: 'clean',
    label: 'Clean',
    description: 'Roboto + Gris',
    fontFamily: 'Roboto',
    fontSize: '14px',
    palette: { accent: '#999999', paper: '#ffffff', text: '#121212', dark: '#2a2a2a' },
    corner: { type: 'notch', anchor: 'top-left', primary: '#2a2a2a', sizeMm: 30, enabled: true },
    photo: { show: false, position: 'none', widthMm: 38, heightMm: 48, rounded: false },
    layout: 'clean',
  },
  {
    key: 'ribbonRight',
    label: 'Ribbon Right',
    description: 'Ruban bicolore',
    fontFamily: 'Inter',
    fontSize: '14px',
    palette: { accent: '#FF9E1A', paper: '#ffffff', text: '#0f0f0f', dark: '#152238' },
    corner: { type: 'ribbon', anchor: 'top-right', primary: '#152238', secondary: '#FF9E1A', sizeMm: 32, enabled: true },
    photo: { show: true, position: 'left', widthMm: 38, heightMm: 48, rounded: false },
    layout: 'modern',
  },
  {
    key: 'dualSlope',
    label: 'Dual Slope',
    description: 'Double pente',
    fontFamily: 'Merriweather',
    fontSize: '14px',
    palette: { accent: '#B88B6A', paper: '#ffffff', text: '#0f0f0f', dark: '#2f2f2f' },
    corner: { type: 'dual-slope', anchor: 'top-left', primary: '#2f2f2f', secondary: '#B88B6A', sizeMm: 32, enabled: true },
    photo: { show: true, position: 'top', widthMm: 38, heightMm: 48, rounded: false },
    layout: 'classic',
  },
]
