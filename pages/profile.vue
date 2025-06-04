<script setup lang="ts">
import { ref } from 'vue'
const { user } = await useUserSession()
const profile = ref<any>(null)
const pending = ref(false)
const avatarUrl = ref('')
const loadProfile = async () => {
  pending.value = true
  if (user.value.username) {
    const { data } = await useFetch(`/api/profile/${user.value.username}`)
    if (data.value) {
      profile.value = data.value
      avatarUrl.value = data.value?.profile?.photo ?? '/person.png'
    }
  }
  pending.value = false
}

watch(user.value.username, () => {
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
  middleware: 'auth',
})
</script>
<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col lg="12">
        <div
          v-if="pending"
          class="d-flex justify-center align-center"
          style="height: 25vh"
        >
          <v-progress-circular
            :size="120"
            :width="10"
            color="primary"
            indeterminate
          />
        </div>
        <v-card v-else rounded="xl" class="py-4" variant="text">
          <div class="px-5">
            <v-row align="center" class="pa-0 ma-0">
              <!-- Avatar -->
              <v-col cols="auto">
                <v-avatar
                  size="50"
                  class="rounded-circle"
                >
                  <v-img :src="avatarUrl" alt="Avatar" />
                </v-avatar>
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

              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="4" md="4" cols="12" class="position-relative">
        <v-card rounded="xl" class="h-60" variant="text">
          <div class="px-4 pt-4">
            <h6 class="mb-0 text-h6 text-typo">Platform Settings</h6>
          </div>
          <hr class="horizontal dark mt-2 mb-1" />
          <div class="px-4 py-4">
            <h6 class="text-uppercase text-body text-xs font-weight-bolder">
              Account
            </h6>
            <v-list class="bg-transparent" elevation="0">
              <v-list-item
                v-for="setting in accountSettings"
                :key="setting.text"
              >
                <v-row class="d-flex align-center">
                  <v-col cols="2">
                    <v-switch
                      v-model="setting.switchState"
                      hide-details
                      class="d-inline-flex mt-0 pt-0 switch ms-auto"
                    />
                  </v-col>
                  <v-col cols="10">
                    <div class="ms-4 text-body text-sm">{{ setting.text }}</div>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>

            <h6
              class="text-uppercase text-body text-xs font-weight-bolder mt-4"
            >
              Application
            </h6>
            <v-list class="bg-transparent" elevation="0">
              <v-list-item
                v-for="setting in applicationSettings"
                :key="setting.text"
              >
                <v-row class="d-flex align-center">
                  <v-col cols="2">
                    <v-switch
                      v-model="setting.switchState"
                      hide-details
                      class="d-inline-flex mt-0 pt-0 switch ms-auto"
                    />
                  </v-col>
                  <v-col cols="10">
                    <div class="ms-4 text-body text-sm">{{ setting.text }}</div>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>

      <v-col lg="4" md="4" cols="12" class="position-relative">
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

      <v-col lg="4" md="4" cols="12" class="position-relative">
        <v-card rounded="xl" class="h-100" variant="text">
          <div class="px-4 pt-4">
            <h6 class="mb-0 text-h6 text-typo">Conversations</h6>
          </div>
          <hr class="horizontal dark mt-2 mb-1" />
          <div class="px-4 py-4">
            <v-list class="bg-transparent" elevation="0">
              <v-list-item-group class="border-radius-sm">
                <v-list-item
                  v-for="conversation in conversations"
                  :key="conversation.text"
                  :ripple="false"
                  class="px-0 border-radius-sm mb-2"
                >
                  <div class="d-flex align-center">
                    <div>
                      <v-avatar
                        width="48"
                        height="48"
                        class="shadow border-radius-lg me-4"
                      >
                        <v-img
                          :src="conversation.avatar"
                          alt="Avatar"
                          class="border-radius-lg"
                        />
                      </v-avatar>
                    </div>
                    <div>
                      <h6
                        class="mb-0 text-sm text-sm text-typo font-weight-bold"
                      >
                        {{ conversation.user }}
                      </h6>
                      <p class="mb-0 text-xs text-body font-weight-light">
                        {{ conversation.message }}
                      </p>
                    </div>
                    <div class="ms-auto">
                      <v-btn
                        :ripple="false"
                        small
                        variant="text"
                        width="auto"
                        class="text-primary font-weight-bolder"
                      >
                        Reply
                      </v-btn>
                    </div>
                  </div>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
