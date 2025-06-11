<script setup lang="ts">

const messages = [
  {
    image: '/img/team-2.jpg',
    name: 'Charlie Watson',
    message: 'Typing...',
  },
  {
    image: '/img/team-1.jpg',
    name: 'Jana Doe',
    time: '1 hour ago',
    message: 'Computer users and program...',
  },
  {
    image: '/img/team-3.jpg',
    name: 'Mila Skylar',
    time: '24 min ago',
    message: 'You can subscribe to receive wee...',
  },
  {
    image: '/img/team-5.jpg',
    name: 'Sofia Scarlett',
    time: '7 hours ago',
    message: 'It’s an effective resource rega...',
  },
  {
    image: '/img/team-4.jpg',
    name: 'Tom Klein',
    time: '1 day ago',
    message: 'Be sure to check it out if your dev...',
  },
]

const chats = [
  {
    type: 'received',
    message:
      'Yeah! Responsive Design is geared towards those trying to build web apps',
    time: '4:31pm',
  },
  {
    type: 'sent',
    message: 'Excellent, I want it now !',
    time: '4:42pm',
  },
  {
    type: 'received',
    message: 'You can easily get it; The content here is all free',
    time: '4:42pm',
  },
  {
    type: 'sent',
    message:
      'Awesome, blog is important source material for anyone who creates apps? Beacause these blogs offer a lot of information about website development.',
    time: '4:42pm',
  },
  {
    type: 'received',
    image:
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    time: '4:42pm',
  },
  {
    type: 'sent',
    message: 'At the end of the day … the native dev apps is where users are',
    time: '4:42pm',
  },
  {
    type: 'received',
    message: 'Charlie is Typing...',
  },
]

definePageMeta({
  layout: 'default',
  middleware: 'auth',
  breadcrumb: 'disabled',
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col md="4">
        <v-card class="py-3 px-3 overflow-scroll" rounded="xl" variant="text" max-height="500">
          <v-form
            id="navbar-search-main"
            class="navbar-search navbar-search-light d-inline-block w-100 mb-4"
          >
            <v-text-field
              rounded-sm
              hide-details
              outlined
              dense
              background-color="transparent"
              color="#e91e63"
              label="Search contact"
              class="font-size-input input-style"
            />
          </v-form>
          <a
            v-for="(message, i) in messages"
            :key="message.name"
            href="javascript:void(0)"
            class="card-shadow shadow-blur border-radius-xl mb-6 text-decoration-none"
          >
            <div
              v-if="i == 0"
              class="d-flex pa-4 bg-gradient-primary border-radius-xl"
            >
              <v-avatar width="48" height="48">
                <NuxtImg width="48" height="48" :src="message.image" alt="Avatar" />
              </v-avatar>
              <div class="ms-3">
                <h6 class="text-h6 mb-0">{{ message.name }}</h6>
                <p
                  class="mb-0 font-weight-light text-truncate d-block text-sm"
                >
                  {{ message.message }}
                </p>
              </div>
            </div>
            <div v-else class="d-flex pa-4">
              <v-avatar width="48" height="48">
                <NuxtImg width="48" height="48" :src="message.image" alt="Avatar" />
              </v-avatar>
              <div class="ms-3">
                <h6 class="text-h6 text-typo mb-0">{{ message.name }}</h6>
                <p
                  v-if="message.time"
                  class="text-muted text-xs mb-2 font-weight-light"
                >
                  {{ message.time }}
                </p>
                <p
                  class="mb-0 text-body font-weight-light text-truncate d-block text-sm"
                >
                  {{ message.message }}
                </p>
              </div>
            </div>
          </a>
        </v-card>
      </v-col>
      <v-col md="8">
        <v-card rounded="xl" class="pt-8 px-1 shadow-blur" max-height="500" variant="text">
          <div class="mt-n4">
            <div
              class="bg-gradient-primary shadow-primary border-radius-lg px-3 py-2 mx-3"
            >
              <v-container>
                <v-row>
                  <v-col md="10">
                    <div class="d-flex align-items-center">
                      <v-avatar width="48" height="48">
                        <NuxtImg width="48" height="48" src="/img/team-2.jpg" alt="Avatar" />
                      </v-avatar>
                      <div class="ms-3">
                        <h6 class="mb-0 text-h6 d-block">
                          Charlie Watson
                        </h6>
                        <span class="text-sm opacity-8"
                        >last seen today at 1:53am</span
                        >
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="1" class="my-auto">
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-icon
                          v-bind="attrs"
                          v-on="on"
                          size="18"
                          role="button"
                          variant="text"
                          aria-label="Video call"
                        >
                          mdi-camera
                        </v-icon>
                      </template>
                      <span>Video call</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="1" class="my-auto">
                    <v-menu
                      transition="slide-y-transition"
                      offset-y
                      offset-x
                      min-width="150"
                    >
                      <template #activator="{ on, attrs }">
                        <v-btn
                          icon
                          :ripple="false"
                          class="text-secondary"
                          v-bind="attrs"
                          variant="text"
                          small
                          v-on="on"
                        >
                          <v-icon
                            size="18"
                          >mdi-settings</v-icon
                          >
                        </v-btn>
                      </template>

                      <v-list class="pa-2">
                        <v-list-item
                          class="list-item-hover-active border-radius-md"
                        >
                          <v-list-item-content class="pa-0">
                            <v-list-item-title
                              class="text-body ls-0 text-typo font-weight-600 mb-0"
                            >
                              Profile
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          class="list-item-hover-active border-radius-md"
                        >
                          <v-list-item-content class="pa-0">
                            <v-list-item-title
                              class="text-body ls-0 text-typo font-weight-600 mb-0"
                            >
                              Mute Conversation
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          class="list-item-hover-active border-radius-md"
                        >
                          <v-list-item-content class="pa-0">
                            <v-list-item-title
                              class="text-body ls-0 text-typo font-weight-600 mb-0"
                            >
                              Block
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          class="list-item-hover-active border-radius-md"
                        >
                          <v-list-item-content class="pa-0">
                            <v-list-item-title
                              class="text-body ls-0 text-typo font-weight-600 mb-0"
                            >
                              Clear Chat
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item
                          class="list-item-hover-active border-radius-md"
                        >
                          <v-list-item-content class="pa-0">
                            <v-list-item-title
                              class="text-danger ls-0 font-weight-600 mb-0"
                            >
                              Delete Chat
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </div>
          <div class="overflow-scroll pt-6 px-4" style="max-height: 300px;" >
            <v-row class="justify-start">
              <v-col cols="auto">
                <v-card
                  rounded="xl"
                  class="py-2 px-3 shadow border-radius-xl"
                  max-height="300"
                >
                  <p class="mb-1 text-body font-weight-light">
                    It contains a lot of good lessons about effective
                    practices
                  </p>
                  <div
                    class="d-flex align-center text-sm text-body opacity-6"
                  >
                    <i class="ni ni-check-bold text-sm me-1" />
                    <small>3:14am</small>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <v-row class="justify-end text-end">
              <v-col cols="auto">
                <v-card
                  rounded="xl"
                  class="py-2 px-3 shadow bg-gradient-primary border-radius-xl"
                >
                  <p class="mb-1 font-weight-light">
                    Can it generate daily design links that include essays and
                    data visualizations ?
                  </p>
                  <div
                    class="d-flex align-center justify-end text-sm opacity-6"
                  >
                    <i class="ni ni-check-bold text-sm me-1" />
                    <small>4:42pm</small>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center">
                  <span
                    class="badge text-dark text-uppercase text-xs font-weight-bold"
                  >Wed, 3:27pm</span
                  >
              </v-col>
            </v-row>
            <div v-for="chat in chats" :key="chat.message">
              <v-row
                v-if="chat.type == 'received'"
                class="justify-start mb-3"
              >
                <v-col cols="auto">
                  <v-card
                    rounded="xl"
                    class="py-2 px-3 shadow border-radius-xl"
                  >
                    <p
                      v-if="chat.message"
                      class="mb-1 text-body font-weight-light"
                    >
                      {{ chat.message }}
                    </p>
                    <div v-if="chat.image" class="w-100 position-relative">
                      <NuxtImg
                        alt="chat"
                        max-height="200"
                        class="img-fluid mb-2 border-radius-lg"
                        :src="chat.image"
                        max-width="200"
                      />
                    </div>
                    <div
                      v-if="chat.time"
                      class="d-flex align-center text-sm text-body opacity-6"
                    >
                      <i class="ni ni-check-bold text-sm me-1" />
                      <small>{{ chat.time }}</small>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-else class="justify-end text-end mb-3">
                <v-col cols="auto">
                  <v-card
                    rounded="xl"
                    class="py-2 px-3 shadow bg-gradient-primary border-radius-xl"
                  >
                    <p
                      v-if="chat.message"
                      class="mb-1 font-weight-light"
                    >
                      {{ chat.message }}
                    </p>
                    <div
                      v-if="chat.time"
                      class="d-flex align-center justify-end text-sm opacity-6"
                    >
                      <i class="ni ni-check-bold text-sm me-1" />
                      <small>{{ chat.time }}</small>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="py-4 px-4">
            <v-form id="navbar-search-main" class="d-flex w-100">
              <v-text-field
                rounded-sm
                outlined
                dense
                hide-details
                background-color="transparent"
                color="#e91e63"
                label="Type your message"
                class="font-size-input input-style"
              />
              <v-btn
                variant="text"
                class="bg-gradient-primary ms-2"
                height="40"
              >
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-form>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
