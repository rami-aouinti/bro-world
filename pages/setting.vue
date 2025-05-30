<script setup lang="ts">
definePageMeta({
  title: 'Setting',
  middleware: ['auth'],
})

const cards = [
  {
    image: '@/assets/img/home-decor-1.jpg',
    title: 'Project #2',
    style: 'Modern',
    description:
      'As Uber works through a huge amount of internal management turmoil.',
    avatars: [
      {
        image: '@/assets/img/team-1.jpg',
        name: 'Elena Morison',
      },
      {
        image: '@/assets/img/team-2.jpg',
        name: 'Ryan Milly',
      },
      {
        image: '@/assets/img/team-3.jpg',
        name: 'Nick Daniel',
      },
      {
        image: '@/assets/img/team-4.jpg',
        name: 'Peterson',
      },
    ],
  },
  {
    image: '@/assets/img/home-decor-2.jpg',
    title: 'Project #1',
    style: 'Scandinavian',
    description:
      'Music is something that every person has his or her own specific opinion about.',
    avatars: [
      {
        image: '@/assets/img/team-3.jpg',
        name: 'Nick Daniel',
      },
      {
        image: '@/assets/img/team-4.jpg',
        name: 'Peterson',
      },
      {
        image: '@/assets/img/team-1.jpg',
        name: 'Elena Morison',
      },
      {
        image: '@/assets/img/team-2.jpg',
        name: 'Ryan Milly',
      },
    ],
  },
  {
    image: '@/assets/img/home-decor-3.jpg',
    title: 'Project #3',
    style: 'Minimalist',
    description:
      'Different people have different taste, and various types of music.',
    avatars: [
      {
        image: '@/assets/img/team-1.jpg',
        name: 'Peterson',
      },
      {
        image: '@/assets/img/team-2.jpg',
        name: 'Nick Daniel',
      },
      {
        image: '@/assets/img/team-3.jpg',
        name: 'Ryan Milly',
      },
      {
        image: '@/assets/img/team-4.jpg',
        name: 'Elena Morison',
      },
    ],
  },
  {
    image: '@/assets/img/home-decor-4.jpg',
    title: 'Project #4',
    style: 'Gothic',
    description:
      'Why would anyone pick blue over pink? Pink is obviously a better color.',
    avatars: [
      {
        image: '@/assets/img/team-1.jpg',
        name: 'Peterson',
      },
      {
        image: '@/assets/img/team-2.jpg',
        name: 'Nick Daniel',
      },
      {
        image: '@/assets/img/team-3.jpg',
        name: 'Ryan Milly',
      },
      {
        image: '@/assets/img/team-4.jpg',
        name: 'Elena Morison',
      },
    ],
  },
]
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
const { user } = useUserSession()
</script>
<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col lg="12">
        <v-card rounded="xl" class="py-4">
          <div class="px-5">
            <v-row>
              <v-col cols="auto">
                <v-avatar
                  width="74"
                  height="74"
                  class="border border-default shadow rounded-circle"
                >
                  <v-img :src="user?.avatar" />
                </v-avatar>
              </v-col>
              <v-col cols="auto" class="my-auto">
                <div class="h-100">
                  <h5 class="mb-1 text-h5 text-typo font-weight-bold">
                    {{ user?.firstName }} {{ user?.lastName }}
                  </h5>
                  <p class="mb-0 font-weight-light text-body text-sm">
                    {{ user.type }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="4" md="4" cols="12" class="position-relative">
        <v-card rounded="xl" class="h-60">
          <div class="px-4 pt-4">
            <h6 class="mb-0 text-h6 text-typo">Platform Settings</h6>
          </div>
          <hr class="horizontal dark mt-2 mb-1" />
          <div class="px-4 py-4">
            <h6 class="text-uppercase text-body text-xs font-weight-bolder">
              Account
            </h6>
            <v-list>
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
            <v-list>
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
        <v-card rounded="xl" class="h-100">
          <div class="px-4 pt-4">
            <h6 class="mb-0 text-h6 text-typo">Profile Information</h6>
          </div>
          <hr class="horizontal dark mt-2 mb-1" />
          <div class="px-4 py-4">
            <p class="text-sm font-weight-light text-body">
              Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer
              is no...
            </p>
            <v-list>
              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">Full Name:</strong>
                  &nbsp; {{ user?.firstName ?? 'Not provided' }}
                  {{ user?.lastName ?? 'Not provided' }}
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
                  &nbsp; {{ user?.email ?? 'Not provided' }}
                </div>
              </v-list-item>

              <v-list-item class="px-0 border-radius-sm">
                <div class="text-body text-sm">
                  <strong class="text-dark">Location:</strong>
                  &nbsp; {{ user?.locale ?? 'Not provided' }}
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
                </div>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>

      <v-col lg="4" md="4" cols="12" class="position-relative">
        <v-card rounded="xl" class="h-100">
          <div class="px-4 pt-4">
            <h6 class="mb-0 text-h6 text-typo">Conversations</h6>
          </div>
          <hr class="horizontal dark mt-2 mb-1" />
          <div class="px-4 py-4">
            <v-list>
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
    <v-row>
      <v-col cols="12">
        <v-card rounded="xl">
          <div class="px-4 pt-4">
            <h6 class="mb-1 text-typo text-h6 font-weight-bold">Projects</h6>
            <p class="text-sm text-body">Architects design houses</p>
          </div>
          <div class="px-4 py-4">
            <v-row>
              <v-col v-for="card in cards" :key="card.title" lg="6" md="6">
                <v-card>
                  <div class="position-relative">
                    <a class="d-block shadow-xl border-radius-xl">
                      <v-img
                        :src="card.image"
                        class="shadow border-radius-xl"
                      />
                    </a>
                  </div>
                  <div class="px-1 pt-6">
                    <p class="text-body font-weight-light mb-0 text-sm">
                      {{ card.title }}
                    </p>
                    <a href="javascript:" class="text-decoration-none">
                      <h5 class="text-h5 font-weight-bold text-typo mb-2">
                        {{ card.style }}
                      </h5>
                    </a>
                    <p class="mb-6 text-sm text-body font-weight-light">
                      {{ card.description }}
                    </p>
                    <div class="d-flex align-center justify-space-between">
                      <v-btn
                        variant="outlined"
                        color="#e91e63"
                        small
                      >
                        View Project
                      </v-btn>
                      <span class="avatar-group d-flex">
                        <v-tooltip
                          v-for="avatar in card.avatars"
                          :key="avatar.name"
                          bottom
                          color="#212529"
                        >
                          <template #activator="{ on, attrs }">
                            <v-avatar
                              v-bind="attrs"
                              size="24"
                              class="border border-white ms-n3"
                              v-on="on"
                            >
                              <img :src="avatar.image" alt="Avatar" />
                            </v-avatar>
                          </template>
                          <span>{{ avatar.name }}</span>
                        </v-tooltip>
                      </span>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
