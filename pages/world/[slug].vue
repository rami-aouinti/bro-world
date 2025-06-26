<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const slug = route.params.slug

const pending = ref(true)
const blog = ref({})
const loadBlog = async () => {
  const { data } = await useFetch(`/api/posts/blog/${slug}/blog`)
  if (data.value) {
    blog.value = data.value
  }
  pending.value = false
}

watch(!slug, () => {
  loadBlog()
}, { immediate: true })

onMounted(async () => {
  await loadBlog()
})


</script>
<template>
  <v-container fluid>
    <v-row>
      <v-col lg="12">
        <v-card rounded="xl" class="py-4" variant="text">
          <div class="px-5">
            <v-row align="center" class="pa-0 ma-0">
              <!-- Avatar -->
              <v-col cols="auto">
                <v-avatar size="50" class="border-primary border-lg rounded-circle">
                  <NuxtImg width="50" height="50" :src="blog.logo" alt="Avatar" />
                </v-avatar>
              </v-col>
              <!-- Name -->
              <v-col cols="auto">
                <div>
                  <h6 class="mb-1 text-h6 text-typo font-weight-bold">
                    {{ blog?.title }}
                  </h6>
                  <p class="mb-0 font-weight-light text-body text-sm">
                    {{ blog?.subTitle }}
                  </p>
                </div>
              </v-col>
              <!-- Buttons -->
              <v-col cols="auto" class="ms-auto d-flex align-center justify-end">
                <v-btn variant="text" to="/setting" class="font-weight-bolder me-1">
                  <v-icon icon="mdi-settings" size="20" />
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

