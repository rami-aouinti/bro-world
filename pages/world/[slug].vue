<script setup lang="ts">
import { mergeProps, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AddMember from "~/pages/world/dialog/addMember.vue";
const route = useRoute()
const slug = route.params.slug
const menuShow = ref(false)
const pending = ref(true)
const blog = ref({})
const loadBlog = async () => {
  const { data } = await useFetch(`/api/posts/blog/${slug}/blog`)
  if (data.value) {
    blog.value = data.value
  }
  pending.value = false
}
const addMemberDialog = ref(false)
const closeMenu = () => {
  menuShow.value = false
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
                    {{ blog?.blogSubTitle }}
                  </p>
                </div>
              </v-col>
              <!-- Buttons -->
              <v-col cols="auto" class="ms-auto d-flex align-center justify-end">
                <!-- On utilise SEULEMENT v-menu, et on applique manuellement le tooltip -->
                <v-menu
                  v-model="menuShow"
                  transition="slide-y-transition"
                  offset-y
                  offset-x
                  min-width="150"
                  :close-on-content-click="false"
                >
                  <template #activator="{ props: menu }">
                    <v-btn
                      v-bind="menu"
                      icon
                      :ripple="false"
                      variant="text"
                      class="text-primary"
                      small
                    >
                      <v-tooltip activator="parent" location="bottom">
                        Setting
                      </v-tooltip>
                      <v-icon size="16">mdi-settings</v-icon>
                    </v-btn>
                  </template>

                  <v-list class="pa-2">
                    <v-list-item class="list-item-hover-active border-radius-md">
                      <v-list-item-content class="pa-0">
                        <v-list-item-title
                          class="text-body-2 ls-0 text-body font-weight-600 py-2"
                        >
                          Edit Team
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item class="list-item-hover-active border-radius-md">
                      <v-list-item-content class="pa-0">
                        <v-list-item-title
                          class="text-body-2 ls-0 text-body font-weight-600 py-2 cursor-pointer"
                          @click="addMemberDialog = true; closeMenu"
                        >
                          Add Member
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item class="list-item-hover-active border-radius-md">
                      <v-list-item-content class="pa-0">
                        <v-list-item-title
                          class="text-body-2 ls-0 text-body font-weight-600 py-2"
                        >
                          See Details
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <hr class="horizontal dark my-2" />

                    <v-list-item class="list-item-hover-active border-radius-md">
                      <v-list-item-content class="pa-0">
                        <v-list-item-title
                          class="text-danger ls-0 font-weight-600 mb-0"
                        >
                          Remove Team
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <add-member :blogId="blog.id" v-model="addMemberDialog" />
  </v-container>
</template>

