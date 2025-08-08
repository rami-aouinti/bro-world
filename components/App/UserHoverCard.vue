<template>
  <div
    ref="triggerRef"
    class="trigger-area"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <slot />

    <Teleport to="body">
      <transition name="fade-slide">
        <div
          v-if="show"
          ref="cardRef"
          class="hover-card-wrapper"
          :style="cardStyle"
          @mouseenter="cancelHide"
          @mouseleave="scheduleHide"
        >
          <Arrow :placement="placeBelow ? 'top' : 'bottom'" />

          <v-card class="hover-card" width="250" rounded="xl" elevation="8">
            <v-card-text class="text-center pb-0">
              <div class="d-flex align-center">
                <a :href="props.author?.username === user?.username ? '/profile' : `/user/${props.author.username}`">
                  <UserAvatar :user="props.author" color="primary" size="48" />
                </a>
                <div class="mx-4 text-start">
                  <NuxtLink
                    :to="props.author?.username === user?.username ? localePath('/profile') : localePath(`/user/${props.author.username}`)"
                    class="font-weight-bolder text-decoration-none"
                    :class="isDark ? 'text-white' : 'text-default'"
                  >
                    {{ props.author?.firstName }} {{ props.author?.lastName }}
                  </NuxtLink>
                  <p class="text-xs text-medium-emphasis">
                    {{ props.author?.followerCount }} followers
                  </p>
                </div>
              </div>

              <div class="d-flex justify-center gap-2 mt-2">
                <v-btn icon size="small" variant="text" @click="toggleActions">
                  <v-icon>mdi-account-multiple</v-icon>
                </v-btn>
                <v-btn icon size="small" variant="text" @click="goToMessenger">
                  <v-icon>mdi-message-text-outline</v-icon>
                </v-btn>
                <v-btn icon size="small" variant="text" @click="toggleReports">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </transition>

      <UserActionCard
        v-if="showActions"
        :trigger="actionTrigger"
        :show="showActions"
        @hoverEnter="cancelHide"
        @hoverLeave="scheduleHide"
        @favorite="onAction('favorite')"
        @editList="onAction('editList')"
        @unfollow="onAction('unfollow')"
        @removeFriend="onAction('removeFriend')"
        @sendMessage="goToMessenger"
      />

      <UserReportCard
        v-if="showReports"
        :trigger="actionTrigger"
        :show="showReports"
        @hoverEnter="cancelHide"
        @hoverLeave="scheduleHide"
        @favorite="onAction('favorite')"
        @editList="onAction('editList')"
        @unfollow="onAction('unfollow')"
        @removeFriend="onAction('removeFriend')"
        @sendMessage="goToMessenger"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Arrow from './Arrow.vue'
import UserAvatar from '~/components/App/UserAvatar.vue'
import UserActionCard from './UserActionCard.vue'
import UserReportCard from './UserReportCard.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'
const { t } = useI18n()
const localePath = useLocalePath()

const props = defineProps<{
  author: {
    firstName: string
    lastName: string
    photo?: string
    followerCount?: number
    id: string
    username: string
  }
}>()

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')

const router = useRouter()
const { user } = await useUserSession()

const show = ref(false)
const showActions = ref(false)
const showReports = ref(false)
const placeBelow = ref(true)
const triggerRef = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)
const cardStyle = ref<Record<string, string>>({})
const actionTrigger = ref<HTMLElement | null>(null)

const hoverDelay = 150
let showTimeout: ReturnType<typeof setTimeout> | null = null
let hideTimeout: ReturnType<typeof setTimeout> | null = null

function onEnter() {
  clearTimeout(hideTimeout)
  showTimeout = setTimeout(() => {
    show.value = true
    nextTick(() => positionCard())
  }, hoverDelay)
}

function onLeave() {
  clearTimeout(showTimeout)
  scheduleHide()
}

function cancelHide() {
  clearTimeout(hideTimeout)
}

function scheduleHide() {
  hideTimeout = setTimeout(() => {
    show.value = false
    showActions.value = false
    showReports.value = false
  }, 200)
}

function toggleActions(event: MouseEvent) {
  cancelHide()
  actionTrigger.value = event.currentTarget as HTMLElement
  showReports.value = false
  showActions.value = !showActions.value
}

function toggleReports(event: MouseEvent) {
  cancelHide()
  actionTrigger.value = event.currentTarget as HTMLElement
  showActions.value = false
  showReports.value = !showReports.value
}

function onAction(type: string) {
  console.log('Action:', type)
  showActions.value = false
  showReports.value = false
}

function goToMessenger() {
  router.push(`/inbox/${props.author.id}`)
  showActions.value = false
  showReports.value = false
}

function positionCard() {
  const triggerEl = triggerRef.value
  const cardEl = cardRef.value
  if (!triggerEl || !cardEl) return

  const triggerRect = triggerEl.getBoundingClientRect()
  const cardHeight = cardEl.offsetHeight
  const cardWidth = cardEl.offsetWidth
  const spaceBelow = window.innerHeight - triggerRect.bottom
  const scrollY = window.scrollY || document.documentElement.scrollTop
  const scrollX = window.scrollX || document.documentElement.scrollLeft

  placeBelow.value = spaceBelow > cardHeight + 20

  const top = placeBelow.value
    ? triggerRect.bottom + 10 + scrollY
    : triggerRect.top - cardHeight - 10 + scrollY

  const left = triggerRect.left + (triggerRect.width / 2) - (cardWidth / 2) + scrollX

  cardStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    position: 'absolute',
    zIndex: '9999'
  }
}

onMounted(() => {
  document.addEventListener('scroll', positionCard)
  window.addEventListener('resize', positionCard)
})

onUnmounted(() => {
  document.removeEventListener('scroll', positionCard)
  window.removeEventListener('resize', positionCard)
  clearTimeout(showTimeout!)
  clearTimeout(hideTimeout!)
})
</script>

<style scoped>
.trigger-area {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
}

.hover-card-wrapper {
  position: absolute;
  pointer-events: auto;
  z-index: 9999;
}

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
</style>
