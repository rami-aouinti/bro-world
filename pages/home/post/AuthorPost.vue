<script setup lang="ts">
import UserAvatar from "~/components/App/UserAvatar.vue";
import RelativeTime from "~/components/App/RelativeTime.vue";

defineProps<{
  author:
    {
      id: string,
      username: string,
      firstName: string,
      lastName: string,
      avatar: string
    },
  date: string
}>();
</script>

<template>
  <div class="border-bottom d-flex align-center px-4 py-4">
    <div class="d-flex align-center">
      <a href="javascript:" class="text-decoration-none">
        <UserAvatar :user="author" color="primary" size="48"></UserAvatar>
      </a>
      <div class="mx-4">
        <a
          href="javascript:"
          class="text-dark font-weight-600 text-sm text-decoration-none"
        >{{ author.firstName }} {{ author.lastName }}</a
        >
        <RelativeTime :date="date"></RelativeTime>
      </div>
    </div>
    <div class="text-end ms-auto">
      <v-btn icon outlined class="text-primary" small>
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>
