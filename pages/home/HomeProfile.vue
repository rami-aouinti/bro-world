<script setup lang="ts">
const { user, pending } = useUserSession()
</script>

<template>
  <v-col cols="auto" class="mt-3 mx-3">
    <v-avatar size="72" class="shadow border-radius-lg">
      <NuxtImg
        width="72" height="72"
        src="/img/bruce-mars.jpg"
        alt="Avatar"
        class="border-radius-lg"
      />
    </v-avatar>
  </v-col>
  <v-col cols="auto" class="my-auto">
    <div class="h-100">
      <h5 class="text-left mb-1 text-h5 text-typo font-weight-bold">
        {{ user?.firstName }} {{ user?.lastName }}
      </h5>
      <p class="text-left mb-0 font-weight-light text-body text-sm">
        CEO / Co-Founder
      </p>
    </div>
  </v-col>
</template>
