<script setup lang="ts">
import { computed, ref } from 'vue'
import UserAvatar from '~/components/App/UserAvatar.vue'
import RelativeTime from '~/components/App/RelativeTime.vue'
import ReactComment from '~/pages/home/post/ReactComment.vue'
import { useLocalePath } from '#i18n'
import DeleteDialog from "~/components/DeleteDialog.vue";
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import AuthorComment from "~/components/App/AuthorComment.vue";
import PostActions from "~/components/Blog/PostActions.vue";
import CommentActions from "~/components/Blog/CommentActions.vue";
import Comments from "~/pages/home/post/Comments.vue";

const emit = defineEmits(['comment-created', 'comment-deleted'])

const props = defineProps<{
  comment: {
    id: string
    content: string
    publishedAt: string
    user: {
      id: string
      username: string
      firstName: string
      lastName: string
      profile: any[]
    }
    children?: any[]
    friends: any
  }
}>()

const loading = ref(false)
const edit = ref(false)
const deleteComment = ref(false)
const editableContent = ref(props.comment.content || '')
const { loggedIn, user } = await useUserSession()
const localePath = useLocalePath()

const formattedComment = computed(() =>
  props.comment?.content?.replace(/\n/g, '<br>') || ''
)

const isOwner = computed(() => props.comment?.user?.id === user.value?.id)

function toggleEdit() {
  edit.value = true
  editableContent.value = props.comment.content
}

function toggleDelete() {
  deleteComment.value = true
}

function cancelEdit() {
  edit.value = false
  editableContent.value = props.comment.content
}

async function saveEdit() {
  if (!editableContent.value.trim()) return
  loading.value = true

  try {
    await useFetch(`/api/posts/comment/edit/${props.comment.id}`, {
      method: 'PUT',
      body: { content: editableContent.value },
    })

    props.comment.content = editableContent.value
    edit.value = false
    Notify.success('Comment updated.', user.value?.photo, localePath(`/post/${props.post.slug}`))
    emit('comment-created')
  } catch (e) {
    console.error(e)
    Notify.error('Failed to update comment.')
  } finally {
    loading.value = false
  }
}

const createdComment = () => {
  Notify.success('Comment created.', user.value?.photo, localePath(`/post/${props.post.slug}`))
}
</script>

<template>
  <v-card
    rounded="xl"
    class="mt-2 mb-2 w-100 px-3 py-1"
    variant="tonal"
    style="min-height: 48px;"
  >
    <div class="px-2 py-1">
      <AuthorComment :friends="props.friends" :post="props.comment"
                  @post-updated="emit('post-updated', $event)"
                  @post-delete="emit('post-deleted', $event)" />
      <div v-if="!edit" class="text-left text-sm font-weight-light text-body mt-2 mb-2" :style="{ wordBreak: 'break-word' }" v-html="formattedComment" />

      <!-- Edit mode -->
      <div v-else>
        <v-textarea
          v-model="editableContent"
          rows="1"
          rounded
          auto-grow
          variant="outlined"
          class="mx-2 w-100"
          density="compact"
          hide-details
        />

        <div class="d-flex gap-2 mt-2">
          <v-btn
            color="primary"
            density="compact"
            size="small"
            :loading="loading"
            @click="saveEdit"
          >
            {{ $t('Save') }}
          </v-btn>
          <v-btn
            variant="text"
            density="compact"
            size="small"
            :disabled="loading"
            @click="cancelEdit"
          >
            {{ $t('Cancel') }}
          </v-btn>
        </div>
      </div>

      <CommentActions :friends="props.friends"  :comment="props.comment"
                   @post-reload="emit('post-reload')" />
    </div>
  </v-card>
</template>

<style scoped>
.text-body {
  line-height: 1.4;
}
</style>
