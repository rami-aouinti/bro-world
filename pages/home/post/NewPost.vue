<script setup lang="ts">
import { ref } from 'vue'
const notificationStore = useNotificationStore()
const dialog = ref(false)
const loading = ref(false)

const load = () => {
  loading.value = true
  setTimeout(() => (loading.value = false), 3000)
}

const isSubmitting = ref(false);
const postContent = ref('')
const username = 'John'

const publishPost = async () => {
  if (!postContent.value) {
    Notify.warning("Veuillez remplir tous les champs !");
    return;
  }

  isSubmitting.value = true;
  dialog.value = true
  try {
    await useFetch("/api/posts", {
      method: "POST",
      body: {title: postContent.value},
    });

    Notify.success("Post ajouté avec succès !");
    postContent.value = "";
  } catch (error) {
    Notify.error("Erreur lors de l'ajout du post !");
  } finally {
    isSubmitting.value = false;
    dialog.value = false
  }
}
</script>

<template>
  <div>
    <v-card rounded="xl">
      <v-card-text>
        <div
          class="d-flex align-center flex-wrap"
          style="max-width: 100%"
        >
          <a href="javascript:" class="mx-2 text-decoration-none">
            <v-avatar size="40" class="rounded-circle">
              <v-img
                src="@/assets/img/team-4.jpg"
                alt="profile-image"
              />
            </v-avatar>
          </a>
          <v-btn
            class="flex-grow-1 px-3 py-2 font-weight-bold justify-start"
            height="40"
            variant="tonal"
            @click="dialog = true"
          >
            <span>Hello {{ username }}, new post?</span>
          </v-btn>
        </div>
      </v-card-text>
      <hr class="horizontal dark my-2" />
      <v-card-actions>
        <v-btn
          :loading="loading"
          icon
          class="flex-grow-1"
          height="48"
          @click="load"
        >
          <v-icon class="mx-1" color="primary">mdi-video</v-icon>
          Video
        </v-btn>
        <v-btn
          :loading="loading"
          icon
          class="flex-grow-1"
          height="48"
          @click="load"
        >
          <v-icon class="mx-1" color="primary"
          >mdi-image-multiple</v-icon
          >
          Photo
        </v-btn>
        <v-btn
          icon
          :loading="loading"
          class="flex-grow-1"
          height="48"
          @click="load"
        >
          <v-icon class="mx-1" color="primary">mdi-face</v-icon>
          State
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Modal (Dialog) -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold">
          Create a new post
        </v-card-title>

        <v-card-text>
          <v-textarea
            v-model="postContent"
            label="What's on your mind?"
            variant="outlined"
            auto-grow
          />
        </v-card-text>

        <v-card-actions class="d-flex justify-end">
          <v-btn color="grey" variant="text" @click="dialog = false"
          >Cancel</v-btn
          >
          <v-btn color="primary" :disabled="isSubmitting" @click="publishPost">Publish</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
