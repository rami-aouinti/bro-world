<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'

import UserAvatar from '~/components/App/UserAvatar.vue'
import Comments from '~/pages/home/post/Comments.vue'
import NewComment from '~/pages/home/post/NewComment.vue'
import CommentComment from '~/pages/home/post/CommentComment.vue'
import ReactionPickerComment from '~/components/App/ReactionPickerComment.vue'

import { usePostStore } from '~/stores/usePostStore'

// Store + util
const postStore = usePostStore()
const localePath = useLocalePath()
const { t } = useI18n()
const { user, loggedIn } = await useUserSession()

// Props
const props = defineProps<{
  comment: any,
  friends: any
}>()

// UI state
const showLikesModal = ref(false)
const showPicker = ref(false)
const pickerPosition = ref<'left' | 'right'>('left')
const reactionContainerComment = ref<HTMLElement | null>(null)
const pickerStyle = ref<Record<string, string>>({})

const activeTab = ref('')
const showReplies = ref(false)
const showNewComment = ref(false)
const emit = defineEmits(['post-reload'])

// Liste des réponses visibles dans la UI
const comments = ref<Array<any>>(props.comment?.comments_preview ?? [])
const loading = ref(false)

// Pagination des réponses du commentaire
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const hasMore = computed(() => comments.value.length < total.value)

// Positionnement du picker
function updatePickerStyle() {
  if (!reactionContainerComment.value) return
  const rect = reactionContainerComment.value.getBoundingClientRect()
  pickerStyle.value = {
    position: 'absolute',
    top: `${rect.top + window.scrollY - 10}px`,
    left: `${rect.left + window.scrollX}px`,
    zIndex: 9999,
  }
}
function checkPickerPosition() {
  nextTick(() => {
    if (!reactionContainerComment.value) return
    const rect = reactionContainerComment.value.getBoundingClientRect()
    pickerPosition.value = (window.innerWidth - rect.right < 220) ? 'right' : 'left'
  })
}

/** ===== Réactions ===== */

const localLikes = ref<{ [key: string]: any[] }>(
  (props.comment.reactions_preview || []).reduce((acc: Record<string, any[]>, r: any) => {
    (acc[r.type] ||= []).push(r)
    return acc
  }, {})
)

function getEmoji(type: string) {
  return { like: '👍', love: '❤️', haha: '😂', wow: '😮', sad: '😢', angry: '😡' }[type] || '👍'
}
function getColor(type: string) {
  return {
    like: 'primary',
    love: 'red',
    haha: 'yellow-darken-2',
    wow: 'blue',
    sad: 'cyan-darken-2',
    angry: 'deep-orange'
  }[type] || 'grey'
}

const topReactions = computed(() => {
  return Object.entries(localLikes.value)
    .map(([type, list]) => ({ type, count: list.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
})

async function loadLikes() {
  showLikesModal.value = true
  let data: { reactions?: Array<{ type: string }> } = {}

  try {
    data = loggedIn.value
      ? await postStore.fetchReact(props.comment.id)
      : await postStore.fetchPublicReact(props.comment.id)

    const grouped: Record<string, any[]> = {}
    for (const reaction of data.reactions ?? []) {
      if (!reaction.type) continue
      (grouped[reaction.type] ||= []).push(reaction)
    }

    localLikes.value = grouped
    activeTab.value = Object.keys(grouped)[0] || ''
  } catch (error) {
    console.error('Failed to load likes:', error)
    localLikes.value = {}
    activeTab.value = ''
  }
}

async function handleReact(type: string) {
  if (!loggedIn.value) return Notify.error('You are not logged')

  try {
    // Optimistic UI
    for (const key in localLikes.value) {
      localLikes.value[key] = localLikes.value[key].filter(r => r.user?.id !== user.value.id)
    }
    ;(localLikes.value[type] ||= []).push({ id: Date.now(), type, user: user.value })
    props.comment.reactions_count++
    props.comment.isReacted = type
    Notify.success(`You reacted with ${type}`, user.value?.photo, `/post/${props.comment.comment}`)

    await postStore.invalidateReactCache(props.comment.id)
    await $fetch(`/api/posts/${props.comment.id}/react/${type}`, { method: 'POST' })
    emit('post-reload')
  } catch (err) {
    Notify.error('Error: ' + err)
  }
}
const handleLike = async () => handleReact('like')

/** ===== Réponses (pagination) ===== */

async function loadMoreReplies() {
  if (loading.value) return
  loading.value = true
  try {
    // ⚠️ Cette méthode doit renvoyer { comments: any[], total: number }
    const res = await postStore.fetchCommentReplies(props.comment.id, {
      page: page.value,
      limit: limit.value
    })

    if (page.value === 1 && Array.isArray(props.comment?.comments_preview) && props.comment.comments_preview.length) {
      const previewIds = new Set(props.comment.comments_preview.map((c: any) => c.id))
      const newOnes = (res.comments ?? []).filter((c: any) => !previewIds.has(c.id))
      comments.value = [...(props.comment.comments_preview ?? []), ...newOnes]
    } else {
      comments.value.push(...(res.comments ?? []))
    }

    total.value = Number(res.total ?? comments.value.length)
    page.value += 1
  } catch (e) {
    console.error('loadMoreReplies error:', e)
  } finally {
    loading.value = false
  }
}

watch(showReplies, (open) => {
  if (open && page.value === 1) {
    loadMoreReplies()
  }
})

const reloadComments = async (data: any) => {
  showReplies.value = true
  comments.value.unshift(data.value)
  total.value += 1
  emit('post-reload')
}

/** ===== Lifecycle ===== */
onMounted(() => {
  window.addEventListener('resize', checkPickerPosition)
  window.addEventListener('scroll', updatePickerStyle)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkPickerPosition)
  window.removeEventListener('scroll', updatePickerStyle)
})
</script>

<template>
  <v-row>
    <v-col cols="6">
      <div class="d-flex justify-start mx-2">
        <div
          ref="reactionContainerComment"
          v-if="loggedIn"
          @mouseenter="showPicker = true; checkPickerPosition(); updatePickerStyle()"
          @mouseleave="showPicker = false"
        >
          <v-icon
            v-if="!props.comment.isReacted"
            size="18"
            class="flex-grow-1 cursor-pointer"
            color="default"
            @click="handleLike"
            icon="mdi-thumb-up-outline"
          />
          <span v-else class="cursor-pointer emoji-badge">{{ getEmoji(props.comment.isReacted) }}</span>

          <transition name="fade-scale" appear>
            <teleport to="body">
              <div
                v-if="showPicker"
                class="reaction-picker-float-comment"
                :style="pickerStyle"
                @mouseenter="showPicker = true"
                @mouseleave="showPicker = false"
              >
                <ReactionPickerComment
                  :selectedReact="props.comment.isReacted"
                  v-show="showPicker"
                  :class="['reaction-picker-float-comment', pickerPosition]"
                  @select="(type) => handleReact(type)"
                />
              </div>
            </teleport>
          </transition>
        </div>

        <div v-if="props.comment.reactions_count > 0" class="d-flex align-center me-2" style="margin-top: -3px;">
          <span v-if="topReactions.length" class="reaction-badges">
            <span v-for="r in topReactions" :key="r.type" class="emoji-badge">{{ getEmoji(r.type) }}</span>
          </span>

          <span
            v-if="props.comment.reactions_count > 0 && !loading"
            class="text-sm mx-1 cursor-pointer"
            @click="loadLikes()"
            :class="props.comment.isReacted ? 'text-primary' : 'text-secondary'"
          >
            {{ props.comment.reactions_count }}
          </span>
        </div>
      </div>
    </v-col>

    <v-col cols="6">
      <div class="d-flex justify-end mb-2">
        <div class="d-flex align-center">
          <v-icon size="18" class="me-1 cursor-pointer text-default" @click="showReplies = !showReplies">
            mdi-comment-processing-outline
          </v-icon>
          <span
            v-if="props.comment.totalComments > 0"
            class="text-sm me-4 cursor-pointer text-default"
            @click="showReplies = !showReplies"
          >
            {{ props.comment.totalComments }}
          </span>
        </div>
      </div>
    </v-col>
  </v-row>

  <!-- Liste des réponses -->
  <div v-if="showReplies">
    <Comments :friends="props.friends"  :comments="props.comment.children" />

    <div class="d-flex justify-center my-2" v-if="hasMore">
      <v-btn
        :loading="loading"
        variant="text"
        size="small"
        class="text-default text-decoration-none"
        @click="loadMoreReplies"
      >
        Show all comments
      </v-btn>
    </div>
  </div>

  <!-- Répondre -->
  <div v-if="loggedIn && (showNewComment || showReplies)">
    <CommentComment :comment="props.comment" @comment-created="reloadComments" />
  </div>

  <!-- Modal réactions -->
  <v-dialog v-model="showLikesModal" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Reactions ({{ props.comment.reactions_count }})</v-card-title>
      <v-divider />

      <v-tabs v-model="activeTab" grow>
        <v-tab v-for="(users, type) in localLikes" :key="type" :value="type">
          <v-chip :color="getColor(type)" label size="small" class="text-white">
            {{ getEmoji(type) }} {{ users.length }}
          </v-chip>
        </v-tab>
      </v-tabs>

      <v-divider />

      <v-card-text>
        <v-list>
          <v-list-item v-for="reaction in localLikes[activeTab]" :key="reaction.id">
            <NuxtLink
              :to="reaction.user?.username === user?.username ? localePath('/profile') : localePath(`/user/${reaction.user?.username}`)"
              class="d-flex align-center text-decoration-none"
            >
              <UserAvatar :user="reaction.user" size="26" class="me-2" />
              <span>{{ reaction.user?.firstName }} {{ reaction.user?.lastName }}</span>
            </NuxtLink>
          </v-list-item>
        </v-list>

        <div v-if="!localLikes[activeTab]?.length" class="text-center text-grey">
          {{ t('noReactions') }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="showLikesModal = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.reaction-container-comment { position: relative; display: inline-flex; align-items: center; }

/* Badges */
.reaction-badges { display: inline-flex; align-items: center; margin-left: 5px; }
.emoji-badge { font-size: 18px; margin-right: -5px; background: transparent; border-radius: 50%; padding: 2px; }

/* Picker */
.reaction-picker-float-comment { position: relative; top: -30px; z-index: 200; transition: transform 0.2s ease; }
.reaction-picker-float-comment.left { transform-origin: left center; }
.reaction-picker-float-comment.right { right: 0; left: auto; transform-origin: right center; }

.fade-scale-enter-active, .fade-scale-leave-active { transition: all 0.2s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(0.9); }
</style>
