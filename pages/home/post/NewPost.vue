<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
import UserAvatar from '~/components/App/UserAvatar.vue'
import Camera from '~/components/App/Blog/Camera.vue'
import BaseDialog from '~/components/BaseDialog.vue'
import Editor from "~/components/App/Editor.vue";
const runtimeConfig = useRuntimeConfig()
const apiKey = runtimeConfig.public.tinyMceApiKey
const dialog = ref(false)
const dialogFile = ref(false)
const dialogText = ref(false)
const video = ref(false)
const loading = ref(false)
const loadingText = ref(false)
const files = ref<File[]>([])
const emit = defineEmits(['post-created'])
const postContent = ref('')
const youtubeId = ref<string | null>(null)
const imageUrl = ref<string | null>(null)
const fileInput = ref()
const newStory = ref<File | null>(null)

const { user } = await useUserSession()

function detectLinks() {
  if (youtubeId.value || imageUrl.value) return // Empêcher la redétection

  const ytRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
  const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/;

  const ytMatch = postContent.value.match(ytRegex)
  const imgMatch = postContent.value.match(imgRegex)

  if (ytMatch) {
    youtubeId.value = ytMatch[1]
    postContent.value = ''
  } else if (imgMatch) {
    imageUrl.value = imgMatch[1]
    postContent.value = ''
  }
}

function clearPreview() {
  youtubeId.value = null
  imageUrl.value = null
}

const formPayload = computed(() => {
  const payload: Record<string, any> = {}

  if (youtubeId.value) {
    payload.url = `https://www.youtube.com/watch?v=${youtubeId.value}`
  } else if (imageUrl.value) {
    payload.url = imageUrl.value
  }

  if (postContent.value.trim()) {
    payload.title = postContent.value.trim()
  }

  return payload
})


const handleSuccess = (data: any) => {
  data.title = postContent.value
  data.user = user.value
  postContent.value = ''
  imageUrl.value = null
  youtubeId.value = null
  Notify.success("Post created!")
  emit('post-created', data)
}

const handleError = (error: any) => {
  Notify.error("Post failed!")
  console.error('Failed:', error)
}

function triggerFileInput() {
  const input = fileInput.value?.$el?.querySelector('input[type="file"]')
  if (input) input.click()
}

async function handleFileUpload(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await $fetch('/api/profile/story', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    const data = response.data.value

    if (data?.mediaPath) {
      handleSuccess(data)
    }
  } catch (e) {
    console.error('Upload error', e)
    handleError(e)
  }
}


const handleAction = async () => {
  loadingText.value = true
  const formData = new FormData()
  if (postContent.value.trim()) {
    formData.append('title', postContent.value.trim())
  }
  try {
    const {data, error} = await useFetch('/api/posts/post/posts', {
      method: 'POST',
      body: formData,
    })

  } catch (err) {
    Notify.error('error')
  }
  finally {
    postContent.value = ''
    Notify.success("Post created!")
    dialogText.value = false
    emit('post-created')
  }
  loadingText.value = false
}


</script>

<template>
  <div class="py-3">
    <v-card rounded="xl" class="mx-3" variant="text" elevation="10">
      <v-card-text>
        <div class="d-flex align-center" style="max-width: 100%; flex-wrap: nowrap; overflow: hidden">
          <button class="btn-reset mx-2" @click="dialog = true" aria-label="User avatar" style="flex-shrink: 0">
            <UserAvatar :user="user" size="48" color="primary" />
          </button>
          <v-btn
            v-if="!dialogText"
            class="px-3 py-2 font-weight-bold justify-start"
            height="40"
            variant="tonal"
            @click="dialog = true"
            style="min-height: 48px; flex-grow: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap"
          >
            <span>Hello {{ user?.firstName }}, new post?</span>
          </v-btn>
          <v-card v-else rounded="xl" class="mx-3 w-100" variant="text">
            <div class="px-3 py-2 font-weight-bold justify-start" style="width: 100%; flex-wrap: nowrap; overflow: hidden">
              <Editor v-model="postContent" :api-key="apiKey" />
            </div>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                class="mt-4"
                prepend-icon="mdi-update"
                :loading="loadingText"
                @click="handleAction"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-card-text>

      <v-card-actions class="d-flex align-center text-center">
        <v-row>
          <v-col cols="6" md="3">
            <v-btn @click="video = true" :loading="loading" icon class="flex-grow-1" height="48">
              <v-icon class="mx-1" color="primary">mdi-video</v-icon>
              Video
            </v-btn>
          </v-col>
          <v-col cols="6" md="3">
            <v-btn @click="dialogText = !dialogText" icon class="flex-grow-1" height="48">
              <v-icon class="mx-1" color="primary">mdi-file-word-box</v-icon>
              Text
            </v-btn>
          </v-col>
          <v-col cols="6" md="3">
            <v-btn @click="dialogFile = true" :loading="loading" icon class="flex-grow-1" height="48">
              <v-icon class="mx-1" color="primary">mdi-image-multiple</v-icon>
              Photo
            </v-btn>
          </v-col>
          <v-col cols="6" md="3">
            <v-btn icon :loading="loading" class="flex-grow-1" height="48"
                   @click="triggerFileInput"
                   @keydown.enter="triggerFileInput">
              <v-icon class="mx-1" color="primary">mdi-camera-enhance</v-icon>
              Story
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <!-- Upload d’un fichier story -->
    <v-file-input
      ref="fileInput"
      v-model="newStory"
      label="Upload Story"
      outlined
      required
      show-size
      v-show="false"
      @update:modelValue="handleFileUpload"
    />

    <!-- BaseDialog pour création de post -->
    <BaseDialog
      v-model="dialogFile"
      title="New Post"
      color="primary"
      :closeButton="[{ text: 'Cancel', color: 'grey', action: () => (dialog = false) }]"
      :saveButton="[{ text: 'Save', color: 'primary', action: '/api/posts/post/posts' }]"
      :files="files"
      :forms="formPayload"
      @success="handleSuccess"
      @error="handleError"
    >
      <v-card rounded="xl">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="postContent"
                label="Post Title"
                variant="outlined"
                rounded
                outlined
                required
                @input="detectLinks"
              />

              <!-- Aperçu YouTube -->
              <div v-if="youtubeId" class="my-4 text-center">
                <div class="d-flex justify-end">
                  <v-btn icon @click="clearPreview" variant="text" size="small">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
                <iframe
                  :src="`https://www.youtube.com/embed/${youtubeId}`"
                  width="560"
                  height="315"
                  frameborder="0"
                  allowfullscreen
                  style="max-width: 100%"
                ></iframe>
              </div>

              <!-- Aperçu Image -->
              <div v-if="imageUrl" class="my-4 text-center">
                <div class="d-flex justify-end">
                  <v-btn icon @click="clearPreview" variant="text" size="small">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
                <img :src="imageUrl" alt="preview" style="max-width: 100%; max-height: 300px" />
              </div>
            </v-col>
            <v-col cols="12">
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
            </v-col>
          </v-row>
          <small class="text-grey">* This doesn't actually save.</small>
        </v-card-text>
      </v-card>
    </BaseDialog>
    <BaseDialog
      v-model="dialog"
      title="New Post"
      color="primary"
      :closeButton="[{ text: 'Cancel', color: 'grey', action: () => (dialog = false) }]"
      :saveButton="[{ text: 'Save', color: 'primary', action: '/api/posts/post/posts' }]"
      :files="files"
      :forms="formPayload"
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

          <!-- Aperçu YouTube -->
          <div v-if="youtubeId" class="my-4 text-center">
            <div class="d-flex justify-end">
              <v-btn icon @click="clearPreview" variant="text" size="small">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <iframe
              :src="`https://www.youtube.com/embed/${youtubeId}`"
              width="560"
              height="315"
              frameborder="0"
              allowfullscreen
              style="max-width: 100%"
            ></iframe>
          </div>

          <!-- Aperçu Image -->
          <div v-if="imageUrl" class="my-4 text-center">
            <div class="d-flex justify-end">
              <v-btn icon @click="clearPreview" variant="text" size="small">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <img :src="imageUrl" alt="preview" style="max-width: 100%; max-height: 300px" />
          </div>
        </v-card-text>
      </v-card>
    </BaseDialog>

    <!-- Caméra vidéo -->
    <v-dialog v-model="video" max-width="500">
      <v-card rounded="xl">
        <Camera />
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.btn-reset {
  all: unset;
  cursor: pointer;
}
</style>
