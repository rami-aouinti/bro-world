<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useIntervalFn } from '@vueuse/core'

const { user } = await useUserSession()
const stories = ref<any[]>([])

const storyViewerVisible = ref(false)
const currentUserStories = ref<any[]>([])
const currentUsername = ref('')
const currentStoryIndex = ref(0)
const progress = ref(0)
const message = ref('')

const intervalDelay = 5000 // 5 secondes
let progressTimer: ReturnType<typeof setInterval> | null = null

const { pause, resume } = useIntervalFn(() => {
  goToNextStory()
}, intervalDelay, { immediate: false })

function goToNextStory() {
  if (currentStoryIndex.value < currentUserStories.value.length - 1) {
    currentStoryIndex.value++
    resetProgress()
  } else {
    closeStoryViewer()
  }
}

function goToPreviousStory() {
  if (currentStoryIndex.value > 0) {
    currentStoryIndex.value--
    resetProgress()
  }
}

function resetProgress() {
  progress.value = 0
  if (progressTimer) clearInterval(progressTimer)
  progressTimer = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 2
    }
  }, intervalDelay / 50) // 50 steps
}

async function loadStories() {
  try {
    const response = await useFetch('/api/profile/stories')
    stories.value = response?.data.value || []
  } catch (e) {
    console.error('Failed to load stories', e)
  }
}

watch(!stories.value , (val) => {
  loadStories()
}, { immediate: true })

onMounted(loadStories)
onBeforeUnmount(() => {
  pause()
  if (progressTimer) clearInterval(progressTimer)
})

function openStoryViewer(userStories: any) {
  currentUsername.value = userStories.username
  currentUserStories.value = userStories.stories
  currentStoryIndex.value = 0
  progress.value = 0
  storyViewerVisible.value = true

  nextTick(() => {
    resume()
    resetProgress()
  })
}

function closeStoryViewer() {
  storyViewerVisible.value = false
  pause()
  if (progressTimer) clearInterval(progressTimer)
}

// 🧡 Réaction
function sendHeart() {
  console.log('❤️ Heart sent for story:', currentUserStories.value[currentStoryIndex.value])
  // TODO: Envoyer à l’API
}

// 💬 Message
function sendMessage() {
  if (!message.value.trim()) return
  console.log('💬 Message sent:', message.value)
  // TODO: Envoyer à l’API
  message.value = ''
}
</script>

<template>
  <v-row v-if="stories.length">
    <v-col cols="12">
      <v-card rounded="xl" class="overflow-x-auto mx-3 min-h-stories" variant="text">
        <div class="d-flex align-center justify-center">
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
              size="50"
              :class="[
                'border-md rounded-circle px-1 py-1',
                userStories.username === user.username ? 'border-success' : 'border-primary'
              ]"
            >
              <NuxtImg
                :alt="`story-${userStories.username}`"
                :src="userStories.stories[0]?.mediaPath"
                width="58"
                height="58"
                cover
              />
            </v-avatar>
          </v-col>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <v-dialog v-model="storyViewerVisible" max-width="500" @click:outside="closeStoryViewer">
    <v-card class="pa-0">
      <!-- Progress bar -->
      <v-progress-linear :model-value="progress" height="4" color="primary" stream />

      <!-- Story Display -->
      <div class="position-relative d-flex align-center justify-center" style="height: 500px; background-color: black;">
        <NuxtImg
          v-if="currentUserStories[currentStoryIndex]"
          :src="currentUserStories[currentStoryIndex].mediaPath"
          :alt="`story-${currentStoryIndex}`"
          width="100%"
          height="100%"
          class="w-100 h-100"
          style="object-fit: cover;"
        />

        <!-- Navigation Zones -->
        <!-- Navigation Arrows -->
        <v-btn
          variant="text"
          icon
          class="position-absolute left-0"
          color="primary"
          style="top: 50%; transform: translateY(-50%); z-index: 10;"
          @click="goToPreviousStory"
        >
          <v-icon size="48">mdi-chevron-left</v-icon>
        </v-btn>

        <v-btn
          variant="text"
          icon
          color="primary"
          class="position-absolute right-0"
          style="top: 50%; transform: translateY(-50%); z-index: 10;"
          @click="goToNextStory"
        >
          <v-icon size="48">mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <!-- Reactions / Input -->
      <div class="d-flex align-center justify-space-between px-4 py-2">
        <v-btn variant="text" icon @click="sendHeart">
          <v-icon>mdi-heart</v-icon>
        </v-btn>
        <v-text-field
          v-model="message"
          placeholder="Envoyer un message..."
          variant="solo"
          hide-details
          flat
          density="compact"
          style="flex-grow: 1;"
          @keyup.enter="sendMessage"
        />
        <v-btn variant="text" icon @click="sendMessage">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
