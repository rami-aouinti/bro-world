<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import UserAvatar from '~/components/App/UserAvatar.vue'
import Editor from '~/components/App/Editor.vue'
import BaseDialog from '~/components/BaseDialog.vue'
import Camera from '~/components/App/Blog/Camera.vue'
import { useStoryStore } from '~/stores/useStoryStore'

const dialog = ref(false)
const dialogFile = ref(false)
const dialogText = ref(false)
const video = ref(false)
const loadingText = ref(false)
const files = ref<File[]>([])
const postContent = ref('')
const youtubeId = ref<string | null>(null)
const imageUrl = ref<string | null>(null)
const newStory = ref<File | null>(null)
const emit = defineEmits(['post-created', 'story-created'])

const storyStore = useStoryStore()

const { user } = await useUserSession()

function detectLinks() {
  if (youtubeId.value || imageUrl.value) return

  const ytRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/
  const imgRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/

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

async function handleAction() {
  loadingText.value = true
  const formData = new FormData()
  formData.append('content', postContent.value)
  try {
    const { data } = await $fetch('/api/posts/post/posts', {
      method: 'POST',
      body: formData,
    })
    if (data) {
      Notify.success("Post created!", user.photo ?? "https://bro-world-space.com", "/post/" + data.slug)
      emit('post-created', data)
      postContent.value = ''
      clearPreview()
      dialogText.value = false
    }
  } catch (err) {
    Notify.error("Post failed!")
    console.error(err)
  } finally {
    loadingText.value = false
  }
}

async function handleFileUpload(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const data = await storyStore.createStory(user.value.id, formData)
    if (data?.mediaPath) {
      emit('story-created', data)
    }
  } catch (e) {
    Notify.error("Upload failed!")
    console.error(e)
  }
}

function triggerFileInput() {
  const input = document.querySelector('input[type="file"]')
  input?.click()
}
</script>

<template>
  <div class="py-2">
  <v-card
    rounded="xl"
    class="bg-gradient-primary shadow-primary mx-3"
    variant="text"
    elevation="10"
  >
    <div class="bg-gradient-primary shadow-primary px-4 py-2">
      <v-card-text>
        <div class="d-flex align-center" style="max-width: 100%; flex-wrap: nowrap; overflow: hidden;">
          <button class="btn-reset mx-2" @click="dialog = true" aria-label="User avatar" style="flex-shrink: 0">
            <UserAvatar :user="user" size="38" color="primary" />
          </button>
          <v-btn
            v-if="!dialogText"
            class="px-3 py-2 font-weight-bold justify-start"
            height="40"
            variant="tonal"
            @click="dialog = true"
            style="min-height: 48px; flex-grow: 1; text-overflow: ellipsis; overflow: hidden; max-width: 100%; white-space: nowrap"
          >
            <span>Hello {{ user?.firstName }}, new post?</span>
          </v-btn>
          <v-card
            v-else
            rounded="xl"
            class="mx-3 w-100"
            variant="text"
            style="overflow: hidden; transition: max-height 0.3s ease;"
          >
            <v-card-text>
              <Editor v-model="postContent" :api-key="''" />
            </v-card-text>
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
            <v-btn @click="video = true" icon class="flex-grow-1" height="48">
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
            <v-btn @click="dialogFile = true" icon class="flex-grow-1" height="48">
              <v-icon class="mx-1" color="primary">mdi-image-multiple</v-icon>
              Photo
            </v-btn>
          </v-col>
          <v-col cols="6" md="3">
            <v-btn icon class="flex-grow-1" height="48" @click="triggerFileInput" @keydown.enter="triggerFileInput">
              <v-icon class="mx-1" color="primary">mdi-camera-enhance</v-icon>
              Story
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </div>
  </v-card>
  </div>
  <v-file-input
    v-model="newStory"
    label="Upload Story"
    outlined
    required
    show-size
    style="display: none"
    @update:modelValue="handleFileUpload"
  />

  <BaseDialog
    v-model="dialogFile"
    title="New Post"
    color="primary"
    :closeButton="[{ text: 'Cancel', action: 'close' }]"
    :saveButton="[{ text: 'Send', action: '/api/posts/post/posts' }]"
    :files="files"
    :forms="formPayload"
    @success="(post) => emit('post-created', post)"
    @error="Notify.error('Error creating post')"
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

            <div v-if="youtubeId" class="my-4 text-center">
              <v-btn icon @click="clearPreview" variant="text" size="small">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <iframe
                :src="`https://www.youtube.com/embed/${youtubeId}`"
                width="560"
                height="315"
                frameborder="0"
                allowfullscreen
                style="max-width: 100%"
              />
            </div>

            <div v-if="imageUrl" class="my-4 text-center">
              <v-btn icon @click="clearPreview" variant="text" size="small">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <NuxtImg :src="imageUrl" alt="preview" format="webp" loading="lazy" cover style="max-width: 100%; max-height: 300px" />
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
    :closeButton="[{ text: 'Cancel', action: 'close' }]"
    :saveButton="[{ text: 'Send', action: '/api/posts/post/posts' }]"
    :files="files"
    :forms="formPayload"
    @success="(post) => emit('post-created', post)"
    @error="Notify.error('Error creating post')"
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
          <v-btn icon @click="clearPreview" variant="text" size="small">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <iframe
            :src="`https://www.youtube.com/embed/${youtubeId}`"
            width="560"
            height="315"
            frameborder="0"
            allowfullscreen
            style="max-width: 100%"
          />
        </div>

        <div v-if="imageUrl" class="my-4 text-center">
          <v-btn icon @click="clearPreview" variant="text" size="small">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <NuxtImg :src="imageUrl" alt="preview" format="webp" loading="lazy" cover style="max-width: 100%; max-height: 300px" />
        </div>
      </v-card-text>
    </v-card>
  </BaseDialog>

  <v-dialog v-model="video" max-width="500">
    <v-card rounded="xl">
      <Camera />
    </v-card>
  </v-dialog>

</template>

<style scoped>
.btn-reset {
  all: unset;
  cursor: pointer;
}
</style>
