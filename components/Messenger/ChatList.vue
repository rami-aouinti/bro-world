<template>
  <v-card class="pa-4" rounded="xl" variant="text" max-height="600">
    <v-text-field
      v-model="search"
      label="Search contact"
      density="compact"
      hide-details
      rounded
      prepend-inner-icon="mdi-magnify"
      class="mb-2"
    />

    <v-list style="height: 400px; background-color: transparent">
      <v-list-item-group v-model="selectedId" color="primary">
        <v-list-item
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          :value="conversation.id"
          @click="selectConversation(conversation)"
          class="chat-list-item"
          rounded="xl"
        >
          <template #default>
            <v-list-item-content>
              <v-row>
                <v-col md="12">
                  <v-list-item-title class="text-subtitle-1 font-weight-bold">
                    {{ conversation.title || 'Untitled Chat' }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    {{ conversation.typing ? 'Typing…' : conversation.lastMessage || 'No message yet' }}
                  </v-list-item-subtitle>
                  <div class="d-flex align-items-center">
                    <CompositeImage
                      :avatars="getAvatars(conversation)"
                      :isActive="selectedId === conversation.id"
                      :isOnline="isOnline(conversation)"
                      :size="48"
                      :loading="!conversation.loaded"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue'
import CompositeImage from '~/components/App/CompositeImage.vue'

const { user } = useUserSession()
const props = defineProps<{ conversations: any[] }>()
const emit = defineEmits(['select'])

const selectedId = ref<string | null>(null)
const search = ref('')

const filteredConversations = computed(() =>
  props.conversations.filter((c) =>
    c.title?.toLowerCase().includes(search.value.toLowerCase())
  )
)

function selectConversation(conversation: any) {
  selectedId.value = conversation.id
  emit('select', conversation)
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

.chat-list-item.v-item--active {
  background: linear-gradient(to right, #d61e5b, #e24993);
  color: white;
  box-shadow: 0 4px 12px rgba(214, 30, 91, 0.5);
}

.chat-list-item.v-item--active .v-list-item-title,
.chat-list-item.v-item--active .v-list-item-subtitle {
  color: white !important;
}
</style>
