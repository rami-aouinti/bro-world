<script setup lang="ts">
import { ref } from 'vue'

const stories = ref<any[]>([])

const newStory = ref<File | null>(null)

const fileInput = ref()

const storyViewerVisible = ref(false)
const currentUserStories = ref<any[]>([])
const currentUsername = ref('')

async function loadStories() {
  try {
    const response = await useFetch('/api/profile/stories')
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

async function handleFileUpload(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await useFetch('/api/profile/story', {
      method: 'POST',
      body: formData,
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
    }
  } catch (e) {
    console.error('Upload error', e)
  }
}

function openStoryViewer(userStories: any) {
  currentUsername.value = userStories.username
  currentUserStories.value = userStories.stories
  storyViewerVisible.value = true
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-card rounded="xl" class="overflow-scroll mx-3" variant="text">
        <div class="py-4 d-flex">
          <v-col
            lg="1"
            md="2"
            sm="3"
            cols="4"
            class="text-center"
            @click="triggerFileInput"
            style="cursor: pointer"
          >
            <v-avatar size="58" class="shadow-sm">
              <v-icon class="material-icons-round">mdi-plus</v-icon>
            </v-avatar>
            <p class="mb-0 text-sm text-body font-weight-light mt-2">
              {{ $t('AddStory') }}
            </p>
          </v-col>

          <v-col
            v-for="userStories in stories"
            :key="userStories.userId"
            lg="1"
            md="2"
            sm="3"
            cols="4"
            class="text-center"
            @click="openStoryViewer(userStories)"
            style="cursor: pointer"
          >
            <v-avatar size="58" class="border border-primary px-1 py-1">
              <v-img
                :src="userStories.stories[0]?.mediaPath"
                width="50"
                height="50"
              />
            </v-avatar>
            <p class="mb-0 text-sm text-body font-weight-light mt-2">
              {{ userStories.username }}
            </p>
          </v-col>
        </div>

        <v-file-input
          ref="fileInput"
          v-model="newStory"
          label="Upload Story"
          outlined
          required
          accept="image/*"
          show-size
          style="display: none"
          @update:modelValue="handleFileUpload"
        />
      </v-card>
    </v-col>
  </v-row>

  <v-dialog v-model="storyViewerVisible" max-width="600">
    <v-card>
      <v-carousel height="500" hide-delimiter-background show-arrows>
        <v-carousel-item
          v-for="(story, index) in currentUserStories"
          :key="index"
        >
          <v-img
            :src="story.mediaPath"
            class="h-100"
            cover
          />
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-dialog>
</template>
