<script setup lang="ts">
import { ref } from 'vue'
import { truncate } from '~/utils/stringUtils'

const stories = ref<any[]>([])

const newStory = ref<File | null>(null)

const fileInput = ref()

const storyViewerVisible = ref(false)
const currentUserStories = ref<any[]>([])
const currentUsername = ref('')

async function loadStories() {
  try {
    const response = await $fetch('/api/profile/stories', {
      credentials: 'include',
    })
    stories.value = response.data.value || []
  } catch (e) {
    console.error('Failed to load stories', e)
  }
}

loadStories()

function triggerFileInput() {
  const input = fileInput.value?.$el?.querySelector('input[type="file"]')
  if (input) input.click()
}

function openStoryViewer(userStories: any) {
  currentUsername.value = userStories.username
  currentUserStories.value = userStories.stories
  storyViewerVisible.value = true
}

const uploadSuccess = ref(false)
const uploadError = ref(false)

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
      const userId = data.user.id || 'me'
      const existing = stories.value.find(s => s.userId === userId)

      const newStory = {
        id: data.id,
        mediaPath: data.mediaPath,
      }

      if (existing) {
        existing.stories.unshift(newStory)
      } else {
        stories.value.unshift({
          userId,
          username: data.user.username || 'Me',
          stories: [newStory],
        })
      }

      uploadSuccess.value = true
    }
  } catch (e) {
    console.error('Upload error', e)
    uploadError.value = true
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card
        rounded="xl"
        class="overflow-x-auto mx-3 min-h-stories"
        variant="text"
      >
        <div class="py-4 d-flex">
          <!-- Add Story Button -->
          <v-col
            lg="1"
            md="2"
            sm="3"
            cols="4"
            class="text-center"
            role="button"
            tabindex="0"
            aria-label="Add a story"
            @click="triggerFileInput"
            @keydown.enter="triggerFileInput"
            style="cursor: pointer"
          >
            <v-avatar size="58" class="shadow-sm">
              <v-icon class="material-icons-round">mdi-plus</v-icon>
            </v-avatar>
            <p class="mb-0 text-sm text-body font-weight-light mt-2">
              {{ truncate($t('AddStory'), 9) }}
            </p>
          </v-col>

          <!-- User Stories -->
          <v-col
            v-for="userStories in stories"
            :key="userStories.userId"
            lg="1"
            md="2"
            sm="3"
            cols="4"
            class="text-center"
          >
            <v-avatar
              @click="openStoryViewer(userStories)"
              role="button"
              tabindex="0"
              aria-label="Open story"
              style="cursor: pointer"
              size="58"
              class="border border-primary px-1 py-1"
            >
              <NuxtImg
                :alt="`story-${userStories.username}`"
                :src="userStories.stories[0]?.mediaPath"
                width="50"
                height="50"
                cover
              />
            </v-avatar>
            <NuxtLink :to="`/${userStories.username}`" class="text-decoration-none">
              <p class="mb-0 text-sm text-body font-weight-light mt-2">
                {{ truncate(userStories.username, 9) }}
              </p>
            </NuxtLink>
          </v-col>
        </div>

        <!-- Hidden File Input -->
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
      </v-card>
    </v-col>
  </v-row>

  <!-- Story Viewer -->
  <v-dialog v-model="storyViewerVisible" max-width="600">
    <v-card>
      <v-carousel height="500" hide-delimiter-background show-arrows>
        <v-carousel-item
          v-for="(story, index) in currentUserStories"
          :key="index"
        >
          <NuxtImg
            :alt="index"
            :src="story.mediaPath"
            width="100%"
            height="500"
            cover
          />
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-dialog>

  <!-- Upload Feedback -->
  <v-snackbar v-model="uploadSuccess" color="success" timeout="3000">
    Story uploaded successfully!
  </v-snackbar>
  <v-snackbar v-model="uploadError" color="error" timeout="3000">
    Failed to upload story.
  </v-snackbar>
</template>

