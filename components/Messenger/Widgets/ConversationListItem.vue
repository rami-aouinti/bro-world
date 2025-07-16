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
import { defineProps, defineEmits } from 'vue'
import { useConversationUtils } from '~/composables/useConversationUtils'

const { getConversationTitle, getConversationAvatar } = useConversationUtils()
const { user } = useUserSession()
const props = defineProps<{
  conversation: {
    type: Object,
    required: true
  },
  selectedId: String
}>()
const emit = defineEmits(['select'])
</script>

<style scoped>
</style>
