<template>
  <v-card
    class="pt-12 px-1 shadow-blur fade-in overflow-visible"
    style="margin-top: 20px;"
    max-height="510"
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
            <v-combobox
              v-model="selectedUsers"
              v-model:search="search"
              :items="users"
              item-title="title"
              item-value="id"
              color="blue-grey-lighten-2"
              hide-selected
              hide-details
              rounded="xl"
              chips
              clearable
              density="compact"
              label="Search contact"
              variant="solo"
              :custom-filter="customFilter"
            >
              <!-- Affichage des chips sélectionnées -->
              <template v-slot:chip="{ item, props }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="item.raw?.profile?.photo ?? 'https://placehold.net/avatar-5.svg'"
                  :text="item.raw?.firstName + ' ' + item.raw?.lastName"
                />
              </template>

              <!-- Affichage des résultats de recherche -->
              <template v-slot:item="{ item, props }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="item.raw?.profile?.photo ?? 'https://placehold.net/avatar-5.svg'"
                  :title="item.raw?.firstName + ' ' + item.raw?.lastName"
                  @click="handleSelect(item.raw)"
                />
              </template>
            </v-combobox>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Liste des conversations -->
    <v-list
      v-model:selected="selectedId"
      class="d-none d-md-block"
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
        <ConversationListItem :selectedId="selectedId" :conversation="conversation" />
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch, onMounted } from 'vue'
import ConversationListItem from '~/components/Messenger/Widgets/ConversationListItem.vue'
const { user } = await useUserSession()

const props = defineProps<{
  conversations: any[]
}>()

const emit = defineEmits(['select'])
import { useConversationUtils } from '~/composables/useConversationUtils'
import {useUserStore} from "~/stores/admin/user/userStore";
const users = ref<any[]>([])
const { getConversationTitle, getConversationAvatar } = useConversationUtils()
const selectedUsers = ref<any[]>([])
const selectedId = ref<string | null>(null)
const search = ref('')
const userStore = useUserStore()
// Recherche personnalisée (empêche création d’élément inconnu)
function customFilter(itemTitle: string, query: string, item: any) {
  return itemTitle.toLowerCase().includes(query.toLowerCase())
}

// Conversations filtrées par recherche
const filteredConversations = computed(() =>
  props.conversations?.filter((c) =>
    c.title?.toLowerCase().includes(search.value.toLowerCase())
  ) ?? []
)

// Lorsqu'un utilisateur est sélectionné
function handleSelect(user: any) {
  selectedUsers.value = user
  search.value = ''
  createConversation(user)
}


const loading = ref(true)

async function createConversation(participant: any) {

  const newConversation = await $fetch(`/api/messenger/conversations/create`, {
    method: 'POST',
    body: JSON.stringify({
      title: 'nothing',
      isGroup: false,
      participants: [`${user.value.id}`, `${participant.id}`],
    }),
  })

  if (newConversation) {
    selectConversation(newConversation)
  }
}


// Sélection d’une conversation
function selectConversation(conversation: any) {
  selectedId.value = conversation.id
  emit('select', conversation)
}

async function fetchUsers() {
  try {
    const data = await userStore.fetchUsers()
    if (data) {
      users.value = data
    }
    loading.value = false
  } catch (e) {
    console.error('Erreur lors de la récupération des utilisateurs :', e)
  }
}

watch(loading, () => {
  fetchUsers()
}, { immediate: true })
onMounted(fetchUsers)
// Vérifie si un participant est en ligne (hors utilisateur actuel)
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
