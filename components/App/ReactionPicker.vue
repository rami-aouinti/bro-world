<script setup lang="ts">
import { reactions } from '@/utils/reactions'

const emit = defineEmits(['select'])
const props = defineProps({
  size: {
    type: Number,
    required: false,
    default: () => 26,
  },
})
function onSelect(reaction: string) {
  emit('select', reaction)
}

const openReact = shallowRef(false)
const fabPosition = shallowRef('absolute')
const menuLocation = shallowRef('top left')
const fabLocation = shallowRef('right center')
const transition = shallowRef('slide-x-reverse-transition')

watch(menuLocation, reopen)
watch(transition, reopen)
watch(fabLocation, () => openReact.value = false)
watch(fabPosition, () => openReact.value = false)

function reopen () {
  openReact.value = false
  setTimeout(() => openReact.value = true, 400)
}
</script>

<template>
  <v-fab
    :key="fabPosition"
    :absolute="fabPosition === 'absolute'"
    :app="fabPosition === 'fixed'"
    :color="openReact ? '' : 'primary'"
    :location="fabLocation"
    :size="size"
    icon
  >
    {{ openReact ? 'mdi-close' : '😊' }}
    <v-speed-dial
      v-model="openReact"
      :location="menuLocation"
      :transition="transition"
      activator="parent">
      <v-btn
        v-for="reaction in reactions"
        :key="reaction.name"
        :size="size"
        variant="text"
        @click="onSelect(reaction.name)"
        :color="reaction.color"
        icon>
        {{ reaction.icon }}
      </v-btn>
    </v-speed-dial>
  </v-fab>
  <v-hover v-slot="{ isHovering, props }">
    <div v-bind="props" class="d-inline-block">
      <v-btn icon size="x-small" class="mx-1">
        😊
      </v-btn>
      <v-slide-y-reverse-transition>
        <div
          v-if="isHovering"
          class="pa-2 d-flex rounded elevation-3"
          style="position: absolute; z-index: 1006"
        >
          <v-speed-dial
            :location="menuLocation"
            :transition="transition"
            activator="parent">
            <v-btn
              v-for="reaction in reactions"
              :key="reaction.name"
              :size="size"
              variant="text"
              @click="onSelect(reaction.name)"
              :color="reaction.color"
              icon>
              {{ reaction.icon }}
            </v-btn>
          </v-speed-dial>
        </div>
      </v-slide-y-reverse-transition>
    </div>
  </v-hover>
</template>
