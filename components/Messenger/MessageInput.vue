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
        ref="textFieldRef"
      />
      <!-- Zone invisible pour intercepter le collage -->
      <textarea
        ref="pasteCatcher"
        class="d-none"
        @paste="handlePaste"
      ></textarea>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ conversationId: string }>()
const emit = defineEmits(['sent'])
const { user } = await useUserSession()
const text = ref('')
const pasteCatcher = ref<HTMLTextAreaElement | null>(null)
const textFieldRef = ref()

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

// Interception de l’image collée
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items || []
  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      if (!file) return
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string

        // Envoie l’image encodée en base64 comme message
        await useFetch(`/api/messenger/conversations/${props.conversationId}/create`, {
          method: 'POST',
          body: {
            sender: user.value.id,
            image: base64,
          },
        })

        emit('sent')
      }
      reader.readAsDataURL(file)
      event.preventDefault()
      break
    }
  }
}

// Active le piège à paste même si clic droit dans le champ
onMounted(() => {
  const input = textFieldRef.value?.$el?.querySelector('input')
  if (!input) return

  input.addEventListener('paste', (e: ClipboardEvent) => {
    if (pasteCatcher.value) {
      pasteCatcher.value.focus()
      handlePaste(e)
    }
  })
})
</script>

<style scoped>
.d-none {
  position: absolute;
  left: -9999px;
}
</style>
