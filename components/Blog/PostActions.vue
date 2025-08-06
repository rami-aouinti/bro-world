<script setup lang="ts">
import {computed, nextTick, onMounted, ref} from 'vue'
import Comments from '~/pages/home/post/Comments.vue'
import ReactionPicker from "~/components/App/ReactionPicker.vue"
import NewComment from "~/pages/home/post/NewComment.vue"
import UserAvatar from "~/components/App/UserAvatar.vue"
import {useLocalePath} from '#i18n'
import {usePostStore} from "~/stores/usePostStore"
const postContent = ref('')
import PostContent from "~/components/Blog/PostContent.vue";
import PostMedia from "~/components/Blog/PostMedia.vue";
import AuthorPost from "~/pages/home/post/AuthorPost.vue";

const postStore = usePostStore()
const showLikesModal = ref(false)
const showPicker = ref(false)
const pickerPosition = ref<'left' | 'right'>('left')
const reactionContainer = ref<HTMLElement | null>(null)

const activeTab = ref('')
const { user, loggedIn } = await useUserSession()
const showReplies = ref(false)
const showNewComment = ref(false)
const showShare = ref(false)
const emit = defineEmits(['post-reload']);
const localePath = useLocalePath()
const { t } = useI18n()

const props = defineProps<{ post: any }>()
const comments = ref(props.post.comments_preview)
const loading = ref(false)

/** ✅ Initialisation des réactions groupées depuis reactions_preview */
const localLikes = ref<{ [key: string]: any[] }>(
  (props.post.reactions_preview || []).reduce((acc: Record<string, any[]>, r: any) => {
    (acc[r.type] ||= []).push(r)
    return acc
  }, {})
)

/** ✅ Emoji & couleurs */
function getEmoji(type: string) {
  return { like: '👍', love: '❤️', haha: '😂', wow: '😮', sad: '😢', angry: '😡' }[type] || '👍'
}
function getColor(type: string) {
  return { like: 'primary', love: 'red', haha: 'yellow-darken-2', wow: 'blue', sad: 'cyan-darken-2', angry: 'deep-orange' }[type] || 'grey'
}

const topReactions = computed(() => {
  return Object.entries(localLikes.value)
    .map(([type, list]) => ({type, count: list.length}))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
})

function checkPickerPosition() {
  nextTick(() => {
    if (!reactionContainer.value) return
    const rect = reactionContainer.value.getBoundingClientRect()
    pickerPosition.value = (window.innerWidth - rect.right < 220) ? 'right' : 'left'
  })
}

/** ✅ Charge les réactions pour le modal */
async function loadLikes() {
  showLikesModal.value = true
  const data = await postStore.fetchReact(props.post.id)
  const grouped: Record<string, any[]> = {}
  for (const r of data.reactions || []) {
    (grouped[r.type] ||= []).push(r)
  }
  localLikes.value = grouped
  activeTab.value = Object.keys(grouped)[0] || ''
}

async function handleReact(type: string) {
  if (!loggedIn) return Notify.error('You are not logged')
  try {
    await $fetch(`/api/posts/${props.post.id}/react/${type}`, { method: 'POST' })

    // Supprimer ancienne réaction utilisateur
    for (const key in localLikes.value) {
      localLikes.value[key] = localLikes.value[key].filter(r => r.user?.id !== user.value.id)
    }

    // Ajouter nouvelle réaction
    (localLikes.value[type] ||= []).push({ id: Date.now(), type, user: user.value })

    Notify.success(`You reacted with ${type}`, user.value?.photo, `/post/${props.post.slug}`)
    emit('post-reload')
  } catch (err) {
    Notify.error('Error: ' + err)
  }
}

const handleLike = async () => handleReact('like')
const reloadComments = async (data: any) => { showReplies.value = true; comments.value.unshift(data.value); emit('post-reload') }

onMounted(() => window.addEventListener('resize', checkPickerPosition))
</script>

<template>
  <v-row v-if="props.post.reactions_count > 0 && props.post?.totalComments > 0 " >
    <v-col cols="6">
      <div v-if="props.post.reactions_count > 0" class="d-flex justify-start mx-2">
        <div class="d-flex align-center me-2">
          <span v-if="topReactions.length" class="reaction-badges">
        <span v-for="r in topReactions" :key="r.type" class="emoji-badge">{{ getEmoji(r.type) }}</span>
      </span>
          <span v-if="props.post.reactions_count > 0 && !loading"
                class="text-sm mx-1 cursor-pointer"
                @click="loadLikes()"
                :class="props.post.isLiked ? 'text-primary' : 'text-secondary'">
        {{ props.post.reactions_count }}
      </span>
      </div>

      </div>
    </v-col>
    <v-col cols="6">
      <div class="d-flex justify-end mb-2">
        <div v-if="props.post?.totalComments > 0" class="d-flex align-center">
          <v-icon size="18" class="me-1 cursor-pointer text-default" @click="showReplies = !showReplies">
            mdi-comment-processing-outline
          </v-icon>
          <span
                class="text-sm me-4 cursor-pointer text-default"
                @click="showReplies = !showReplies">
        {{ props.post.totalComments }}
      </span>
        </div>
      </div>
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <div class="d-flex align-center text-default text-center py-2">
    <v-row>
      <v-col cols="4">
        <div ref="reactionContainer"
             class="reaction-container"
             @mouseenter="showPicker = true; checkPickerPosition()"
             @mouseleave="showPicker = false">
          <v-icon v-if="!props.post.isReacted" size="18" class="flex-grow-1 mx-1 cursor-pointer"
                  color="default"
                  @click="handleLike"
                  icon="mdi-thumb-up-outline"
          >

          </v-icon>
          <span v-else class="cursor-pointer emoji-badge">{{ getEmoji(props.post.isReacted) }}</span>
          <transition name="fade-scale">
            <ReactionPicker
              :selectedReact="props.post.isReacted"
              v-show="showPicker"
              :class="['reaction-picker-float', pickerPosition]"
              @select="(type) => handleReact(type)"
            />
          </transition>
        </div>
      </v-col>
      <v-col cols="4">
        <v-icon @click="showNewComment = !showNewComment" class="cursor-pointer flex-grow-1 mx-1" size="18" color="default">mdi-comment-outline</v-icon>
      </v-col>
      <v-col cols="4">
        <v-icon @click="showShare = !showShare" class="cursor-pointer flex-grow-1 mx-1" size="18" color="default">mdi-share-variant</v-icon>
      </v-col>
    </v-row>
  </div>


  <!-- ✅ Section commentaires -->
  <div v-if="showReplies">
    <v-divider></v-divider>
    <Comments :comments="comments" />
  </div>
  <div v-if="showNewComment || showReplies">
    <v-divider></v-divider>
    <NewComment :post="props.post"  @comment-created="reloadComments" />
  </div>

  <v-dialog v-model="showShare" max-width="600">
    <v-card rounded="xl" class="bg-gradient-primary shadow-primary mx-3">
      <v-text-field
        v-model="postContent"
        label="Post Title"
        variant="outlined"
        rounded
        outlined
        required
      />
      <v-divider />
      <v-card-text>
        <div class="px-4 py-2">


          <PostContent :post="props.post" />
          <PostMedia :post="props.post" />

          <AuthorPost :post="props.post"
                      @post-updated="emit('post-updated', $event)"
                      @post-delete="emit('post-deleted', $event)" />

        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="showShare = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- ✅ MODAL des réactions -->
  <v-dialog v-model="showLikesModal" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Reactions ({{ props.post.reactions_count }})</v-card-title>
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
            <NuxtLink :to="reaction.user?.username === user?.username ? localePath('/profile') : localePath(`/user/${reaction.user?.username}`)" class="d-flex align-center text-decoration-none">
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
.reaction-container { position: relative; display: inline-flex; align-items: center; }

/* ✅ Petits emojis stackés à côté du like */
.reaction-badges { display: inline-flex; align-items: center; margin-left: 5px; }
.emoji-badge {
  font-size: 18px;
  margin-right: -5px;
  background: transparent;
  border-radius: 50%;
  padding: 2px;
}

/* ✅ Picker dynamique */
.reaction-picker-float { position: absolute; top: -50px; z-index: 200; transition: transform 0.2s ease; }
.reaction-picker-float.left { transform-origin: left center; }
.reaction-picker-float.right { right: 0; left: auto; transform-origin: right center; }

.fade-scale-enter-active, .fade-scale-leave-active { transition: all 0.2s ease; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(0.9); }
</style>
