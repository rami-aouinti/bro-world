<template>
  <div :dir="isRtl ? 'rtl' : 'ltr'">
    <!-- Skeleton au chargement -->
    <template v-if="showCard">
      <v-skeleton-loader
        type="card"
        class="mx-3 mb-4 rounded-xl"
        height="350"
      />
    </template>

    <!-- Liste des blogs -->
    <div v-else>
      <v-card
        rounded="xl"
        class="mx-3 mb-1"
        variant="text"
        elevation="10"
        height="350"
        aria-label="Media card"
      >
        <v-toolbar
          color="transparent"
        >
          <v-app-bar-nav-icon color="primary"></v-app-bar-nav-icon>

          <v-toolbar-title>My files</v-toolbar-title>

          <v-btn color="primary" icon="mdi-magnify"></v-btn>

          <v-btn @click="dialog = !dialog" color="primary" icon="mdi-plus"></v-btn>

        </v-toolbar>
        <v-divider />
        <v-list max-height="280" class="bg-transparent" role="list" lines="two">

          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
          >
            <template v-slot:prepend>
              <v-avatar :class="[item.iconClass]" :icon="item.icon"></v-avatar>
            </template>

            <v-list-item-title>{{ item.title }}</v-list-item-title>

            <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>

            <template v-slot:append>
              <v-list-item-action>
                <v-btn color="grey-lighten-1" icon="mdi-information" variant="text"></v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            v-for="item in items2"
            :key="item.title"
            link
          >
            <template v-slot:prepend>
              <v-avatar :class="[item.iconClass]" :icon="item.icon"></v-avatar>
            </template>

            <v-list-item-title>{{ item.title }}</v-list-item-title>

            <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>

            <template v-slot:append>
              <v-list-item-action>
                <v-btn color="grey-lighten-1" icon="mdi-information" variant="text"></v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>

        <v-dialog
          v-model="dialog"
          max-width="500"
        >
          <v-card>
            <v-card-text>
              <v-text-field label="File name"></v-text-field>

              <small class="text-grey">* This doesn't actually save.</small>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="primary"
                variant="text"
                @click="dialog = false"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t, locale } = useI18n()
const router = useRouter()

const isRtl = computed(() => ['ar', 'he', 'fa', 'ur'].includes(locale.value))
const { loggedIn } = useUserSession()

const showCard = ref(true)
const dialog = ref(false)
const items = ref([
  { icon: 'mdi-folder', iconClass: 'bg-grey-lighten-1 text-white', title: 'Photos', subtitle: 'Jan 9, 2014' },
  { icon: 'mdi-folder', iconClass: 'bg-grey-lighten-1 text-white', title: 'Recipes', subtitle: 'Jan 17, 2014' },
  { icon: 'mdi-folder', iconClass: 'bg-grey-lighten-1 text-white', title: 'Work', subtitle: 'Jan 28, 2014' },
])
const items2 = ref([
  { icon: 'mdi-clipboard-text', iconClass: 'bg-blue text-white', title: 'Vacation itinerary', subtitle: 'Jan 20, 2014' },
  { icon: 'mdi-gesture-tap-button', iconClass: 'bg-amber text-white', title: 'Kitchen remodel', subtitle: 'Jan 10, 2014' },
])
onMounted(async () => {
  showCard.value = false
})

</script>
