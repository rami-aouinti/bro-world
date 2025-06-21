<template>
  <div class="d-flex justify-center py-1">
    <img
      :src="image"
      :alt="name"
      class="profile-image"
      width="80"
      height="80"
    />
  </div>
  <div class="d-flex justify-center py-1">
    <h5 class="text-body-1 font-weight-bold">{{ name }}</h5>
  </div>
  <div class="d-flex justify-center py-1">
    <p>{{ title }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  image: String,
  name: String,
  title: String
});
</script>

<style scoped>
.profile-image {
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* équivalent à elevation="20" */
}
</style>
