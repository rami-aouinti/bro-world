<template>
  <v-card rounded="xl" max-width="500" class="mx-auto">
    <v-card-title class="text-h6 text-primary d-flex align-center justify-space-between px-6 py-4">
      Your signature
      <v-btn icon="mdi-close" size="small" variant="text" @click="closeModal" />
    </v-card-title>

    <v-card-text class="d-flex justify-center">
      <canvas ref="signatureCanvas" class="signature-canvas" width="450" height="200"></canvas>
    </v-card-text>

    <v-card-actions>
      <v-btn text color="error" @click="clearSignature">Clean</v-btn>
      <v-spacer />
      <v-btn color="default" variant="outlined" @click="closeModal">Close</v-btn>
      <v-btn color="primary" @click="saveSignature">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SignaturePad from 'signature_pad'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'signature', file: File): void   // ⬅️ on émet un File PNG
}>()

const signatureCanvas = ref<HTMLCanvasElement | null>(null)
let signaturePad: SignaturePad

onMounted(() => {
  if (signatureCanvas.value) {
    signaturePad = new SignaturePad(signatureCanvas.value, {
      backgroundColor: 'white',
      penColor: 'black',
    })
  }
})

function closeModal() {
  emit('update:modelValue', false)
}

function clearSignature() {
  signaturePad?.clear()
}

async function saveSignature() {
  if (!signaturePad || signaturePad.isEmpty()) {
    alert('Veuillez dessiner votre signature')
    return
  }

  // DataURL → Blob → File
  const dataURL = signaturePad.toDataURL('image/png')
  const blob = await fetch(dataURL).then(r => r.blob())
  const file = new File([blob], 'signature.png', { type: 'image/png' })

  emit('signature', file)  // ⬅️ on remonte le fichier au parent
  closeModal()
}
</script>

<style scoped>
.signature-canvas {
  border: 1px solid #ccc;
  border-radius: 4px;
  touch-action: none;
}
</style>
