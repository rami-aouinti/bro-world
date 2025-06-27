<script setup lang="ts">
definePageMeta({
  icon: 'mdi-security',
  title: 'Administration',
  middleware: 'admin',
  requiredRoles: ['ROLE_ADMIN'],
  breadcrumb: 'disabled',
})

const { loggedIn } = useUserSession()
watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})
</script>

<template>
  <template>
    <NuxtPage />
  </template>
</template>
