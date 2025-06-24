<template>
  <div class="pa-4">
    <v-btn v-if="!stream" color="primary" @click="startCamera">
      {{ isRecording ? $t('Stop Recording') : $t('Create Video') }}
    </v-btn>
    <v-file-upload
      v-if="!stream"
      icon="mdi-upload"
      v-model="files"
      :title="$t('post.files')"
      multiple
      density="compact"
      variant="compact"
      show-size
      clearable
    />

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
      color="primary"
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

    <v-btn
      color="error"
      class="mt-4"
      prepend-icon="mdi-update"
      @click="handleAction"
    >
      Save
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'
const files = ref<File[]>([])
const stream = ref(null)
const mediaRecorder = ref(null)
const chunks = ref([])
const videoUrl = ref(null)
const videoRef = ref(null)
const isRecording = ref(false)
const handleAction = async () => {
  if (Array.isArray(files)) {
    files.forEach(file => {
      formData.append('files[]', file)
    })
  }
  const blob = new Blob(chunks.value, {type: 'video/webm'})
  videoUrl.value = URL.createObjectURL(blob)
  const formData = new FormData()
  formData.append('files[]', blob, 'video.webm')
  try {
    const {data, error} = await useFetch('/api/posts/post/posts', {
      method: 'POST',
      body: formData,
    })

  } catch (err) {
    Notify.error('error')
  }
  finally {
    Notify.success('success')
  }
}


const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
    }
  } catch (err) {
    Notify.error('Access is not possible')
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
