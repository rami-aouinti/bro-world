<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
)
import AuthorPost from "~/pages/home/post/AuthorPost.vue";
import { usePostStore } from "~/stores/usePostStore"
import PostCard from "~/components/Post/PostCard.vue";

const postStore = usePostStore()

const slug = ref(route.params.slug)
const items = [
  { title: "Settings", icon: "mdi-account-settings-variant", color: "deep-purple", path: "/setting" },
  { title: "Calendar", icon: "mdi-calendar", color: "amber", path: "/calendar" },
  { title: "Shop", icon: "mdi-storefront", color: "pink", path: "/shop" },
  { title: "Jobs", icon: "mdi-briefcase", color: "blue", path: "/jobs" },
  { title: "CRM", icon: "mdi-database", color: "teal", path: "/crm" },
  { title: "Courses", icon: "mdi-school", color: "green", path: "/courses" },
  { title: "Quiz", icon: "mdi-gamepad-variant", color: "indigo", path: "/quiz" },
  { title: "My Files", icon: "mdi-folder", color: "orange", path: "/user/channel/media" },
  { title: "Recent", icon: "mdi-history", color: "cyan", path: "/recent" },
];
const { data: post, pending, error, refresh } = await useAsyncData(
  'post-' + slug.value,
  () => postStore.fetchPost(slug.value),
  {
    watch: [() => slug.value],
    server: true
  }
)
</script>

<template>
  <v-container fluid>
    <client-only>
      <teleport to="#menu-bar-world">
        <v-list
          style="background-color: transparent;"
          :lines="false"
          nav
        >
          <v-list-item
            v-for="(item, i) in items"
            :to="item.path"
            :key="i"
            :value="item"
            color="primary"
          >
            <template v-slot:prepend>
              <v-icon :color="item.color" :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </teleport>
    </client-only>
    <div v-if="pending" class="d-flex justify-center align-center">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="8">
          <v-skeleton-loader
            type="card"
            class="pa-4 rounded-xl"
            height="200"
            rounded="xl"
          />
        </v-col>
      </v-row>
    </div>

    <v-row v-else justify="center">
      <v-col cols="12">
        <v-card rounded="xl" class="mx-3" variant="text" elevation="10">
          <AuthorPost :post="post" />
          <PostCard :post="post" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

