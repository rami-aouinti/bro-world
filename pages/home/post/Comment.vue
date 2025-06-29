<script setup lang="ts">
import { computed, ref, defineEmits, mergeProps, defineProps } from 'vue'
import UserAvatar from '~/components/App/UserAvatar.vue'
import RelativeTime from '~/components/App/RelativeTime.vue'
import ReactComment from '~/pages/home/post/ReactComment.vue'
import { useLocalePath } from '#i18n'
import DeleteDialog from "~/components/DeleteDialog.vue";

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
    Notify.success('Comment updated.')
    emit('comment-created')
  } catch (e) {
    console.error(e)
    Notify.error('Failed to update comment.')
  } finally {
    loading.value = false
  }
}

const createdComment = () => {
  Notify.success('Comment created.')
}
</script>

<template>
  <v-card
    rounded="xl"
    class="mt-3 mb-3 w-100 px-3 py-2"
    variant="text"
    style="min-height: 48px;"
  >
    <div class="d-flex">
      <div class="flex-shrink-0">
        <UserAvatar :user="props.comment.user" size="32" />
      </div>
      <div class="flex-grow-1 ms-4">
        <div class="d-flex justify-space-between align-center">
          <div class="mx-1">
            <NuxtLink
              :to="isOwner ? localePath('/profile') : localePath(`/user/${props.comment.user.username}`)"
              class="text-dark font-weight-600 text-sm text-decoration-none"
            >
              {{ props.comment.user.firstName }} {{ props.comment.user.lastName }}
            </NuxtLink>
            <RelativeTime :date="props.comment.publishedAt" />
          </div>

          <!-- Actions -->
          <div v-if="isOwner" class="d-flex align-center gap-2 me-2">
            <v-menu location="bottom" max-width="68">
              <template #activator="{ props: menu }">
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  class="text-primary"
                  v-bind="mergeProps(menu)"
                >
                  <v-icon icon="mdi-dots-vertical" size="20" />
                </v-btn>
              </template>

              <v-list class="pa-2">

                <v-list-item>
                  <v-icon size="small" icon="mdi-pencil"  color="warning" @click="toggleEdit" :aria-label="$t('Edit')">
                    mdi-pencil
                  </v-icon>

                </v-list-item>
                <v-list-item>
                  <v-icon size="small"  color="error" @click="toggleDelete" :aria-label="$t('Delete')" >
                    mdi-delete
                  </v-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>

        <!-- Comment content -->
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
      </div>
    </div>
    <DeleteDialog @deleted="emit('comment-deleted')" :model-value="deleteComment" delete-url="/api/posts/comment/delete" :item-id="props.comment.id"></DeleteDialog>

    <!-- Reactions / replies -->
    <ReactComment
      @comment-commented="createdComment"
      :comment="props.comment"
    />
  </v-card>
</template>

<style scoped>
.text-body {
  line-height: 1.4;
}
</style>
