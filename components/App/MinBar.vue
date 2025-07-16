<template>
  <div
    class="d-none d-lg-block"
    style="position: fixed; top: 76px; left: 0; width: 355px; padding: 0 8px;"
  >
    <ClientOnly>
      <template v-if="loading">
        <v-skeleton-loader type="card" class="mx-3 rounded-xl" height="400" />
      </template>
      <template v-else>
        <v-card
          style="height: calc(100vh - 112px); overflow-y: auto;"
          rounded="xl"
          class="bg-gradient-primary shadow-primary mx-2"
          variant="text"
          elevation="10"
        >
          <div class="pa-1">
            <template v-if="loggedIn">
              <div class="d-flex align-center px-3 my-2">
                <a :href="'/profile'">
                  <UserAvatar :user="user" color="primary" size="48" />
                </a>
                <div class="mx-4">
                  <NuxtLink
                    :to="localePath('/profile')"
                    class="text-h6 font-weight-bolder text-decoration-none"
                    :class="isDark ? 'text-white' : 'text-default'"
                    style="text-shadow: 1px 1px 2px rgb(var(--v-theme-primary));"
                  >
                    {{ truncate(user?.firstName + ' ' + user?.lastName, 20) }}
                  </NuxtLink>
                </div>
              </div>
              <v-divider class="my-1" />
              <div id="menu-bar-world" />
            </template>

            <template v-else>
              <v-sheet
                class="mx-auto"
                elevation="12"
                max-width="calc(100% - 32px)"
                rounded="lg"
                color="primary"
              >
                <div class="mt-4 py-1">
                  <div class="text-h6 font-weight-bold d-flex justify-center">
                    Bro World
                  </div>
                </div>
                <Social @redirect="isRedirecting = true" />
              </v-sheet>
              <div style="margin-top: -20px;">
                <LoginForm />
              </div>
            </template>
          </div>
        </v-card>
      </template>
    </ClientOnly>
  </div>
</template>


<script setup lang="ts">
import LoginForm from "~/components/Auth/LoginForm.vue";
import Social from "~/components/Auth/Social.vue";
import { ref, onMounted, nextTick, computed } from "vue";
import UserAvatar from "~/components/App/UserAvatar.vue";
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#i18n';
const { t } = useI18n();
const localePath = useLocalePath();
import {truncate} from "~/utils/stringUtils";

const { user, loggedIn } = await useUserSession();
const isRedirecting = ref(false);
const loading = ref(true);
const theme = useTheme()
const isDark = computed({
  get() {
    return theme.global.name.value === 'dark'
  },
  set(v) {
    theme.global.name.value = v ? 'dark' : 'light'
  },
})
onMounted(async () => {
  try {
    await nextTick();
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
</style>
