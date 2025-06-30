<template>
  <v-row>
    <v-col md="12">
      <div class="d-flex align-items-center">
        <div>
          <div
            class="mb-1 text-subtitle-1 font-weight-bold"
          >
            {{ conversation.title || 'Untitled Chat' }}
          </div>
          <div
            class="text-caption"
          >
            {{ conversation.typing ? 'Typing…' : conversation.lastMessage || 'No message yet' }}
          </div>
        </div>
        <CompositeImage
          :avatars="getAvatars(conversation)"
          :isActive="selectedId === conversation.id"
          :isOnline="isOnline(conversation)"
          :size="56"
          :loading="!conversation.loaded"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import CompositeImage from '~/components/App/CompositeImage.vue'

const { user } = useUserSession()
const props = defineProps<{ conversation: any[] }>()
const emit = defineEmits(['select'])

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
