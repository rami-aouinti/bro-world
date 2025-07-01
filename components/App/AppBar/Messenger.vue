<script setup lang="ts">
import { ref, onMounted, watch, mergeProps, computed } from 'vue'
import { useMercureInbox } from '~/composables/useMercureInbox'
import RelativeTime from "~/components/App/RelativeTime.vue"

const loadConversation = ref(true)
const conversations = ref<any[]>([])
const activeConversation = ref<any | null>(null)
const search = ref('')
const localePath = useLocalePath()
const path = ref('/inbox')
const pathMessenger = ref('/user/messenger/')

const isMercureReady = ref(false)

watch(isMercureReady, (ready) => {
  if (ready) {
    useMercureInbox(conversations, updateConversationPreview)
  }
})

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
        class="pa-1 list-item-hover-active d-flex align-center border-radius-md"
      >
        <v-row align="center" class="pa-0 ma-0">
          <!-- Avatar -->
          <v-col cols="auto">
            <v-avatar size="36" class="me-1">
              <NuxtImg
                width="36"
                height="36"
                :src="conversation?.avatar || '/img/person.png'"
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
              <RelativeTime :date="conversation?.createdAt" />
            </div>
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider />
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
