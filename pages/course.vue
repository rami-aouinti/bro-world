<script setup lang="ts">
definePageMeta({
  title: 'Course',
  icon: 'mdi-airplay',
  middleware: 'auth',
  requiredRoles: ['ROLE_USER'],
  drawerIndex: 3,
})
</script>
<template>
  <NuxtPage />
</template>
