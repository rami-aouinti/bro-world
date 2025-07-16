<template>
  <v-row class="d-flex justify-center py-4" justify="center" no-gutters>
    <v-col cols="auto" v-for="(item, i) in socialLinks" :key="i" class="d-flex justify-center">
      <a
        :href="item.url"
        @click.prevent="redirect(item.url)"
        role="button"
        class="social-icon"
        :style="{ color: item.color }"
      >
        <v-icon size="28">{{ item.icon }}</v-icon>
      </a>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const emit = defineEmits(['redirect'])

function redirect(url: string) {
  emit('redirect')
  window.location.href = url
}

const socialLinks = [
  { icon: 'mdi-instagram', url: '/api/auth/instagram', color: '#E1306C' },
  { icon: 'mdi-github-circle', url: '/api/auth/github', color: '#24292e' },
  { icon: 'mdi-facebook', url: '/api/auth/facebook', color: '#112c4f' },
  { icon: 'mdi-google', url: '/api/auth/google', color: '#320604' },
  { icon: 'mdi-linkedin', url: '/api/auth/linkedin', color: '#0077B5' },
]
</script>

<style scoped>
.social-icon {
  transition: transform 0.2s ease, color 0.2s ease;
}
.social-icon:hover {
  transform: scale(1.2);
  opacity: 0.9;
}
</style>
