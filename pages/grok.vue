<script lang="ts" setup>
const userMessage = ref('')
const answer = ref('')
const { askGroq } = useGroq()

const send = async () => {
  answer.value = await askGroq(userMessage.value)
}
</script>

<template>
  <v-textarea v-model="userMessage" label="Pose une question" />
  <v-btn @click="send">Envoyer</v-btn>
  <div v-if="answer">Réponse : {{ answer }}</div>
</template>
