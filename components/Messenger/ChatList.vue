<template>
  <v-card
    class="pt-12 px-1 shadow-blur fade-in overflow-visible"
    style="margin-top: 20px;"
    max-height="520"
    rounded="xl"
    variant="text"
  >
    <v-sheet
      class="v-sheet--offset shadow-primary px-3 mx-3 border-radius-xl"
      elevation="12"
      max-width="calc(100% - 32px)"
      rounded="xl"
      color="primary"
    >
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-items-center text-center">
            <v-autocomplete
              :search="search"
              v-model="friends"
              :items="filteredConversations"
              color="blue-grey-lighten-2"
              item-title="name"
              item-value="name"
              label="Search contact"
              rounded="xl"
              chips
              density="compact"
              closable-chips
              multiple
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="item.raw.avatar"
                  :text="item.raw.title"
                ></v-chip>
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="item.raw.avatar"
                  :subtitle="item.raw.group"
                  :title="item.raw.title"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <v-list
      v-model:selected="selectedId"
      style="height: 380px; background-color: transparent; overflow-x: hidden;"
    >
      <v-list-item
        v-for="conversation in filteredConversations"
        :key="conversation.id"
        :value="conversation.id"
        @click="selectConversation(conversation)"
        class="chat-list-item"
        rounded="xl"
      >
        <template #append>
          <div v-if="isOnline(conversation)" class="online-badge" />
          <div v-else class="offline-badge" />
          <v-badge
            v-if="conversation.unreadCount > 0"
            :content="conversation.unreadCount"
            color="secondary"
            class="mx-2"
            overlap
          />
        </template>

        <!-- Contenu principal -->
        <ConversationListItem :conversation="conversation" />
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue'
import ConversationListItem from '~/components/Messenger/Widgets/ConversationListItem.vue'

const { user } = useUserSession()

const props = defineProps<{
  conversations: any[] // ✅ conversations (au pluriel)
}>()

const emit = defineEmits(['select'])

const friends = ref([])
const selectedId = ref<string | null>(null)
const search = ref('')

const filteredConversations = computed(() =>
  props.conversations?.filter((c) =>
    c.title?.toLowerCase().includes(search.value.toLowerCase())
  ) ?? []
)

function selectConversation(conversation: any) {
  selectedId.value = conversation.id
  emit('select', conversation)
}

function isOnline(conversation: any): boolean {
  return conversation.participants?.some(p => p.online && p.id !== user.value?.id) ?? false
}
</script>

<style scoped>
.v-sheet--offset {
  z-index: 2;
  top: -55px;
  position: relative;
}

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
