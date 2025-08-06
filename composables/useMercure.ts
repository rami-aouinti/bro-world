import { onMounted, onUnmounted } from 'vue'
import { useCommentStore } from '~/stores/useCommentStore'
import { usePostStore } from '~/stores/usePostStore'

export function useMercure() {
  const commentStore = useCommentStore()
  const postStore = usePostStore()

  let eventSource: EventSource | null = null

  onMounted(() => {
    eventSource = new EventSource(`${import.meta.env.VITE_MERCURE_URL}?topic=https://bro-world.org/posts/{id}`)
    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data)

      if (update.type === 'comment_added') {
        commentStore.addComment(update.postId, update.comment)
      }
      if (update.type === 'like_updated') {
        const post = postStore.posts.find(p => p.id === update.postId)
        if (post) post.likes_count = update.likes_count
      }
    }
  })

  onUnmounted(() => eventSource?.close())
}
