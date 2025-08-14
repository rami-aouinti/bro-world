import { reactive } from 'vue'
import { COVER_PRESETS, applyCoverPreset } from '@/data/coverLetterPresets'

/* Data URI placeholders */
const placeholderPhoto = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400">
  <rect width="100%" height="100%" fill="#eeeeee"/>
  <g stroke="#bbbbbb" stroke-width="2">
    <line x1="0" y1="0" x2="300" y2="400"/>
    <line x1="300" y1="0" x2="0" y2="400"/>
    <rect x="10" y="10" width="280" height="380" fill="none" stroke-dasharray="6 6"/>
  </g>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#888" font-size="20">Photo</text>
</svg>
`)
const placeholderSignature = `data:image/svg+xml;utf8,` + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="140">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <path d="M20 90 C 120 10, 220 170, 320 60 S 480 120, 480 70" fill="none" stroke="#aaaaaa" stroke-width="3"/>
</svg>
`)

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function useCoverLetterModel() {
  const ui = reactive({
    fontFamily: 'Inter',
    fontSize: '14px',
    accent: '#cf4f4f',
    exporting: false,

    /* fichiers */
    photoFile: null as File | null,
    signatureFile: null as File | null,

    /* ✅ sources d’images (toujours des strings) */
    photoSrc: placeholderPhoto,
    signatureSrc: placeholderSignature,

    /* ✅ options de la photo (toujours un objet) */
    photo: {
      show: true,
      position: 'right' as 'right' | 'left' | 'top',
      shape: 'square' as 'square' | 'circle',
      widthMm: 38,
      heightMm: 48,
      variant: 'guidelines' as 'plain' | 'frame' | 'guidelines' | 'elevated' | 'elevated-frame',

      // bordure
      borderStyle: 'none' as 'none' | 'solid' | 'dashed' | 'dotted',
      borderWidthPx: 0,
      borderColor: '#000000',
    },

    /* ✅ coin */
    corner: {
      enabled: true,
      type: 'quarter' as 'quarter' | 'diagonal' | 'notch' | 'ribbon' | 'dual-slope' | 'none',
      anchor: 'top-left' as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
      sizeMm: 32,
      color: '#2b2b2b',
      color2: '',
    },
  })

  /* modèle lettre */
  const model = reactive({
    sender: { name: 'Prénom Nom', address: 'Adresse', city: '75000 Paris', contact: '' },
    recipient: 'Entreprise SA\nService Recrutement\n1 rue Exemple\n75001 Paris',
    contact: { phone: '06 00 00 00 00', email: 'prenom.nom@email.com' },
    meta: { date: new Date().toLocaleDateString('fr-FR'), title: 'CANDIDATURE – CHEF DE PROJET' },
    sections: [
      'Madame, Monsieur,',
      'Actuellement … je souhaite rejoindre votre équipe …',
      'Au cours de mes expériences …',
      'Disponible rapidement, …',
      'Dans l’attente de votre retour, …',
    ],
    signature: { farewell: 'Cordialement,', name: 'Prénom Nom' },
  })

  function applyPreset(p: any) {
    applyCoverPreset(ui, p)
  }

  function onEditable(e: Event, path: string) {
    const text = (e.target as HTMLElement).innerText
    const segs = path.split('.')
    let cur: any = model
    for (let i = 0; i < segs.length - 1; i++) cur = cur[segs[i]]
    cur[segs[segs.length - 1]] = text
  }

  async function onPhotoUpload(files: File | File[] | null) {
    const f = Array.isArray(files) ? files[0] : files
    if (!f) return
    ui.photoSrc = await readFile(f as File) // ✅ chaîne pour <PhotoFrame :src>
  }

  async function onSignatureUpload(files: File | File[] | null) {
    const f = Array.isArray(files) ? files[0] : files
    if (!f) return
    ui.signatureSrc = await readFile(f as File) // ✅ chaîne pour <img :src>
  }

  if (Array.isArray(COVER_PRESETS) && COVER_PRESETS.length) {
    applyPreset(COVER_PRESETS[0])
  }

  return { model, ui, applyPreset, onEditable, onPhotoUpload, onSignatureUpload }
}
