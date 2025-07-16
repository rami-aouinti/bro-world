<template>
  <v-container fluid>
    <client-only>
      <teleport v-if="canTeleport" to="#menu-bar-world">
        <template v-if="loadConversation">
          <v-card class="pa-4" rounded="xl" variant="text">
            <v-skeleton-loader
              v-for="n in 4"
              :key="n"
              type="list-item-avatar"
              class="rounded-lg mb-2"
              height="60"
              elevation="0"
            />
          </v-card>
        </template>
        <ChatList
          v-else
          :conversations="conversations"
          @select="setActiveConversation"
        />
      </teleport>
    </client-only>
    <ChatWindow
      v-if="activeConversation"
      :conversation="activeConversation"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect, nextTick } from 'vue'
import ChatList from '~/components/Messenger/ChatList.vue'
import ChatWindow from '~/components/Messenger/ChatWindow.vue'
definePageMeta({
  layout: 'default',
  description: 'Messenger page',
  title: 'Messenger',
  meta: [
    { name: 'description', content: 'Chat with your friends and manage conversations.' },
    { name: 'keywords', content: 'messenger, chat, conversations' },
  ],
  head: {
    title: 'Messenger',
    meta: [
      { name: 'description', content: 'Chat with your friends and manage conversations.' },
      { name: 'keywords', content: 'messenger, chat, conversations' },
    ],
  },
  breadcrumb: 'disabled',
  scrollToTop: true,
})
const loadConversation = ref(true)
const conversations = ref<any[]>([])
const activeConversation = ref<any | null>(null)
const canTeleport = ref(false)
const setActiveConversation = (conv: any) => {
  activeConversation.value = conv
}

import { useMercureInbox } from '~/composables/useMercureInbox'

const updateConversationPreview = (message: any, convId: string) => {
  const conv = conversations.value.find(c => c.id === convId)
  if (!conv) return

  // mise à jour du contenu
  conv.lastMessage = message.content
  conv.typing = false // facultatif
  conv.updatedAt = message.createdAt

  // s’il est actif, tu peux ignorer (car ChatWindow s’en occupe)
  if (activeConversation.value?.id !== convId) {
    // notifier par son ou visuel
    playSound()
    // conv.unreadCount = (conv.unreadCount || 0) + 1 // facultatif
  }
}

const playSound = () => {
  const audio = new Audio('/sounds/new-message.mp3')
  audio.play().catch(() => {})
}


const fetchConversations = async () => {

  const data = await $fetch('/api/messenger/conversations')
  loadConversation.value = false

  if (data) {
    const unique = Array.from(new Map(Object.values(data).map((c: any) => [c.id, c])).values())
    conversations.value = unique.map(c => ({ ...c, loaded: true, unreadCount: 0 }))
    if (!activeConversation.value && unique.length > 0) {
      activeConversation.value = unique[0]
    }
    useMercureInbox(conversations, updateConversationPreview)
    // auto-select la première conversation
    if (!activeConversation.value && unique.length > 0) {
      activeConversation.value = unique[unique.length - 1]
    }
  }

}

// remplace le `watch` par `watchEffect` comme recommandé
watchEffect(async () => {
  if (loadConversation) {
    await fetchConversations()
  }
})
onMounted(async () => {
  window.scrollTo({ top: 0 })
  await fetchConversations
  await nextTick()
  canTeleport.value = !!document.getElementById('menu-bar-world')
})
</script>
