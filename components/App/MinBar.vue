<template>
  <div
    class="d-none d-lg-block"
    style="position: fixed; top: 76px; left: 0; width: 310px; height: calc(100vh - 100px); overflow-y: auto; padding: 0 8px;"
  >
    <ClientOnly>
      <template v-if="loading">
        <v-skeleton-loader type="card" class="mx-3 rounded-xl" height="400" />
      </template>
      <template v-else>
        <v-card rounded="xl" class="bg-gradient-primary shadow-primary mx-3" variant="text" elevation="10" width="256">
          <v-layout v-if="loggedIn">
            <v-navigation-drawer absolute>
              <v-list>
                <v-list-item
                  to="/profile"
                  :prepend-avatar="user.photo"
                  :subtitle="user.email"
                  :title="user.firstName + ' ' + user.lastName"
                >
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <div id="menu-bar-world"></div>
            </v-navigation-drawer>
            <v-main style="height: 410px;"></v-main>
          </v-layout>
          <v-layout v-else>
            <v-navigation-drawer absolute>
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
                <login-form></login-form>
              </div>
            </v-navigation-drawer>
            <v-main style="height: 480px;"></v-main>
          </v-layout>
        </v-card>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import LoginForm from "~/components/Auth/LoginForm.vue";

const { user, loggedIn } = await useUserSession()
const isRedirecting = ref(false)
import { ref, onMounted, nextTick } from 'vue'
import Social from "~/components/Auth/Social.vue";

const loading = ref(true)
onMounted(async () => {
  try {
    await nextTick()
  } catch (e) {
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
</style>
