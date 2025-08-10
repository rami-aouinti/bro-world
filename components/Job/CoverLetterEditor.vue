<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="pa-2">
          <v-list
            class="custom-list"
            nav
            :lines="false"
          >
            <MotionGroup preset="slideVisibleLeft" :duration="600">
              <v-list-item
                class="custom-item pa-3"
                color="primary"
              >
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn v-bind="props" variant="tonal" prepend-icon="mdi-format-font">Schrift & Farbe anpassen</v-btn>
                  </template>
                  <v-card class="pa-3" width="340">
                    <div class="d-flex gap-2 align-center">
                      <v-select
                        v-model="ui.fontFamily"
                        :items="fonts"
                        label="Schriftart"
                        density="compact"
                      />
                      <v-select
                        v-model="ui.fontSize"
                        :items="fontSizes"
                        label="Größe"
                        density="compact"
                      />
                    </div>
                    <div class="mt-2">
                      <div class="text-caption mb-1">Akzentfarbe</div>
                      <v-color-picker v-model="ui.accent" hide-inputs mode="hex" elevation="0" width="320"/>
                    </div>
                  </v-card>
                </v-menu>
              </v-list-item>
              <v-list-item
                class="custom-item pa-3"
                color="primary"
              >
                <v-file-input
                  v-model="ui.photoFile"
                  accept="image/*"
                  hide-details
                  prepend-icon="mdi-camera"
                  density="comfortable"
                  style="max-width: 260px"
                  label="Foto hinzufügen"
                  @update:model-value="onPhotoUpload"
                />
              </v-list-item>
              <v-list-item
                class="custom-item pa-3"
                color="primary"
              >

                <v-file-input
                  v-model="ui.signatureFile"
                  accept="image/*"
                  hide-details
                  prepend-icon="mdi-draw"
                  density="comfortable"
                  style="max-width: 280px"
                  label="Unterschrift hinzufügen"
                  @update:model-value="onSignatureUpload"
                />
              </v-list-item>
              <v-list-item
                class="custom-item pa-3"
                color="primary"
              >
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn v-bind="props" variant="tonal" prepend-icon="mdi-view-dashboard-edit">Vorlage wechseln</v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="preset in presets" :key="preset.key" @click="applyPreset(preset)">
                      <v-list-item-title>{{ preset.label }}</v-list-item-title>
                      <v-list-item-subtitle class="text-caption">{{ preset.description }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item>
              <v-list-item
                class="custom-item pa-3"
                color="primary"
              >
                <v-btn color="primary" prepend-icon="mdi-download" @click="exportPdf" :loading="ui.exporting">
                  PDF herunterladen
                </v-btn>

              </v-list-item>
            </MotionGroup>
          </v-list>
        </div>
      </teleport>
    </client-only>
    <v-row>
      <v-col cols="12">
        <!-- Letter Canvas -->
        <v-card elevation="2" class="pa-0 letter-wrapper">
          <div ref="pdfTarget" class="letter a4" :style="letterStyle">
            <!-- Accent corner -->
            <div class="accent-corner" :style="accentStyle" />

            <div class="letter-content">
              <!-- Header: Sender block -->
              <div class="header">
                <div class="sender">
                  <div class="sender-name" contenteditable @input="onEditable($event, 'sender.name')">{{ model.sender.name }}</div>
                  <div contenteditable class="muted" @input="onEditable($event, 'sender.address')">{{ model.sender.address }}</div>
                  <div contenteditable class="muted" @input="onEditable($event, 'sender.city')">{{ model.sender.city }}</div>
                  <div contenteditable class="muted" @input="onEditable($event, 'sender.contact')">{{ model.sender.contact }}</div>
                </div>
                <div class="photo" v-if="ui.photo">
                  <img :src="ui.photo" alt="Applicant photo" />
                </div>
              </div>

              <!-- Recipient block -->
              <div class="recipient editable-block" contenteditable @input="onEditable($event, 'recipient')">
                {{ model.recipient }}
              </div>

              <!-- Contact lines -->
              <div class="contact">
                <div class="line" contenteditable @input="onEditable($event, 'contact.phone')">Telefon: {{ model.contact.phone }}</div>
                <div class="line" contenteditable @input="onEditable($event, 'contact.email')">E-Mail: {{ model.contact.email }}</div>
              </div>

              <!-- Date -->
              <div class="date" contenteditable @input="onEditable($event, 'meta.date')">{{ model.meta.date }}</div>

              <!-- Title -->
              <div class="title editable-block" contenteditable @input="onEditable($event, 'meta.title')">
                {{ model.meta.title }}
              </div>

              <!-- Body paragraphs -->
              <div class="body">
                <p
                  v-for="(p, i) in model.body"
                  :key="i"
                  class="paragraph editable-block"
                  contenteditable
                  @input="onEditable($event, `body.${i}`)"
                >{{ p }}</p>
              </div>

              <!-- Signature -->
              <div class="signature-block">
                <div class="farewell editable-block" contenteditable @input="onEditable($event, 'signature.farewell')">{{ model.signature.farewell }}</div>
                <div class="sign-row">
                  <img v-if="ui.signature" class="signature" :src="ui.signature" alt="signature"/>
                </div>
                <div class="name editable-block" contenteditable @input="onEditable($event, 'signature.name')">{{ model.signature.name }}</div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
const canTeleport = ref(false)
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
/** FONTS & UI **/
const fonts = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Merriweather', 'Georgia', 'Times New Roman'
]
const fontSizes = ['12px', '13px', '14px', '15px', '16px', '18px']

const ui = reactive({
  fontFamily: 'Inter',
  fontSize: '14px',
  accent: '#cf4f4f',
  photoFile: null as File | null,
  signatureFile: null as File | null,
  photo: '' as string,
  signature: '' as string,
  exporting: false
})

/** MODEL **/
const model = reactive({
  sender: {
    name: 'Vorname Nachname',
    address: 'Hauptstraße 11',
    city: '10411 Berlin',
    contact: ''
  },
  recipient: 'Die Firma GmbH\nz.H. Personalabteilung\nGewerbestraße 11\nD-10166 Berlin',
  contact: { phone: '0176/123456789', email: 'vorname@nachname.de' },
  meta: { date: new Date().toLocaleDateString('de-DE'), title: 'BEWERBUNG ALS PROJEKTLEITER' },
  body: [
    "Sehr geehrte Damen und Herren,",
    "suchen Sie einen kompetenten, motivierten Projektmanager mit Erfahrung in der Leitung und Durchführung anspruchsvoller und komplexer Projekte? Sie suchen nach einem Mitarbeiter, der Problemen nicht aus dem Weg geht, sondern sie löst? Dann ist meine Bewerbung sicher von Interesse für Sie.",
    "Durch meine Ausbildung und auch während meines Studiums an der Universität Musterstadt sammelte ich Erfahrung durch diverse Praktika. Nach dem sehr erfolgreichen Abschluss als Bürokaufmann stieg ich bei der Erste Beispiel GmbH als Junior Projektmanager ein (...)",
    "Gerne möchte ich meine persönlichen Fähigkeiten und Erfahrungen in Ihr Unternehmen einbringen. Meine Gehaltsvorstellungen liegen bei 60.000 € im Jahr und ich stehe Ihnen ab sofort zur Verfügung.",
    "Ich freue mich sehr auf ein persönliches Vorstellungsgespräch."
  ],
  signature: { farewell: "Mit freundlichen Grüßen",
    name: "Vorname Nachname" }
})

/** PRESETS **/
const presets = [
  { key: 'classic', label: 'Klassisch', description: 'Serifen-Schrift, roter Akzent', apply: () => {
      ui.fontFamily = 'Georgia'; ui.accent = '#c43d3d'; ui.fontSize = '14px'
    }},
  { key: 'modern', label: 'Modern', description: 'Sans Serif, blau', apply: () => {
      ui.fontFamily = 'Inter'; ui.accent = '#2f6ec4'; ui.fontSize = '15px'
    }},
  { key: 'clean', label: 'Clean', description: 'Roboto, grau', apply: () => {
      ui.fontFamily = 'Roboto'; ui.accent = '#999999'; ui.fontSize = '14px'
    }}
]

function applyPreset(preset: any){
  preset.apply()
}

/** STYLE COMPUTEDS **/
const letterStyle = computed(() => ({
  fontFamily: ui.fontFamily,
  fontSize: ui.fontSize
}))
const accentStyle = computed(() => ({
  borderBottomColor: ui.accent
}))

/** CONTENTEDITABLE HANDLER **/
function onEditable(e: Event, path: string){
  const text = (e.target as HTMLElement).innerText
  setByPath(model as any, path, text)
}

function setByPath(obj: any, path: string, value: any){
  const segs = path.split('.')
  let cur = obj
  for(let i=0;i<segs.length-1;i++) cur = cur[segs[i]]
  cur[segs[segs.length-1]] = value
}

/** UPLOADS **/
function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject)=>{
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
async function onPhotoUpload(files: File | File[] | null){
  const f = Array.isArray(files) ? files[0] : files
  if(!f) return
  ui.photo = await readFile(f as File)
}
async function onSignatureUpload(files: File | File[] | null){
  const f = Array.isArray(files) ? files[0] : files
  if(!f) return
  ui.signature = await readFile(f as File)
}

/** EXPORT TO PDF **/
const pdfTarget = ref<HTMLElement | null>(null)
async function exportPdf(){
  if(!pdfTarget.value) return
  ui.exporting = true
  try {
    const html2pdf = (await import('html2pdf.js')).default
    const opt = {
      margin:       0,
      filename:     'Bewerbung.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    await html2pdf().set(opt).from(pdfTarget.value).save()
  } finally {
    ui.exporting = false
  }
}

onMounted(async () => {
  window.scrollTo({top: 0})
  await nextTick()
  canTeleport.value = !!document.getElementById('menu-bar-world')
})
</script>

<style scoped>
.custom-list {
  background-color: transparent;
}

.custom-item {
  transition: all 0.2s ease;
  border-radius: 12px;
  padding-left: 12px;
  margin-bottom: 4px;
}
/***** Canvas sizing *****/
.letter-wrapper{ background: #eee; }
.letter{
  width: 210mm; /* A4 */
  min-height: 297mm;
  margin: 16px auto;
  background: white;
  position: relative;
}
.a4{ box-shadow: 0 2px 10px rgba(0,0,0,.08); }

.letter-content{ padding: 28mm 20mm 25mm 20mm; position: relative; }

/* Accent corner like the screenshot */
.accent-corner{
  position: absolute; left: 0; top: 0; width: 0; height: 0;
  border-top: 32mm solid #2b2b2b; /* dark triangle */
  border-right: 32mm solid transparent;
}
.accent-corner::after{
  content:''; position:absolute; left:0; top:0; width:0; height:0;
  border-top: 24mm solid transparent;
  border-right: 24mm solid transparent;
  border-bottom: 24mm solid var(--v-theme-surface); /* cutout */
  transform: translate(8mm, 8mm);
}
.accent-corner{ border-bottom: 32mm solid var(--accent, #cf4f4f); }

/* Header */
.header{ display:flex; justify-content: space-between; gap: 16px; }
.sender{ max-width: 70%; }
.sender-name{ font-weight: 600; }
.photo img{ width: 38mm; height: 48mm; object-fit: cover; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,.15); }

/* Recipient and blocks */
.recipient{ margin-top: 22mm; border-left: 3px solid var(--accent, #cf4f4f); padding: 6mm; white-space: pre-line; }
.contact{ margin: 12mm 0 4mm; display: grid; grid-template-columns: 1fr; gap: 2mm; }
.date{ text-align: right; margin: 6mm 0; }
.title{ font-weight: 700; letter-spacing: .5px; text-transform: uppercase; border-bottom: 3px solid var(--accent, #cf4f4f); padding-bottom: 2mm; margin-bottom: 6mm; }
.body{ line-height: 1.6; }
.paragraph{ margin: 0 0 5mm; }
.signature-block{ margin-top: 12mm; }
.signature{ max-height: 18mm; display:block; }
.farewell{ margin-bottom: 6mm; }
.name{ font-weight: 600; }

/* Editable styling */
[contenteditable]{ outline: none; }
.editable-block{ position: relative; }
.editable-block:focus{ box-shadow: inset 0 0 0 2px rgba(0,0,0,.2); border-radius: 4px; }
.muted{ color: #555; }

/* Theming via CSS var */
.letter{ --accent: v-bind('ui.accent'); }
</style>

<!--
USAGE (Nuxt 3):
1) Install Vuetify 3 and html2pdf.js
2) Drop this file into components/CoverLetterEditor.vue
3) Use it in a page: <CoverLetterEditor />
This component renders an editable A4 letter with toolbars (font/color, photo/signature, template switch, PDF export).
-->
