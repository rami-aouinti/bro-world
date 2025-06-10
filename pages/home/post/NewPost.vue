<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import UserAvatar from '~/components/App/UserAvatar.vue'
import BaseDialog from '~/components/BaseDialog.vue'

const dialog = ref(false)
const loading = ref(false)
const files = ref<File[]>([])
const emit = defineEmits(['post-created'])
const showDialog = ref(false)
const postContent = ref('')
const youtubeId = ref(null)
const imageUrl = ref(null)

const newStory = ref<File | null>(null)

const fileInput = ref()

function detectLinks() {
  const ytRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
  const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/;

  const ytMatch = postContent.value.match(ytRegex);
  const imgMatch = postContent.value.match(imgRegex);

  youtubeId.value = ytMatch ? ytMatch[1] : null
  imageUrl.value = imgMatch ? imgMatch[1] : null
}


const { user } = useUserSession()

const load = () => {
  loading.value = true
  setTimeout(() => (loading.value = false), 3000)
}

const handleSuccess = (data) => {
  postContent.value = ''
  Notify.success("Post created!")
  emit('post-created', data)
}

async function handleFileUpload(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await useFetch('/api/profile/story', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    const data = response.data.value

    if (data?.mediaPath) {
      const userId = data.user.id || 'me'

      handleSuccess(data)
    }
  } catch (e) {
    console.error('Upload error', e)
    handleError(e)
  }
}

const handleError = (error) => {
  Notify.error("Post failed!")
  console.error('Failed:', error)
}

function triggerFileInput() {
  const input = fileInput.value?.$el?.querySelector('input[type="file"]')
  if (input) input.click()
}
</script>

<template>
  <div class="py-3">
    <v-card rounded="xl" class="mx-3" variant="text">
      <v-card-text>
        <div
          class="d-flex align-center"
          style="max-width: 100%; flex-wrap: nowrap; overflow: hidden"
        >
          <button
            class="btn-reset mx-2"
            @click="dialog = true"
            aria-label="User avatar"
            style="flex-shrink: 0"
          >
            <UserAvatar :user="user" size="48" color="primary" />
          </button>

          <v-btn
            class="px-3 py-2 font-weight-bold justify-start"
            height="40"
            variant="tonal"
            @click="dialog = true"
            style="min-height: 48px; flex-grow: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap"
          >
            <span>Hello {{ user?.firstName }}, new post?</span>
          </v-btn>
        </div>
      </v-card-text>
      <hr class="horizontal dark my-2" />
      <v-card-actions>
        <v-btn :loading="loading" icon class="flex-grow-1" height="48" @click="load">
          <v-icon class="mx-1" color="primary">mdi-video</v-icon>
          Video
        </v-btn>
        <v-btn :loading="loading" icon class="flex-grow-1" height="48" @click="load">
          <v-icon class="mx-1" color="primary">mdi-image-multiple</v-icon>
          Photo
        </v-btn>
        <v-btn icon :loading="loading" class="flex-grow-1" height="48"
               @click="triggerFileInput"
               @keydown.enter="triggerFileInput">
          <v-icon class="mx-1" color="primary">mdi-camera-enhance</v-icon>
          Story
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-file-input
      ref="fileInput"
      v-model="newStory"
      label="Upload Story"
      outlined
      required
      accept="image/*"
      show-size
      v-show="false"
      @update:modelValue="handleFileUpload"
    />
    <BaseDialog
      v-model="dialog"
      title="New Post"
      color="primary"
      :closeButton="[{ text: 'Cancel', color: 'grey', action: () => (dialog = false) }]"
      :saveButton="[{ text: 'Save', color: 'primary', action: '/api/posts/post/posts' }]"
      :files="files"
      :forms="postContent"
      @success="handleSuccess"
      @error="handleError"
    >
      <v-card rounded="xl">
        <v-card-text>
          <v-text-field
            v-model="postContent"
            label="Post Title"
            variant="outlined"
            rounded
            outlined
            required
            @input="detectLinks"
          />
          <div v-if="youtubeId" class="my-4 text-center">
            <iframe
              :src="`https://www.youtube.com/embed/${youtubeId}`"
              width="560"
              height="315"
              frameborder="0"
              allowfullscreen
              style="max-width: 100%"
            ></iframe>
          </div>
          <div v-if="imageUrl" class="my-4 text-center">
            <img :src="imageUrl" alt="preview" style="max-width: 100%; max-height: 300px" />
          </div>
          <v-file-upload
            icon="mdi-upload"
            v-model="files"
            :title="$t('post.files')"
            multiple
            density="compact"
            variant="compact"
            show-size
            clearable
          />
          <small class="text-grey">* This doesn't actually save.</small>
        </v-card-text>
      </v-card>
    </BaseDialog>
  </div>
</template>

<style scoped>
.btn-reset {
  all: unset;
  cursor: pointer;
}
</style>
