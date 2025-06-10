<script setup lang="ts">
defineProps<{
  post: {
    type: Object,
    required: true,
  },
}>();
</script>

<template>
  <v-row class="align-center px-2 mt-6 mb-2">
    <v-col sm="6">
      <div class="d-flex">
        <div class="d-flex align-center">
          <v-icon
            size="24"
            class="material-icons-round me-1 cursor-pointer"
          >mdi-thumb-up</v-icon
          >
          <span v-if="post?.likes?.length > 0" class="text-sm text-body me-4">
            {{ post?.likes?.length }}
          </span>
        </div>
        <div class="d-flex align-center">
          <v-icon
            size="24"
            class="material-icons-round me-1 cursor-pointer"
          >mdi-comment-processing</v-icon
          >
          <span
            v-if="post?.comments?.length > 0"
            class="text-sm text-body me-4"
          >
            {{ post?.comments?.length }}
          </span>
        </div>
      </div>
    </v-col>
    <v-col sm="6">
      <div class="d-flex align-center">
        <div class="d-flex align-center ms-auto">
          <v-avatar size="24" class="border border-white ms-n2">
            <NuxtImg width="24" height="24" src="/img/team-5.jpg" alt="Avatar" />
          </v-avatar>
          <v-avatar size="24" class="border border-white ms-n2">
            <NuxtImg width="24" height="24" src="/img/team-2.jpg" alt="Avatar" />
          </v-avatar>
          <v-avatar size="24" class="border border-white ms-n2">
            <NuxtImg width="24" height="24" src="/img/team-1.jpg" alt="Avatar" />
          </v-avatar>
        </div>
      </div>
    </v-col>
  </v-row>
</template>
