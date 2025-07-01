<script setup lang="ts">
import { ref, onMounted, watch, mergeProps, computed } from 'vue'
import { useMercureInbox } from '~/composables/useMercureInbox'
import RelativeTime from "~/components/App/RelativeTime.vue"
import {truncate} from "~/utils/stringUtils";

const loadConversation = ref(true)
const conversations = ref<any[]>([])
const activeConversation = ref<any | null>(null)
const search = ref('')
const localePath = useLocalePath()
const path = ref('/inbox')
const pathMessenger = ref('/user/messenger/')
const { user } = useUserSession()
const isMercureReady = ref(false)

watch(isMercureReady, (ready) => {
  if (ready) {
    useMercureInbox(conversations, updateConversationPreview)
  }
})

function isOnline(conversation: any): boolean {
  return conversation.participants?.some(p => p.online && p.id !== user.value?.id) ?? false
}

const updateConversationPreview = (message: any, convId: string) => {
  const conv = conversations.value.find(c => c.id === convId)
  if (!conv) return

  conv.lastMessage = message.content
  conv.typing = false
  conv.updatedAt = message.createdAt

  if (activeConversation.value?.id !== convId) {
    playSound()
  }
}

const playSound = () => {
  const audio = new Audio('/sounds/new-message.mp3')
  audio.play().catch(() => {})
}

const fetchConversations = async () => {
  try {
    const data = await $fetch('/api/messenger/conversations')
    if (!Array.isArray(data)) return

    const unique = Array.from(new Map(data.map((c: any) => [c.id, c])).values())
    conversations.value = unique.map(c => ({ ...c, loaded: true, unreadCount: 0 }))

    if (!activeConversation.value && unique.length > 0) {
      activeConversation.value = unique[0]
    }

    isMercureReady.value = true
    loadConversation.value = false
  } catch (error) {
    console.error('Erreur fetchConversations:', error)
  }
}

function getConversationTitle(conversation: any): string {
  const participants = conversation?.participants ?? []

  if (participants.length > 2) {
    return conversation.title
  }

  if (participants.length === 2) {
    const other = participants.find(p => p.id !== user.value?.id)
    return truncate(other?.firstName + ' ' + other?.firstName  ?? conversation.title, 20)
  }

  // fallback
  return conversation.title
}

function getConversationAvatar(conversation: any): string {
  const participants = conversation?.participants ?? []

  if (participants.length > 2) {
    return '/img/person.png'
  }

  if (participants.length === 2) {
    const other = participants.find(p => p.id !== user.value?.id)
    return other?.avatar ?? '/img/person.png'
  }

  // fallback
  return '/img/person.png'
}

onMounted(fetchConversations)
</script>

<template>
  <v-menu location="bottom">
    <template #activator="{ props: menu }">
      <v-btn
        icon
        title="Messenger"
        aria-label="Messenger"
        v-bind="mergeProps(menu)"
        class="opacity-80 ml-0"
      >
        <v-badge
          v-if="conversations.length > 0"
          color="primary"
          :content="conversations.length"
        >
          <template #default>
            <v-icon>mdi-message</v-icon>
          </template>
        </v-badge>

        <v-icon v-else>mdi-message</v-icon>
      </v-btn>
    </template>

    <v-list class="pa-2">
      <v-list-item
        v-for="conversation in conversations"
        :key="conversation.id"
        :value="conversation.id"
        :to="localePath(pathMessenger + conversation.id)"
        class="pa-1 list-item-hover-active d-flex align-center border-radius-md chat-list-item"
      >
        <template #append>
          <div v-if="isOnline(conversation)" class="mx-4 online-badge" />
          <div v-else class="mx-4 offline-badge" />
          <v-badge
            v-if="conversation.unreadCount > 0"
            :content="conversation.unreadCount"
            color="secondary"
            class="mx-2"
            overlap
          />
        </template>
        <v-row align="center" class="pa-0 ma-0">
          <!-- Avatar -->
          <v-col cols="auto">
            <v-avatar size="36" class="me-1">
              <NuxtImg
                width="36"
                height="36"
                :src="getConversationAvatar(conversation)"
                :alt="`Avatar ${conversation.id}`"
                cover
              />
            </v-avatar>
          </v-col>
          <v-col cols="auto">
            <div>
              <h6 class="text-sm font-weight-normal text-typo mb-1">
                {{ getConversationTitle(conversation) }}
              </h6>
              <RelativeTime :date="conversation?.createdAt" />
            </div>
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider v-if="conversations.length > 0" />
      <v-list-item
        v-if="conversations.length > 0"
        :to="localePath(path)"
        class="pa-1 list-item-hover-active d-flex align-center justify-center text-center border-radius-md"
      >
        <h6 class="text-sm font-weight-normal text-typo mb-1">
          All Messages
        </h6>
      </v-list-item>
      <v-list-item
        v-else
        class="pa-1 list-item-hover-active d-flex align-center justify-center text-center border-radius-md"
      >
        <h6 class="text-sm font-weight-normal text-typo mb-1">
          No Message
        </h6>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<style scoped>
.chat-list-item {
  padding: 12px;
  margin-bottom: 8px;
  transition: background 0.3s ease, transform 0.2s;
  border-radius: 16px;
}

.chat-list-item:hover {
  transform: scale(1.01);
  background-color: rgba(255, 0, 128, 0.05);
}

.chat-list-item.v-list-item--active {
  background: var(--v-theme-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.online-badge {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4caf50;
  box-shadow: 0 0 4px #4caf50, 0 0 8px #4caf50;
  animation: onlinePulse 1.5s ease-in-out infinite;
}

.offline-badge {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e00a1e;
  box-shadow: 0 0 4px #c51616, 0 0 8px #e00a1e;
  animation: onlinePulse 1.5s ease-in-out infinite;
}

@keyframes onlinePulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.4);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}
</style>
