<script setup lang="ts">
import { ref } from 'vue'
const { user } = await useUserSession()
const stories = ref<any[]>([])

const storyViewerVisible = ref(false)
const currentUserStories = ref<any[]>([])
const currentUsername = ref('')

async function loadStories() {
  try {
    const response = await useFetch('/api/profile/stories', {
      credentials: 'include',
    })
    stories.value = response.data.value || []
  } catch (e) {
    console.error('Failed to load stories', e)
  }
}

loadStories()

function openStoryViewer(userStories: any) {
  currentUsername.value = userStories.username
  currentUserStories.value = userStories.stories
  storyViewerVisible.value = true
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
        <div class="d-flex align-center justify-center">
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
              size="50"
              :class="['border-md rounded-circle px-1 py-1', userStories.username === user.username ? 'border-success' : 'border-primary']"
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

  <v-dialog v-model="storyViewerVisible" max-width="500">
    <v-card>
      <v-carousel height="500" hide-delimiter-background show-arrows>
        <v-carousel-item
          v-for="(story, index) in currentUserStories"
          :key="index"
          class="d-flex align-center justify-center"
        >
          <NuxtImg
            :alt="index"
            :src="story.mediaPath"
            width="100%"
            height="100%"
            class="w-100 h-100"
            object-fit
            style="object-fit:
            cover;"
          />
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-dialog>
</template>

