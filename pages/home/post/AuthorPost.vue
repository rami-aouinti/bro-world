<script setup lang="ts">
defineProps<{
  author:
    {
      id: string,
      username: string,
      avatar: string
    },
  date: string
}>();
</script>

<template>
  <div class="border-bottom d-flex align-center px-4 py-4">
    <div class="d-flex align-center">
      <a href="javascript:" class="text-decoration-none">
        <v-avatar size="48" class="rounded-circle">
          <v-img
            src="@/assets/img/team-4.jpg"
            alt="profile-image"
          />
        </v-avatar>
      </a>
      <div class="mx-4">
        <a
          href="javascript:"
          class="text-dark font-weight-600 text-sm text-decoration-none"
        >John Snow</a
        >
        <small class="d-block text-muted">3 days ago</small>
      </div>
    </div>
    <div class="text-end ms-auto">
      <v-btn icon outlined class="text-primary" small>
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>
