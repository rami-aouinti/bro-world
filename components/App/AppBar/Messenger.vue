<script setup lang="ts">
import { ref, onMounted, watch, mergeProps, computed } from 'vue'
import { useMercureInbox } from '~/composables/useMercureInbox'
import RelativeTime from "~/components/App/RelativeTime.vue"

const loadConversation = ref(true)
const conversations = ref<any[]>([])
const activeConversation = ref<any | null>(null)
const selectedId = ref<string | null>(null)
const search = ref('')

// ✅ Abonne à Mercure dès que conversations sont chargées
const isMercureReady = ref(false)
watch(isMercureReady, (ready) => {
  if (ready) {
    useMercureInbox(conversations, updateConversationPreview)
  }
})

const setActiveConversation = (conv: any) => {
  activeConversation.value = conv
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
    const { data, error } = await $fetch('/api/messenger/conversations')

    if (error.value) {
      console.error('Erreur API:', error.value)
      return
    }

    if (data.value) {
      const unique = Array.from(
        new Map(data.value.map((c: any) => [c.id, c])).values()
      )
      conversations.value = unique.map(c => ({ ...c, loaded: true, unreadCount: 0 }))

      if (!activeConversation.value && unique.length > 0) {
        activeConversation.value = unique[0]
      }

      isMercureReady.value = true
      loadConversation.value = false
    }
  } catch (e) {
    console.error('Erreur fetchConversations:', e)
  }
}

function selectConversation(conversation: any) {
  selectedId.value = conversation.id
  setActiveConversation(conversation)
}

// ✅ déclenche uniquement une fois, au montage
onMounted(fetchConversations)

const lastMessages = [
  {
    avatar: '/img/bruce-mars.jpg',
    message: 'Check new messages',
    time: '13 minutes ago',
  },
  {
    avatar: '/img/bruce-mars.jpg',
    message: 'Manage podcast session',
    time: '1 day ago',
  },
  {
    avatar: '/img/bruce-mars.jpg',
    message: 'Payment successfull..',
    time: '2 days ago',
  },
]
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
          v-if="lastMessages.length > 0"
          color="primary"
          :content="lastMessages.length"
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
        @click="selectConversation(conversation)"
        class="pa-3 list-item-hover-active d-flex align-center border-radius-md"
      >
        <v-row align="center" class="pa-0 ma-0">
          <!-- Avatar -->
          <v-col cols="auto">
            <v-avatar size="36" class="me-1">
              <NuxtImg
                width="36"
                height="36"
                :src="conversation?.avatar"
                :alt="`Avatar ${conversation.id}`"
                cover
              />
            </v-avatar>
          </v-col>
          <v-col cols="auto">
            <div>
              <h6 class="text-sm font-weight-normal text-typo mb-1">
                {{ conversation.title }}
              </h6>
              <RelativeTime :date="conversation.createdAt" />
            </div>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
