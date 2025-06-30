<template>
  <div class="pa-4">
    <v-form @submit.prevent="send">
      <v-text-field
        v-model="text"
        label="Type your message"
        append-inner-icon="mdi-send"
        @click:append-inner="send"
        rounded="xl"
        hide-details
        outlined
        dense
      />
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps<{ conversationId: string }>()
const emit = defineEmits(['sent'])
const { user } = await useUserSession()
const text = ref('')

const send = async () => {
  if (!text.value.trim()) return

  await useFetch(`/api/messenger/conversations/${props.conversationId}/create`, {
    method: 'POST',
    body: {
      sender: user.value.id,
      text: text.value,
    },
  })
  text.value = ''
  emit('sent')
}
</script>
