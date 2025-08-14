<script setup lang="ts">
import Social from "~/components/Auth/Social.vue";
import { ref, onMounted, nextTick, computed, toRefs } from "vue";
import UserAvatar from "~/components/App/UserAvatar.vue";
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#i18n';
import { useTheme } from 'vuetify'          // <-- import
import { truncate } from "~/utils/stringUtils";
import LoginModalForm from "~/components/Auth/LoginModalForm.vue";

const { t } = useI18n();
const localePath = useLocalePath();

const session = await useUserSession()
const { user, loggedIn } = toRefs(session)  // <-- garde la réactivité

const isRedirecting = ref(false);
const loginDialog = ref(false);
const loading = ref(true);

const theme = useTheme()
const isDark = computed({
  get: () => theme.global.name.value === 'dark',
  set: (v) => { theme.global.name.value = v ? 'dark' : 'light' }
})

onMounted(async () => {
  try { await nextTick(); } finally { loading.value = false; }
})
</script>

<template>
  <div
    class="d-lg-block"
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
          <!-- PAS de <template> inutile ici -->
          <div v-if="loggedIn" class="d-flex align-center px-3 my-2">
            <NuxtLink :to="localePath('/profile')">
              <UserAvatar :user="user" color="primary" size="32" />
            </NuxtLink>
            <div class="mx-2">
              <NuxtLink
                :to="localePath('/profile')"
                class="text-h7 font-weight-bolder text-decoration-none"
                :class="isDark ? 'text-white' : 'text-default'"
              >
                {{ truncate((user?.firstName || '') + ' ' + (user?.lastName || ''), 15) }}
              </NuxtLink>
            </div>
            <v-spacer />
            <div class="me-1 d-flex justify-end">
              <v-btn size="small" variant="text" :to="localePath('/setting')" class="font-weight-bolder">
                <v-icon color="default" icon="mdi-settings" size="15" />
              </v-btn>
            </div>
          </div>

          <div v-else class="d-flex align-center justify-center px-3 my-2">
            <v-btn
              color="primary"
              variant="text"
              class="font-weight-bolder"
              @click="loginDialog = true"
            >
              <v-icon color="primary" icon="mdi-login" size="15" class="me-1" />
              Connect
            </v-btn>
          </div>

          <v-divider class="my-1" />
          <div id="menu-bar-world" />

          <v-dialog v-model="loginDialog" max-width="500">
            <v-card class="mx-auto" rounded="lg">
              <div class="mt-4 py-1">
                <div class="text-h6 font-weight-bold d-flex justify-center">Bro World</div>
              </div>
              <Social @redirect="isRedirecting = true" />
              <div style="margin-top: -20px;">
                <LoginModalForm @success="loginDialog = false" />
              </div>
            </v-card>
          </v-dialog>
        </div>
      </v-card>
    </template>
  </ClientOnly>
  </div>
</template>
