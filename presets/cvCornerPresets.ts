// presets/cvCornerPresets.ts
export type CvPresetKey = string

export type CornerType = 'quarter' | 'diagonal' | 'notch' | 'ribbon' | 'dual-slope'
export type CornerAnchor = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export type CvPreset = {
  key: CvPresetKey
  label: string
  fontFamily: string
  baseSize: string
  palette: { primary: string; accent: string; paper: string; text: string }
  photo: { show: boolean; position: 'left'|'right'|'top'; widthMm: number; heightMm: number; rounded: boolean }
  layout: 'sidebar-right' | 'stylish' | 'latest' | 'photo-left'
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
}

/** Palette helpers (juste pour démo) */
const PAPER = '#ffffff'
const TEXT  = '#111111'

/** base preset factory */
function base(label: string, key: string, corner: CvPreset['corner'], opts?: Partial<CvPreset>) : CvPreset {
  return {
    key,
    label,
    fontFamily: opts?.fontFamily ?? 'Inter',
    baseSize:   opts?.baseSize   ?? '14px',
    palette: {
      primary: opts?.palette?.primary ?? '#1f3d6d',
      accent:  opts?.palette?.accent  ?? '#ff9e1a',
      paper:   opts?.palette?.paper   ?? PAPER,
      text:    opts?.palette?.text    ?? TEXT,
    },
    photo: opts?.photo ?? { show: false, position: 'left', widthMm: 30, heightMm: 30, rounded: false },
    layout: opts?.layout ?? 'photo-left',
    corner,
  }
}

/** === 20 variantes (5 formes × 4 coins) === */
export const CV_PRESETS: CvPreset[] = [
  // QUARTER
  base('Quarter – Top Left',    'corner-quarter-tl',
    { type:'quarter', anchor:'top-left',    color:'#ffb400', sizeMm:30 },
    { palette:{ primary:'#0b5cab', accent:'#ffb400', paper:PAPER, text:TEXT } }
  ),
  base('Quarter – Top Right',   'corner-quarter-tr',
    { type:'quarter', anchor:'top-right',   color:'#ffb400', sizeMm:30 },
    { palette:{ primary:'#0b5cab', accent:'#ffb400', paper:PAPER, text:TEXT } }
  ),
  base('Quarter – Bottom Left', 'corner-quarter-bl',
    { type:'quarter', anchor:'bottom-left', color:'#ffb400', sizeMm:30 },
    { palette:{ primary:'#0b5cab', accent:'#ffb400', paper:PAPER, text:TEXT } }
  ),
  base('Quarter – Bottom Right','corner-quarter-br',
    { type:'quarter', anchor:'bottom-right',color:'#ffb400', sizeMm:30 },
    { palette:{ primary:'#0b5cab', accent:'#ffb400', paper:PAPER, text:TEXT } }
  ),

  // DIAGONAL
  base('Diagonal – Top Left',    'corner-diagonal-tl',
    { type:'diagonal', anchor:'top-left',    color:'#26a4d3', sizeMm:34 },
    { palette:{ primary:'#17324d', accent:'#26a4d3', paper:PAPER, text:TEXT } }
  ),
  base('Diagonal – Top Right',   'corner-diagonal-tr',
    { type:'diagonal', anchor:'top-right',   color:'#26a4d3', sizeMm:34 },
    { palette:{ primary:'#17324d', accent:'#26a4d3', paper:PAPER, text:TEXT } }
  ),
  base('Diagonal – Bottom Left', 'corner-diagonal-bl',
    { type:'diagonal', anchor:'bottom-left', color:'#26a4d3', sizeMm:34 },
    { palette:{ primary:'#17324d', accent:'#26a4d3', paper:PAPER, text:TEXT } }
  ),
  base('Diagonal – Bottom Right','corner-diagonal-br',
    { type:'diagonal', anchor:'bottom-right',color:'#26a4d3', sizeMm:34 },
    { palette:{ primary:'#17324d', accent:'#26a4d3', paper:PAPER, text:TEXT } }
  ),

  // NOTCH
  base('Notch – Top Left',    'corner-notch-tl',
    { type:'notch', anchor:'top-left',    color:'#ff6f61', sizeMm:32 },
    { palette:{ primary:'#8a1d1d', accent:'#ff6f61', paper:PAPER, text:TEXT } }
  ),
  base('Notch – Top Right',   'corner-notch-tr',
    { type:'notch', anchor:'top-right',   color:'#ff6f61', sizeMm:32 },
    { palette:{ primary:'#8a1d1d', accent:'#ff6f61', paper:PAPER, text:TEXT } }
  ),
  base('Notch – Bottom Left', 'corner-notch-bl',
    { type:'notch', anchor:'bottom-left', color:'#ff6f61', sizeMm:32 },
    { palette:{ primary:'#8a1d1d', accent:'#ff6f61', paper:PAPER, text:TEXT } }
  ),
  base('Notch – Bottom Right','corner-notch-br',
    { type:'notch', anchor:'bottom-right',color:'#ff6f61', sizeMm:32 },
    { palette:{ primary:'#8a1d1d', accent:'#ff6f61', paper:PAPER, text:TEXT } }
  ),

  // RIBBON (2 couleurs)
  base('Ribbon – Top Left',    'corner-ribbon-tl',
    { type:'ribbon', anchor:'top-left',    color:'#ff9e1a', color2:'#162235', sizeMm:30 },
    { palette:{ primary:'#162235', accent:'#ff9e1a', paper:PAPER, text:TEXT } }
  ),
  base('Ribbon – Top Right',   'corner-ribbon-tr',
    { type:'ribbon', anchor:'top-right',   color:'#ff9e1a', color2:'#162235', sizeMm:30 },
    { palette:{ primary:'#162235', accent:'#ff9e1a', paper:PAPER, text:TEXT } }
  ),
  base('Ribbon – Bottom Left', 'corner-ribbon-bl',
    { type:'ribbon', anchor:'bottom-left', color:'#ff9e1a', color2:'#162235', sizeMm:30 },
    { palette:{ primary:'#162235', accent:'#ff9e1a', paper:PAPER, text:TEXT } }
  ),
  base('Ribbon – Bottom Right','corner-ribbon-br',
    { type:'ribbon', anchor:'bottom-right',color:'#ff9e1a', color2:'#162235', sizeMm:30 },
    { palette:{ primary:'#162235', accent:'#ff9e1a', paper:PAPER, text:TEXT } }
  ),

  // DUAL-SLOPE (2 couleurs)
  base('Dual-slope – Top Left',    'corner-dualslope-tl',
    { type:'dual-slope', anchor:'top-left',    color:'#b88b6a', color2:'#2f2f2f', sizeMm:32 },
    { palette:{ primary:'#2f2f2f', accent:'#b88b6a', paper:PAPER, text:TEXT } }
  ),
  base('Dual-slope – Top Right',   'corner-dualslope-tr',
    { type:'dual-slope', anchor:'top-right',   color:'#b88b6a', color2:'#2f2f2f', sizeMm:32 },
    { palette:{ primary:'#2f2f2f', accent:'#b88b6a', paper:PAPER, text:TEXT } }
  ),
  base('Dual-slope – Bottom Left', 'corner-dualslope-bl',
    { type:'dual-slope', anchor:'bottom-left', color:'#b88b6a', color2:'#2f2f2f', sizeMm:32 },
    { palette:{ primary:'#2f2f2f', accent:'#b88b6a', paper:PAPER, text:TEXT } }
  ),
  base('Dual-slope – Bottom Right','corner-dualslope-br',
    { type:'dual-slope', anchor:'bottom-right',color:'#b88b6a', color2:'#2f2f2f', sizeMm:32 },
    { palette:{ primary:'#2f2f2f', accent:'#b88b6a', paper:PAPER, text:TEXT } }
  ),
]
