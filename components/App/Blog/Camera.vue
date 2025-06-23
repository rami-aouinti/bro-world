<template>
  <div class="pa-4">
    <v-btn color="primary" @click="startCamera">
      {{ isRecording ? $t('Stop Recording') : $t('Create Video') }}
    </v-btn>

    <div v-if="stream" class="mt-4">
      <video ref="videoRef" autoplay playsinline class="rounded-xl" width="640" height="410" />
    </div>

    <v-btn
      v-if="stream && !isRecording"
      color="success"
      class="mt-4"
      @click="startRecording"
    >
      🎥 {{ $t('Start Recording') }}
    </v-btn>

    <v-btn
      v-if="isRecording"
      color="error"
      class="mt-4"
      @click="stopRecording"
    >
      🛑 {{ $t('Stop Recording') }}
    </v-btn>

    <video
      v-if="videoUrl"
      controls
      class="mt-4 rounded-xl"
      width="640"
      height="410"
    >
      <source :src="videoUrl" type="video/webm" />
    </video>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'

const stream = ref(null)
const mediaRecorder = ref(null)
const chunks = ref([])
const videoUrl = ref(null)
const videoRef = ref(null)
const isRecording = ref(false)

const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
    }
  } catch (err) {
    alert('Accès à la caméra refusé ou non disponible')
    console.error(err)
  }
}

const startRecording = () => {
  if (!stream.value) return

  chunks.value = []
  mediaRecorder.value = new MediaRecorder(stream.value, {
    mimeType: 'video/webm',
  })

  mediaRecorder.value.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.value.push(e.data)
  }

  mediaRecorder.value.onstop = () => {
    const blob = new Blob(chunks.value, { type: 'video/webm' })
    videoUrl.value = URL.createObjectURL(blob)

    // TODO : upload to server via FormData if needed
    // const formData = new FormData()
    // formData.append('video', blob, 'video.webm')
    // await fetch('/api/upload', { method: 'POST', body: formData })
  }

  mediaRecorder.value.start()
  isRecording.value = true
}

const stopRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop()
    isRecording.value = false
  }
}

onBeforeUnmount(() => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop())
  }
})
</script>

<style scoped>
video {
  max-width: 100%;
}
</style>
