<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFetch } from '#app'

const { user } = useUserSession()

const props = defineProps<{
  post: {
    id: string
    likes?: { id: string }[] // ou tout autre structure
    comments?: any[]
  }
}>()

const isLiking = ref(false)
const localLikes = ref([...props.post.likes ?? []])

const hasLiked = computed(() =>
  localLikes.value.some((like) => like.id === user.id)
)

const handleLike = async () => {
  if (!user.id) {
    Notify.error('Veuillez vous connecter pour liker un post')
    return
  }
  if (isLiking.value) return

  isLiking.value = true
  try {
    const { error } = await useFetch(`/api/posts/${props.post.id}/like`, {
      method: 'POST',
    })

    if (error.value) {
      Notify.error('Erreur lors du like')
      return
    }

    // Simule toggle localement (à remplacer par retour API si tu veux)
    if (hasLiked.value) {
      localLikes.value = localLikes.value.filter(like => like.id !== user.id)
    } else {
      localLikes.value.push({ id: user.id })
    }

    Notify.success(hasLiked.value ? 'Like retiré !' : 'Post liké !')
  } catch (err) {
    Notify.error('Erreur réseau : ' + err)
  } finally {
    isLiking.value = false
  }
}
</script>

<template>
  <v-row class="align-center px-2 mt-6 mb-2">
    <v-col sm="6">
      <div class="d-flex align-center">
        <v-icon
          size="24"
          class="me-1 cursor-pointer"
          :color="hasLiked ? 'primary' : undefined"
          @click="handleLike"
        >
          mdi-thumb-up
        </v-icon>
        <span v-if="localLikes.length > 0" class="text-sm text-body me-4">
          {{ localLikes.length }}
        </span>
      </div>
    </v-col>

    <v-col sm="6">
      <div class="d-flex align-center">
        <div class="d-flex align-center ms-auto">
          <v-icon size="24" class="me-1 cursor-pointer">
            mdi-comment-processing
          </v-icon>
          <span v-if="props.post?.comments?.length > 0" class="text-sm text-body me-4">
          {{ props.post.comments.length }}
        </span>
        </div>
      </div>
    </v-col>
  </v-row>
</template>
