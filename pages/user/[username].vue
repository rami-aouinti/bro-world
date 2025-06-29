<script setup lang="ts">
import UserAvatar from "~/components/App/UserAvatar.vue";
import { useRoute } from 'vue-router'
import LoaderProfile from "~/components/App/Loader/Profile/LoaderProfile.vue";
import LoaderUser from "~/components/App/Loader/Profile/LoaderUser.vue";

const route = useRoute()
const { user } = useUserSession()
const profile = ref<any>(null)
const isFollowing = ref<boolean | null>(null)
const isOwnProfile = ref(false)
const pending = ref(false)
const username = route.params.username

const loadProfile = async () => {
  pending.value = true
  const { data } = await useFetch(`/api/profile/${username}`)
  if (data.value) {

    profile.value = data.value
    isOwnProfile.value = user?.username === profile.value.username
    if (!isOwnProfile.value) await checkFollowStatus()
    isOwnProfile.value = user?.username === profile.value.username
  }
  pending.value = false
}

const checkFollowStatus = async () => {
  const { data } = await useFetch(`/api/follow/status/${profile.value.id}`)
  if (data.value) isFollowing.value = data.value
}

async function toggleFollow() {
  const { error } = await useFetch(`/api/follow/follow/${profile.value.id}`, {
    method: 'POST',
  })

  if (!error.value) {
    isFollowing.value = true
  }
}

async function toggleUnFollow() {
  const { error } = await useFetch(`/api/follow/unfollow/${profile.value.id}`, {
    method: 'POST',
  })

  if (!error.value) {
    isFollowing.value = true
  }
}

watch(username, () => {
  loadProfile()
}, { immediate: true })

onMounted(async () => {
  window.scrollTo({ top: 0 })
  await loadProfile()
})

const accountSettings = ref([
  { text: 'Email me when someone follows me', switchState: true },
  { text: 'Email me when someone answers on my post', switchState: false },
])

const applicationSettings = ref([
  { text: 'New launches and projects', switchState: true },
  { text: 'Monthly product updates', switchState: false },
])

const conversations = ref([
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    user: 'John Doe',
    message: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
])
definePageMeta({
  layout: 'default',
  description: 'Profile page',
  breadcrumb: 'disabled',
})
</script>
<template>
  <v-container
    fluid
  >
    <div v-if="pending">
      <LoaderUser />
    </div>
    <v-row v-else >
      <v-col lg="12">
        <v-card rounded="xl" class="py-4" variant="text">
          <div class="px-5">
            <v-row align="center" class="pa-0 ma-0">
              <!-- Avatar -->
              <v-col cols="auto">
                <UserAvatar :user="profile" />
              </v-col>

              <!-- Nom et Type -->
              <v-col cols="auto">
                <div>
                  <h6 class="mb-1 text-h6 text-typo font-weight-bold">
                    {{ profile?.firstName }} {{ profile?.lastName }}
                  </h6>
                  <p class="mb-0 font-weight-light text-body text-sm">
                    {{
                      profile?.profile?.title
                    }}
                  </p>
                </div>
              </v-col>

              <!-- Boutons Follow / Inbox -->
              <v-col cols="auto" class="ml-auto">
                <v-btn
                  v-if="!isOwnProfile"
                  variant="outlined"
                  color="secondary"
                  class="me-2"
                  to="/inbox"
                >
                  <v-icon>mdi-message</v-icon>
                </v-btn>

                <v-btn
                  v-if="!isOwnProfile && isFollowing"
                  variant="outlined"
                  color="primary"
                  @click="toggleUnFollow"
                >
                  <v-icon>mdi-account-minus</v-icon>
                </v-btn>

                <v-btn
                  v-if="!isOwnProfile && !isFollowing"
                  variant="outlined"
                  color="primary"
                  @click="toggleFollow"
                >
                  <v-icon>mdi-account-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col lg="12" md="12" cols="12" class="position-relative">
        <v-card rounded="xl" class="h-100" variant="text">
          <div class="px-4 pt-4">
            <h6 class="mb-0 text-h6 text-typo">Profile Information</h6>
          </div>
          <hr class="horizontal dark mt-2 mb-1" />
          <div class="px-4 py-4">
            <p class="text-sm font-weight-light text-body">
              {{
                profile?.profile?.description
              }}
            </p>
            <v-list class="bg-transparent" elevation="0">
              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">Full Name:</strong>
                  &nbsp; {{ profile?.firstName ?? 'Not provided' }}
                  {{ profile?.lastName ?? 'Not provided' }}
                </div>
              </v-list-item>

              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">Mobile:</strong>
                  &nbsp; (44) 123 1234 123
                </div>
              </v-list-item>

              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">Email:</strong>
                  &nbsp; {{ profile?.email ?? 'Not provided' }}
                </div>
              </v-list-item>

              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">Location:</strong>
                  &nbsp; {{ profile?.locale ?? 'Not provided' }}
                </div>
              </v-list-item>

              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">Social:</strong>
                  &nbsp;
                  <v-icon color="#344e86" icon="mdi-facebook"
                  ></v-icon
                  >
                  <v-icon color="#3ea1ec" icon="mdi-twitter"
                  ></v-icon
                  >
                  <v-icon color="#0e456d" icon="mdi-instagram"
                  ></v-icon
                  >
                  <v-icon icon="mdi-google"
                  ></v-icon
                  >
                </div>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
