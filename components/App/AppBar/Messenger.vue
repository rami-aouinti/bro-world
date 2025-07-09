<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useMercureInbox } from '~/composables/useMercureInbox'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'
import { useConversationUtils } from '~/composables/useConversationUtils'

import ReusablePopoverList from '~/components/App/ReusablePopoverList.vue'
import RelativeTime from '~/components/App/RelativeTime.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const { getConversationTitle, getConversationAvatar } = useConversationUtils()
const { user } = useUserSession()

const conversations = ref<any[]>([])
const activeConversation = ref<any | null>(null)
const isMercureReady = ref(false)
const pathMessenger = ref('/user/messenger/')
const pathAllMessages = ref('/inbox')

function isOnline(conversation: any): boolean {
  return conversation.participants?.some(p => p.online && p.id !== user.value?.id) ?? false
}

function updateConversationPreview(message: any, convId: string) {
  const conv = conversations.value.find(c => c.id === convId)
  if (!conv) return
  conv.lastMessage = message.content
  conv.typing = false
  conv.updatedAt = message.createdAt

  if (activeConversation.value?.id !== convId) playSound()
}

function playSound() {
  const audio = new Audio('/sounds/new-message.mp3')
  audio.play().catch(() => {})
}

const fetchConversations = async () => {
  try {
    const data = await $fetch('/api/messenger/conversations')

    const unique = Array.from(new Map(Object.values(data).map((c: any) => [c.id, c])).values())
    conversations.value = unique.map(c => ({ ...c, loaded: true, unreadCount: 0 }))
    if (!activeConversation.value && unique.length > 0) {
      activeConversation.value = unique[0]
    }
    isMercureReady.value = true
  } catch (error) {
    console.error('Erreur fetchConversations:', error)
  }
}

onMounted(async () => {
  await fetchConversations()
})

watch(isMercureReady, (ready) => {
  if (ready) useMercureInbox(conversations, updateConversationPreview)
})

const totalUnread = computed(() =>
  conversations.value.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
)
</script>

<template>
  <ReusablePopoverList
    icon="mdi-message"
    :title="t('messages.title')"
    :items="conversations"
    :badge-count="totalUnread"
    :batch-size="4"
    :min-height="200"
    :empty-text="t('messages.empty')"
    :footer-url="localePath(pathAllMessages)"
    :footer-text="t('messages.all')"
    color="secondary"
  >
    <template #item="{ item }">
      <v-list-item
        :to="localePath(pathMessenger + item.id)"
        class="pa-1 list-item-hover-active d-flex align-center border-radius-md chat-list-item"
      >
        <template #append>
          <div v-if="isOnline(item)" class="mx-4 online-badge" />
          <div v-else class="mx-4 offline-badge" />
          <v-badge
            v-if="item.unreadCount > 0"
            :content="item.unreadCount"
            color="secondary"
            class="mx-2"
            overlap
          />
        </template>

        <v-row align="center" class="pa-0 ma-0">
          <v-col cols="auto">
            <v-avatar size="36" class="me-1">
              <NuxtImg
                width="36"
                height="36"
                :src="getConversationAvatar(item)"
                format="webp"
                :lazy-src="'/img/person.png'"
                :alt="`Avatar ${item.id}`"
                loading="lazy"
                cover
              />
            </v-avatar>
          </v-col>
          <v-col cols="auto">
            <h6 class="text-sm font-weight-normal text-typo mb-1">
              {{ getConversationTitle(item) }}
            </h6>
            <RelativeTime :date="item.createdAt" />
          </v-col>
        </v-row>
      </v-list-item>
    </template>
  </ReusablePopoverList>
</template>

<style scoped>
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
