<script setup lang="ts">
definePageMeta({
  title: 'Job Platform',
  icon: 'mdi-airplay',
  middleware: 'auth',
  requiredRoles: ['ROLE_USER'],
  drawerIndex: 2,
})
</script>
<template>
  <NuxtPage />
</template>
