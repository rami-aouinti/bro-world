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
            size="14"
            class="material-icons-round me-1 text-body cursor-pointer"
          >mdi-thumb-up</v-icon
          >
          <span class="text-sm text-body me-4">150</span>
        </div>
        <div class="d-flex align-center">
          <v-icon
            size="14"
            class="material-icons-round me-1 text-body cursor-pointer"
          >mdi-comment-processing</v-icon
          >
          <span class="text-sm text-body me-4">36</span>
        </div>
        <div class="d-flex align-center">
          <v-icon
            size="14"
            class="material-icons-round me-1 text-body cursor-pointer"
          >mdi-forward</v-icon
          >
          <span class="text-sm text-body me-4">12</span>
        </div>
      </div>
    </v-col>
    <v-col sm="6">
      <div class="d-flex align-center">
        <div class="d-flex align-center ms-auto">
          <v-avatar size="24" class="border border-white ms-n2">
            <NuxtImg preset="optimized" width="24" height="24" src="/img/team-5.jpg" alt="Avatar" />
          </v-avatar>
          <v-avatar size="24" class="border border-white ms-n2">
            <NuxtImg preset="optimized" width="24" height="24" src="/img/team-2.jpg" alt="Avatar" />
          </v-avatar>
          <v-avatar size="24" class="border border-white ms-n2">
            <NuxtImg preset="optimized" width="24" height="24" src="/img/team-1.jpg" alt="Avatar" />
          </v-avatar>
        </div>
        <small class="ps-2 font-weight-bold text-body text-sm">
          and 30+ more
        </small>
      </div>
    </v-col>
  </v-row>
</template>
