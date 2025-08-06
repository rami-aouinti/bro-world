<script setup lang="ts">
import UserAvatar from "~/components/App/UserAvatar.vue";
import RelativeTime from "~/components/App/RelativeTime.vue";
import DeleteDialog from "~/components/DeleteDialog.vue";

const { user, loggedIn } = await useUserSession();
const emit = defineEmits(["comment-deleted", "comment-updated"]);

const props = defineProps({
  comment: { type: Object, required: true }
});

const isOwner = computed(() => props.comment.user?.id === user.value?.id);
const editing = ref(false);
const content = ref(props.comment.content);
const loading = ref(false);

async function saveEdit() {
  if (!content.value.trim()) return;
  loading.value = true;
  try {
    await $fetch(`/api/comments/${props.comment.id}`, {
      method: "PUT",
      body: { content: content.value }
    });
    props.comment.content = content.value;
    editing.value = false;
    emit("comment-updated", props.comment);
    Notify.success("Comment updated!");
  } finally {
    loading.value = false;
  }
}

async function deleteComment() {
  await $fetch(`/api/comments/${props.comment.id}`, { method: "DELETE" });
  emit("comment-deleted", props.comment.id);
  Notify.success("Comment deleted!");
}
</script>

<template>
  <v-card class="my-2 px-3 py-2" rounded="lg" variant="tonal">
    <div class="d-flex">
      <UserAvatar :user="props.comment.user" size="32" />
      <div class="ms-3 flex-grow-1">
        <div class="d-flex justify-space-between">
          <strong>{{ props.comment.user.username }}</strong>
          <RelativeTime :date="props.comment.publishedAt" />
        </div>

        <!-- Mode édition -->
        <div v-if="editing">
          <v-textarea
            v-model="content"
            rows="2"
            variant="outlined"
            density="compact"
          />
          <v-btn size="small" color="primary" :loading="loading" @click="saveEdit">Save</v-btn>
          <v-btn size="small" variant="text" @click="editing=false">Cancel</v-btn>
        </div>

        <!-- Mode affichage -->
        <div v-else class="mt-1" v-html="props.comment.content" />

        <!-- Actions -->
        <div v-if="isOwner" class="mt-1">
          <v-btn icon variant="text" size="small" @click="editing=true"><v-icon>mdi-pencil</v-icon></v-btn>
          <DeleteDialog @deleted="deleteComment" />
        </div>
      </div>
    </div>
  </v-card>
</template>
