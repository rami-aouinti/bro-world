<script setup lang="ts">
import { computed, ref, defineEmits} from 'vue'
import UserAvatar from '~/components/App/UserAvatar.vue'
import RelativeTime from '~/components/App/RelativeTime.vue'
const emit = defineEmits(['comment-created'])
const props = defineProps<{
  comment: {
    id: string
    content: string
    publishedAt: string
    user: {
      username: string
      firstName: string
      lastName: string
      profile: any[]
    }
    children?: any[]
  }
}>()

const { loggedIn, user } = useUserSession()
import { useLocalePath } from '#i18n'
import ReactComment from "~/pages/home/post/ReactComment.vue";
const localePath = useLocalePath()

const formattedComment = computed(() =>
  props.comment.content?.replace(/\n/g, '<br>') || ''
)

const isOwner = computed(() => props.comment?.user?.id === user?.id)

async function reloadComments() {
  emit('comment-created')
}

</script>

<template>
  <v-card
    rounded="xl"
    class="mt-2 mb-2 w-100 px-2 py-1"
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
            :to="isOwner ? localePath('/profile') : localePath(`/user/${props.comment?.user?.username}`)"
            class="text-dark font-weight-600 text-sm text-decoration-none"
          >
            {{ props.comment?.user?.firstName }} {{ props.comment?.user?.lastName }}
          </NuxtLink>
          <RelativeTime :date="props.comment?.publishedAt" />
        </div>

        <!-- Actions (if owner) -->
        <div v-if="isOwner" class="d-flex align-center gap-2 me-2">
          <v-btn icon size="24" variant="text" @click="console.log('Edit', props.comment.id)">
            <v-icon size="18">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="24" variant="text" @click="console.log('Delete', props.comment.id)">
            <v-icon size="18">mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>
      <div
          class="text-left text-sm font-weight-light text-body mt-2 mb-2"
          style="word-break: break-word;"
          v-html="formattedComment"
      ></div>
    </div>
  </div>
    <ReactComment @comment-commented="reloadComments" :comment="props.comment"></ReactComment>
  </v-card>
</template>
