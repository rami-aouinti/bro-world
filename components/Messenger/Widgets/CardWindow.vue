<template>
  <v-sheet
    class="v-sheet--offset shadow-primary px-3 mx-3 border-radius-xl"
    elevation="12"
    max-width="calc(100% - 32px)"
    rounded="xl"
    color="primary"
  >
    <v-row>
      <v-col md="10">
        <div class="d-flex align-items-center">
          <GlowingAvatar :src="getConversationAvatar(conversation)" :size="56" :online="true" />
          <div class="ms-3">
            <h6 class="mb-0 text-h6 d-block">{{ getConversationTitle(conversation) }}</h6>
            <span class="text-sm opacity-8">last seen recently</span>
          </div>
        </div>
      </v-col>
      <v-col cols="1" class="my-auto">
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" size="18">mdi-video</v-icon>
          </template>
          <span>Video call</span>
        </v-tooltip>
      </v-col>
      <v-col cols="1" class="my-auto">
        <v-menu transition="slide-y-transition" offset-y offset-x min-width="150">
          <template #activator="{ props }">
            <v-btn variant="text" icon :ripple="false" v-bind="props" size="small">
              <v-icon size="18">mdi-cog</v-icon>
            </v-btn>
          </template>
          <v-list class="pa-2">
            <v-list-item v-for="item in ['Profile', 'Mute Conversation', 'Block', 'Clear Chat', 'Delete Chat']" :key="item">
              <v-list-item-title :class="item === 'Delete Chat' ? 'text-danger' : 'text-body'">{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const { user } = useUserSession()
import GlowingAvatar from "~/components/App/GlowingAvatar.vue";
import {truncate} from "~/utils/stringUtils";
const props = defineProps<{
  conversation: {
    type: Object,
    required: true
  }
}>()


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
</script>
<style>
.v-sheet--offset {
  z-index: 2;
  top: -55px;
  position: relative;
}
</style>
