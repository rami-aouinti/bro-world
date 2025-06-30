<template>
  <template v-if="conversationLoaded">
    <v-col cols="12">
      <v-skeleton-loader
        type="card-avatar"
        class="pt-8 px-1 shadow-blur fade-in"
        height="450"
        rounded="xl"
        elevation="1"
        color="pink-lighten-4"
      />
    </v-col>
  </template>

  <v-card
    v-else
    class="pt-12 px-1 shadow-blur fade-in overflow-visible"
    style="margin-top: 20px;"
    max-height="520"
    rounded="xl"
    variant="text"
  >
    <CardWindow :conversation="conversation" />
    <!-- Loader lors de l'envoi -->
    <v-progress-linear v-if="sendingMessage" indeterminate color="primary" height="2" class="mt-n4" />

    <!-- Messages -->
    <div
      ref="messageContainer"
      class="overflow-y-auto px-2 pt-2"
      style="height: 300px;  overflow-x: hidden;"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <v-row
        v-if="messages?.length > 0"
        v-for="message in messages"
        :key="message.id"
        :class="{
          'justify-end text-end': message?.sender?.id === user.id,
          'justify-start text-start': message?.sender?.id !== user.id
        }"
      >
        <v-col md="10">
          <div
            class="d-flex align-items-center"
            :class="{
              'flex-row-reverse': message?.sender?.id === user.id,
              'flex-row': message?.sender?.id !== user.id
            }"
          >
            <div class="px-4">
              <GlowingAvatar
                :src="message?.sender?.avatar ?? '/img/person.png'"
                :size="46"
                class="shrink-0 py-3"
                :online="true"
              />
              <div
                class="mb-1 text-caption font-weight-bold"
              >
                {{ message?.sender?.firstName || 'Unknown' }} {{ message?.sender?.lastName || '' }}
              </div>
            </div>

            <div class="mx-3" style="max-width: 75%">
              <v-card
                variant="text"
                :class="[
                  message?.sender?.id === user.id
                    ? 'bg-gradient-secondary glow-message'
                    : 'bg-gradient-primary glow-message',
                  'pa-3 mb-3'
                ]"
                rounded="xl"
              >
                <p v-if="message?.text" class="mb-2">{{ message?.text }}</p>

                <v-img
                  v-if="message.mediaUrl && !message.text"
                  :src="message.mediaUrl"
                  class="rounded-lg mb-2"
                  width="200"
                  eager
                  :lazy-src="'/img/loading.svg'"
                ></v-img>

                <NuxtImg
                  v-else-if="message.mediaUrl"
                  :src="message.mediaUrl"
                  width="200"
                  class="rounded-lg mb-2"
                  :placeholder="'/img/loading.svg'"
                />
                <RelativeTime :date="message?.createdAt" />
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
      <div ref="bottomAnchor" />
    </div>

    <MessageInput :conversationId="conversation.id" @sent="onSent" />
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps, nextTick, computed, watchEffect } from 'vue'
import MessageInput from './MessageInput.vue'
import GlowingAvatar from '~/components/App/GlowingAvatar.vue'
import { useTheme } from 'vuetify'

const { user } = useUserSession()
const props = defineProps<{ conversation: any }>()

const messages = ref<any[]>([])
const conversationLoaded = ref(true)
const bottomAnchor = ref<HTMLElement | null>(null)
const sendingMessage = ref(false)

const playSound = () => {
  const audio = new Audio('/sounds/new-message.mp3')
  audio.play().catch(() => {})
}


import { useMercureConversation } from '~/composables/useMercureConversation'
import Social from "~/components/Auth/Social.vue";
import RelativeTime from "~/components/App/RelativeTime.vue";
import CardWindow from "~/components/Messenger/Widgets/CardWindow.vue";

const conversationId = computed(() => props.conversation?.id ?? null)
useMercureConversation(conversationId, (newMessage) => {
  const message = {
    sender: {
      firstName: newMessage.title || 'Unknown',
      avatar: newMessage.subtitle || '/img/person.png',
      id: newMessage?.sender?.id || '111111111111111',
    },
    text: newMessage?.content || '',
    createdAt: newMessage?.createdAt,
    mediaUrl: newMessage?.mediaUrl || null,
  }
  messages.value.push(message)
  scrollToBottom()
  playSound()
})



const fetchMessages = async () => {
  const { data, error } = await useFetch(`/api/messenger/conversations/${props.conversation.id}/messages`)
  if (error.value) {
    console.error('Erreur fetch :', error.value)
  } else {
    messages.value = data.value
    conversationLoaded.value = false
  }
}

const formatTime = (datetime: string) => new Date(datetime).toLocaleTimeString()

const scrollToBottom = async () => {
  await nextTick()
  bottomAnchor.value?.scrollIntoView({ behavior: 'auto' })
}

const onSent = async () => {
  sendingMessage.value = true
  await fetchMessages()
  await scrollToBottom()
  sendingMessage.value = false
}

const onDrop = async (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files?.length) {
    const file = files[0]
    console.log('Dropped file:', file)
  }
}

watchEffect(async () => {
  if (props.conversation) {
    conversationLoaded.value = true
    await fetchMessages()
    await scrollToBottom()
  }
})

watch(messages, async (newVal, oldVal) => {
  if (newVal?.length > oldVal?.length) playSound()
  await scrollToBottom()
})

onMounted(async () => {
  await fetchMessages()
  await scrollToBottom()
})

const { current } = useTheme()

const computedGlow = computed(() => {
  const primary = current.value.colors.primary || '#e91e63'
  return `radial-gradient(circle, ${primary} 0%, transparent 70%)`
})
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glow-message {
  animation: glowPulse 1.5s ease-in-out infinite alternate;
  box-shadow:
    0 0 10px rgba(150, 6, 90, 0.6),
    0 0 20px rgba(150, 6, 90, 0.5),
    0 0 30px rgba(150, 6, 90, 0.4);
}

@keyframes glowPulse {
  from {
    box-shadow:
      0 0 5px rgba(126, 87, 194, 0.4),
      0 0 10px rgba(126, 87, 194, 0.3),
      0 0 15px rgba(126, 87, 194, 0.2);
  }
  to {
    box-shadow:
      0 0 10px rgba(126, 87, 194, 0.8),
      0 0 20px rgba(126, 87, 194, 0.6),
      0 0 30px rgba(126, 87, 194, 0.4);
  }
}
</style>
