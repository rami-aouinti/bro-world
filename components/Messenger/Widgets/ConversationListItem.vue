<template>
  <v-row>
    <v-col md="12">
      <div class="d-flex align-items-center">
        <v-avatar size="36" class="mb-1 mx-3">
          <NuxtImg
            width="48"
            height="48"
            :src="getConversationAvatar(conversation)"
            :alt="`Avatar ${conversation.id}`"
            cover
          />
        </v-avatar>
        <div>
          <div
            class="mb-1 text-subtitle-1 font-weight-bold"
          >
            {{ getConversationTitle(conversation) }}
          </div>
          <div
            class="text-caption"
          >
            {{ conversation.typing ? 'Typing…' : conversation.lastMessage || 'No message yet' }}
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import CompositeImage from '~/components/App/CompositeImage.vue'
import {truncate} from "~/utils/stringUtils";

const { user } = useUserSession()
const props = defineProps<{
  conversation: {
    type: Object,
    required: true
  },
  selectedId: String
}>()
const emit = defineEmits(['select'])
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
function getAvatars(conversation: any): string[] {
  const others = conversation.participants.filter(p => p.id !== user.id)
  if (others.length >= 3) {
    return ['/img/person.png', '/img/person.png']
  }
  if (others.length === 2) {
    return [others[0].avatar || '/img/person.png', others[1].avatar || '/img/person.png']
  }
  return [others[0]?.avatar || '/img/person.png']
}

function isOnline(conversation: any): boolean {
  return conversation.participants.some(p => p.online && p.id !== user.id)
}
</script>

<style scoped>
</style>
