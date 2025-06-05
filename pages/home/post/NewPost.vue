<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import UserAvatar from '~/components/App/UserAvatar.vue'
import BaseDialog from '~/components/BaseDialog.vue'

const dialog = ref(false)
const loading = ref(false)
const files = ref<File[]>([])
const emit = defineEmits(['post-created'])
const showDialog = ref(false)
const postContent = ref('')
const { user } = useUserSession()

const load = () => {
  loading.value = true
  setTimeout(() => (loading.value = false), 3000)
}

const handleSuccess = (data) => {
  postContent.value = ''
  Notify.success("Post created!")
  emit('post-created', data)
}

const handleError = (error) => {
  Notify.error("Post failed!")
  console.error('Failed:', error)
}
</script>

<template>
  <div>
    <v-card rounded="xl" class="mx-3" variant="text">
      <v-card-text>
        <div class="d-flex align-center flex-wrap" style="max-width: 100%">
          <button class="btn-reset mx-2" @click="dialog = true" aria-label="User avatar">
            <UserAvatar :user="user" size="40" color="primary" />
          </button>
          <v-btn
            class="flex-grow-1 px-3 py-2 font-weight-bold justify-start"
            height="40"
            variant="tonal"
            @click="dialog = true"
            style="min-height: 48px"
          >
            <span>Hello {{ user.firstName }} {{ user.lastName }}, new post?</span>
          </v-btn>
        </div>
      </v-card-text>
      <hr class="horizontal dark my-2" />
      <v-card-actions>
        <v-btn :loading="loading" icon class="flex-grow-1" height="48" @click="load">
          <v-icon class="mx-1" color="primary">mdi-video</v-icon>
          Video
        </v-btn>
        <v-btn :loading="loading" icon class="flex-grow-1" height="48" @click="load">
          <v-icon class="mx-1" color="primary">mdi-image-multiple</v-icon>
          Photo
        </v-btn>
        <v-btn icon :loading="loading" class="flex-grow-1" height="48" @click="load">
          <v-icon class="mx-1" color="primary">mdi-face</v-icon>
          State
        </v-btn>
      </v-card-actions>
    </v-card>

    <BaseDialog
      v-model="dialog"
      title="New Post"
      color="primary"
      :closeButton="[{ text: 'Cancel', color: 'grey', action: () => (dialog = false) }]"
      :saveButton="[{ text: 'Save', color: 'primary', action: '/api/posts/post/posts' }]"
      :files="files"
      :forms="postContent"
      @success="handleSuccess"
      @error="handleError"
    >
      <v-card rounded="xl">
        <v-card-text>
          <v-text-field
            v-model="postContent"
            label="Post Title"
            variant="outlined"
            rounded
            outlined
            required
          />
          <v-file-upload
            icon="mdi-upload"
            v-model="files"
            :title="$t('post.files')"
            multiple
            density="compact"
            variant="compact"
            show-size
            clearable
          />
          <small class="text-grey">* This doesn't actually save.</small>
        </v-card-text>
      </v-card>
    </BaseDialog>
  </div>
</template>

<style scoped>
.btn-reset {
  all: unset;
  cursor: pointer;
}
</style>
