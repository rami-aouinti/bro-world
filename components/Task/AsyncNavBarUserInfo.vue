<script lang="ts" setup>
const user = useUserSession;
</script>

<template>
  {{ user.firstname }} {{ user.lastname }} ({{ user.email }})
</template>
