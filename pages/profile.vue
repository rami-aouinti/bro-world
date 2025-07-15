<script setup lang="ts">
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import {useI18n} from 'vue-i18n'
import LoaderProfile from '~/components/App/Loader/Profile/LoaderProfile.vue'
import {useUserStore} from '~/stores/useUserStore'
import Media from "~/pages/home/dashboard/Media.vue";
import {useConversationUtils} from "~/composables/useConversationUtils";
const userStore = useUserStore()
const canTeleport = ref(false)
const { t } = useI18n()
const { user } = await useUserSession()
const avatarUrl = ref('')

const { data: profile, pending, error, refresh } = await useAsyncData(
  'profile-' + user.value.id,
  async () => await userStore.fetchProfile(user.value.id, user.value.username),
  {
    watch: [() => user.value.id],
    server: true
  }
)
const fetchProfile = async (userId) => {
  if (user.id) {
    const data = await userStore.fetchProfile(userId, null)
    if (data) {
      return data.value.username
    }
  }

}

const avatars = [
  '?accessoriesType=Blank&avatarStyle=Circle&clotheColor=PastelGreen&clotheType=ShirtScoopNeck&eyeType=Wink&eyebrowType=UnibrowNatural&facialHairColor=Black&facialHairType=MoustacheMagnum&hairColor=Platinum&mouthType=Concerned&skinColor=Tanned&topType=Turban',
  '?accessoriesType=Sunglasses&avatarStyle=Circle&clotheColor=Gray02&clotheType=ShirtScoopNeck&eyeType=EyeRoll&eyebrowType=RaisedExcited&facialHairColor=Red&facialHairType=BeardMagestic&hairColor=Red&hatColor=White&mouthType=Twinkle&skinColor=DarkBrown&topType=LongHairBun',
  '?accessoriesType=Prescription02&avatarStyle=Circle&clotheColor=Black&clotheType=ShirtVNeck&eyeType=Surprised&eyebrowType=Angry&facialHairColor=Blonde&facialHairType=Blank&hairColor=Blonde&hatColor=PastelOrange&mouthType=Smile&skinColor=Black&topType=LongHairNotTooLong',
  '?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelOrange&clotheType=Overall&eyeType=Close&eyebrowType=AngryNatural&facialHairColor=Blonde&facialHairType=Blank&graphicType=Pizza&hairColor=Black&hatColor=PastelBlue&mouthType=Serious&skinColor=Light&topType=LongHairBigHair',
  '?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Gray01&clotheType=BlazerShirt&eyeType=Surprised&eyebrowType=Default&facialHairColor=Red&facialHairType=Blank&graphicType=Selena&hairColor=Red&hatColor=Blue02&mouthType=Twinkle&skinColor=Pale&topType=LongHairCurly',
]

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

const active = ref([])
const avatar = ref(null)
const open = ref([])
const users = ref([])

const items = computed(() => [
  {
    name: 'Friends',
    children: profile.friends,
    id: 'user',
  },
])

const selected = computed(() => {
  if (!active.value.length) return undefined

  const id = active.value[0]

  return users.value.find(user => user.id === id)
})
const activeConversation = ref<any | null>(null)
const conversations = ref<any[]>([])
const search = ref('')

const fetchConversations = async () => {
  const data = await $fetch('/api/messenger/conversations')
  console.log(data)
  conversations.value = data

  console.log(conversations)

}
const { getConversationTitle, getConversationAvatar } = useConversationUtils()


async function fetchUsers (item) {
  await pause(1500)

  return fetch('https://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then(json => (item.children.push(...json)))
    .catch(err => console.warn(err))
}

function randomAvatar () {
  avatar.value = avatars[Math.floor(Math.random() * avatars.length)]
}
watch(selected, async () => {
  await fetchConversations()
  randomAvatar()
})
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await nextTick()
  await fetchConversations()
  canTeleport.value = !!document.getElementById('menu-bar-world')
})

const accountSettings = ref([
  { text: 'emailWhenFollow', switchState: true },
  { text: 'emailWhenAnswer', switchState: false },
])

const applicationSettings = ref([
  { text: 'newProjects', switchState: true },
  { text: 'monthlyUpdates', switchState: false },
])

definePageMeta({
  layout: 'default',
  description: 'Profile page',
  breadcrumb: 'disabled',
  title: 'Profile',
  meta: [
    { name: 'description', content: 'User profile page with personal information and settings.' },
    { name: 'keywords', content: 'profile, user, settings' },
  ],
  head: {
    title: 'Profile',
    meta: [
      { name: 'description', content: 'User profile page with personal information and settings.' },
      { name: 'keywords', content: 'profile, user, settings' },
    ],
  },
  middleware: 'auth',
  scrollToTop: true,
})
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <div class="px-4 py-1">
          <v-list class="bg-transparent" elevation="0">
            <v-list-item class="px-0 border-radius-sm">
              <div class="text-body text-sm">
                <strong class="text-dark">{{ t('profile.mobile') }}:</strong>
                &nbsp; {{ profile?.profile?.phone ?? '' }}
              </div>
              <div class="text-body text-sm">
                <strong class="text-dark">{{ t('profile.email') }}:</strong>
                &nbsp; {{ profile?.email ?? t('profile.notProvided') }}
              </div>
              <div class="text-body text-sm">
                <strong class="text-dark">{{ t('profile.location') }}:</strong>
                &nbsp; {{ profile?.locale ?? '' }}
              </div>
            </v-list-item>
          </v-list>
          <h6 class="text-uppercase text-body text-xs font-weight-bolder">
            {{ t('profile.account') }}
          </h6>
          <v-list class="bg-transparent" elevation="0">
            <v-list-item v-for="setting in accountSettings" :key="setting.text">
              <v-row class="d-flex align-center">
                <v-col cols="2">
                  <v-switch v-model="setting.switchState" hide-details class="d-inline-flex mt-0 pt-0 switch ms-auto" />
                </v-col>
                <v-col cols="10">
                  <div class="ms-4 text-body text-sm">{{ t(`profile.settings.${setting.text}`) }}</div>
                </v-col>
              </v-row>
            </v-list-item>
            <v-list-item v-for="setting in applicationSettings" :key="setting.text">
              <v-row class="d-flex align-center">
                <v-col cols="2">
                  <v-switch v-model="setting.switchState" hide-details class="d-inline-flex mt-0 pt-0 switch ms-auto" />
                </v-col>
                <v-col cols="10">
                  <div class="ms-4 text-body text-sm">{{ t(`profile.settings.${setting.text}`) }}</div>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </div>
      </teleport>
    </client-only>
    <div v-if="pending">
      <LoaderProfile />
    </div>
    <div v-else>
      <v-row>
        <v-col lg="12">
          <v-card rounded="xl" class="bg-gradient-primary shadow-primary py-1" variant="text" elevation="10">
            <div class="px-5">
              <v-row align="center" class="pa-0 ma-0">
                <v-col cols="auto">
                  <v-avatar size="50" class="border-primary border-lg rounded-circle">
                    <NuxtImg :lazy-src="'/img/person.png'" format="webp" loading="lazy" cover width="50" height="50" :src="profile?.profile?.photo" alt="Avatar" />
                  </v-avatar>
                </v-col>
                <v-col cols="auto">
                  <div>
                    <h6 class="mb-1 text-h6 text-typo font-weight-bold">
                      {{ profile?.firstName }} {{ profile?.lastName }}
                    </h6>
                    <p class="mb-0 font-weight-light text-body text-sm">
                      {{ profile?.profile?.title }}
                    </p>
                  </div>
                </v-col>
                <v-col cols="auto" class="ms-auto d-flex align-center justify-end">
                  <v-btn variant="text" to="/setting" class="font-weight-bolder me-1">
                    <v-icon icon="mdi-settings" size="20" />
                  </v-btn>
                  <v-btn variant="text" to="/inbox" class="font-weight-bolder">
                    <v-icon icon="mdi-message" size="20" />
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-card rounded="xl" class="bg-gradient-primary shadow-primary mx-3 mt-3" variant="text" elevation="10">
            <div class="d-flex flex-column justify-center text-center h-100">
              <NuxtLink href="javascript:" class="text-decoration-none">
                <h5 class="text-h5 text-secondary">New Blog</h5>
              </NuxtLink>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card rounded="xl" class="bg-gradient-primary shadow-primary mx-3 mt-3" variant="text" elevation="10">
            <div class="d-flex flex-column justify-center text-center h-100">
              <NuxtLink href="javascript:" class="text-decoration-none">
                <h5 class="text-h5 text-secondary">Generate your CV</h5>
              </NuxtLink>
            </div>
          </v-card>
        </v-col>
      </v-row>

    </div>
  </v-container>
</template>
<style scoped>
/* This is for documentation purposes and will not be needed in your application */
::v-deep(.v-application__wrap) {
  min-height: 0 !important;
}

.demo-panel-static,
.demo-panel-relative {
  margin: 0 80px 50px;
  padding: 24px;
  min-height: 300px;
}
.demo-panel-static {
  position: static;
}
.demo-panel-relative {
  position: relative;
}

.v-selection-control--disabled,
.v-input--disabled .v-selection-control {
  opacity: .1;
}

.v-radio {
  flex-grow: 0 !important;
}

h5 {
  margin-bottom: 12px;
}

code {
  display: block;
  font-size: .8rem;
  margin-top: 12px;
}

::v-deep(.v-label) {
  margin-left: 8px;
}
</style>
