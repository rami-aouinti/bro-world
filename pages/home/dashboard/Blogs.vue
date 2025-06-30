<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <template v-if="showCard">
      <v-skeleton-loader
        type="card"
        class="mx-3 mb-4 rounded-xl"
        height="120"
      />
    </template>
    <div v-else>
      <v-card
        rounded="xl"
        class="mx-3 mb-4"
        variant="text"
        elevation="10"
        v-for="(blog, i) in blogs"
        :key="i"
      >
        <div class="d-flex align-center px-4 py-4">
          <v-row>
            <v-col cols="6">
              <div class="d-flex align-center">
                <v-avatar>
                  <v-img :src="blog.logo" />
                </v-avatar>
                <div class="ms-2 my-auto">
                  <p class="mb-0 text-typo font-weight-bold">
                    {{ blog.title }}
                  </p>
                  <RelativeTime :date="blog.createdAt" />
                </div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="d-flex align-center">
                <span class="avatar-group d-flex ms-auto">
                  <v-tooltip bottom v-for="avatar in avatars" :key="avatar.name">
                    <template #activator="{ props }">
                      <v-avatar
                        v-bind="props"
                        size="24"
                        class="border border-primary"
                      >
                        <v-img :src="avatar.image" alt="Avatar" />
                      </v-avatar>
                    </template>
                    <span>{{ avatar.name }}</span>
                  </v-tooltip>
                </span>
                <v-btn
                  variant="text"
                  color="primary"
                  @click="redirectToWorld(blog.slug)"
                  small
                >
                  Open
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import RelativeTime from '~/components/App/RelativeTime.vue'

const { t, locale } = useI18n()
const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))

const { loggedIn } = useUserSession()
const router = useRouter()

const showCard = ref(true)
const blogs = ref<any[]>([])

const avatars = [
  { image: "/img/team-1.jpg", name: "Elena Morison" },
  { image: "/img/team-2.jpg", name: "Ryan Milly" },
  { image: "/img/team-5.jpg", name: "Nick Daniel" },
  { image: "/img/team-4.jpg", name: "Peterson" },
]

const redirectToWorld = (slug: string) => {
  router.push(`/world/${slug}`)
}

const fetchBlogs = async () => {
  try {
    const data = await $fetch('/api/profile/blogs') // ✅ $fetch retourne directement les données
    blogs.value = data ?? []
  } catch (error) {
    console.error('Erreur lors du chargement des blogs :', error)
    blogs.value = []
  } finally {
    showCard.value = false
  }
}

onMounted(fetchBlogs)

watch(showCard, () => {
  if (showCard.value) fetchBlogs()
}, { immediate: true })
</script>
