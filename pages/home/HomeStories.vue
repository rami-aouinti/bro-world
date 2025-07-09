<script setup lang="ts">
import { ref, onBeforeUnmount, nextTick } from 'vue'
import { useIntervalFn } from '@vueuse/core'
const { user } = await useUserSession()

const props = defineProps({
  stories: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const storyViewerVisible = ref(false)
const currentUserStories = ref<any[]>([])
const currentUsername = ref('')
const currentStoryIndex = ref(0)
const progress = ref(0)
const message = ref('')

const intervalDelay = 5000 // 5 seconds
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
  }, intervalDelay / 50)
}

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

function sendHeart() {
  console.log('❤️ Heart sent for story:', currentUserStories.value[currentStoryIndex.value])
}

function sendMessage() {
  if (!message.value.trim()) return
  console.log('💬 Message sent:', message.value)
  message.value = ''
}
</script>

<template>
  <div class="py-3">
  <v-card rounded="xl" class="overflow-x-auto mx-3 min-h-stories" variant="text" elevation="10">
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
            class="border-md rounded-circle px-1 py-1"
            :class="userStories.username === user.username ? 'border-success' : 'border-primary'"
            size="50"
            style="cursor: pointer"
          >
            <NuxtImg
              format="webp" loading="lazy" cover
              :alt="`story-${userStories.username}`"
              :src="userStories.stories[0]?.mediaPath"
              width="58"
              height="58"
            />
          </v-avatar>
        </v-col>
      </div>
    </v-card>
  <v-dialog v-model="storyViewerVisible" max-width="500" @click:outside="closeStoryViewer">
    <v-card class="pa-0">
      <v-progress-linear aria-label="Stories" :model-value="progress" height="4" color="primary" stream />

      <div class="position-relative d-flex align-center justify-center" style="height: 500px; background-color: black;">
        <NuxtImg
          format="webp" loading="lazy" cover
          v-if="currentUserStories[currentStoryIndex]"
          :src="currentUserStories[currentStoryIndex].mediaPath"
          :alt="`story-${currentStoryIndex}`"
          width="100%"
          height="100%"
          class="w-100 h-100"
          style="object-fit: cover;"
        />

        <v-btn
          variant="text"
          icon
          class="position-absolute left-0"
          color="primary"
          style="top: 50%; transform: translateY(-50%); z-index: 10;"
          @click="goToPreviousStory"
          aria-label="Previous story"
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
          aria-label="Next story"
        >
          <v-icon size="48">mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <div class="d-flex align-center justify-space-between px-4 py-2">
        <v-btn variant="text" icon @click="sendHeart" aria-label="Send heart">
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
          aria-label="Send message"
        />
        <v-btn variant="text" icon @click="sendMessage" aria-label="Send message button">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  </div>
</template>

<style scoped>
.min-h-stories {
  min-height: 75px;
}
</style>
