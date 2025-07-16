<template>
  <IndexPage />
</template>
<script setup lang="ts">
import IndexPage from "~/components/IndexPage.vue";
definePageMeta({
  title: 'Courses',
  requiredRoles: ['ROLE_ADMIN'],
  breadcrumb: 'disabled',
})
</script>
