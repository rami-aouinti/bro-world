<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <!-- Skeleton au chargement -->
    <template v-if="showCard">
      <v-skeleton-loader
        type="card"
        class="mx-3 mb-4 rounded-xl"
        height="120"
      />
    </template>

    <!-- Liste des blogs -->
    <div v-else>
      <v-card
        @click="redirectToWorld(blog.slug)"
        v-for="(blog, i) in blogs"
        :key="blog.slug || i"
        rounded="xl"
        class="mx-1 mb-2"
        variant="text"
        aria-label="Blog card"
      >
        <div class="d-flex align-center px-4 py-4">
          <v-row>
            <!-- Infos blog -->
            <v-col cols="8">
              <div class="d-flex align-center">
                <v-avatar size="50" class="border-default border-lg rounded-circle" v-if="blog.logo">
                  <NuxtImg format="webp"
                           loading="lazy"
                           cover width="50" height="50" :src="blog.logo" alt="Blog logo" />
                </v-avatar>
                <div class="ms-2 my-auto">
                  <p class="mb-0 text-typo font-weight-bold">
                    {{ blog.title }}
                  </p>
                  <RelativeTime :date="blog.createdAt" />
                </div>
              </div>
            </v-col>

            <!-- Actions -->
            <v-col cols="4">
              <div class="d-flex align-center justify-end">
                <span class="avatar-group d-flex me-3">
                  <v-tooltip
                    text="Blogs"
                    bottom
                    v-for="avatar in avatars"
                    :key="avatar.name"
                  >
                    <template #activator="{ props }">
                      <v-avatar
                        v-bind="props"
                        size="24"
                        class="border border-primary"
                      >
                        <NuxtImg format="webp" loading="lazy" cover :src="avatar.image" alt="Avatar" />
                      </v-avatar>
                    </template>
                    <span>{{ avatar.name }}</span>
                  </v-tooltip>
                </span>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import RelativeTime from '~/components/App/RelativeTime.vue'

const { t, locale } = useI18n()
const router = useRouter()

const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))
const { loggedIn } = await useUserSession()

const showCard = ref(true)
const blogs = ref<any[]>([])

const avatars = [
  { image: '/img/team-1.jpg', name: 'Elena Morison' },
  { image: '/img/team-2.jpg', name: 'Ryan Milly' },
  { image: '/img/team-5.jpg', name: 'Nick Daniel' },
  { image: '/img/team-4.jpg', name: 'Peterson' }
]

const redirectToWorld = (slug: string) => {
  if (slug) router.push(`/world/${slug}`)
}

const fetchBlogs = async () => {
  try {
    const data = await $fetch('/api/profile/blogs')
    blogs.value = data ?? []
  } catch (error) {
    console.error('Failed to load blogs :', error)
    blogs.value = []
  } finally {
    showCard.value = false
  }
}

onMounted(fetchBlogs)
</script>
