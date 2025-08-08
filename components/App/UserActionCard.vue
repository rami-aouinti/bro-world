<template>
  <Teleport to="body">
    <transition name="fade-slide">
      <div
        v-if="show"
        ref="actionRef"
        class="hover-card-wrapper"
        :style="cardStyle"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
      >
        <Arrow :placement="placeBelow ? 'top' : 'bottom'" />

        <v-card class="hover-card" width="250" rounded="xl" elevation="8">
          <v-list dense nav>
            <v-list-item @click="emit('favorite')">
              <v-list-item-title class="d-flex align-center">
                <v-icon class="me-2" size="20">mdi-star-outline</v-icon>
                Favoriten
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="emit('editList')">
              <v-list-item-title class="d-flex align-center">
                <v-icon class="me-2" size="20">mdi-account-multiple-outline</v-icon>
                Freundesliste bearbeiten
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="emit('unfollow')">
              <v-list-item-title class="d-flex align-center">
                <v-icon class="me-2" size="20">mdi-account-cancel-outline</v-icon>
                Nicht mehr folgen
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="emit('removeFriend')">
              <v-list-item-title class="d-flex align-center">
                <v-icon class="me-2" size="20">mdi-account-remove-outline</v-icon>
                Als Freund entfernen
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import Arrow from './Arrow.vue'

const props = defineProps<{
  trigger: HTMLElement | null
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'favorite'): void
  (e: 'editList'): void
  (e: 'unfollow'): void
  (e: 'removeFriend'): void
  (e: 'sendMessage'): void
}>()

const placeBelow = ref(true)
const cardStyle = ref<Record<string, string>>({})
const actionRef = ref<HTMLElement | null>(null)

function onEnter() {
  emit('hoverEnter') // pour garder la carte ouverte
}
function onLeave() {
  emit('hoverLeave') // pour déclencher une fermeture différée
}

onMounted(() => {
  nextTick(() => positionCard())
})

function positionCard() {
  const triggerEl = props.trigger
  const cardEl = actionRef.value
  if (!triggerEl || !cardEl) return

  const rect = triggerEl.getBoundingClientRect()
  const height = cardEl.offsetHeight
  const width = cardEl.offsetWidth

  placeBelow.value = window.innerHeight - rect.bottom > height + 20

  const top = placeBelow.value
    ? rect.bottom + 10 + window.scrollY
    : rect.top - height - 10 + window.scrollY

  const left = rect.left + rect.width / 2 - width / 2 + window.scrollX

  cardStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    position: 'absolute',
    zIndex: '9999'
  }
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.hover-card-wrapper {
  position: absolute;
  pointer-events: auto;
}
</style>
