<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card rounded="xl" :loading="isUpdating">
      <template #loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="primary"
          height="4"
          indeterminate
        />
      </template>
      <v-card-title class="text-h6 text-primary px-6 py-4">
        Add Members
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              v-model="friends"
              :disabled="isUpdating"
              :items="users"
              color="blue-grey-lighten-2"
              item-title="id"
              item-value="id"
              label="Select"
              chips
              closable-chips
              multiple
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :prepend-avatar="item.raw?.profile?.photo"
                  :text="item.raw.firstName + ` ` + item.raw.lastName"
                ></v-chip>
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="item.raw?.profile?.photo ?? `/img/person.png`"
                  :subtitle="item.raw?.profile?.description"
                  :title="item.raw.firstName + ` ` +  item.raw.lastName"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :loading="isUpdating"
          :variant="isUpdating ? 'tonal' : undefined"
          color="blue-grey-lighten-3"
          prepend-icon="mdi-update"
          @click="addMembers"
        >
          Update Members
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, defineProps, defineEmits} from 'vue'
import {useUserStore} from "~/stores/admin/user/userStore";

const props = defineProps({ modelValue: Boolean, users: Array, blogId: String })
const emit = defineEmits(['update:modelValue'])
const loadingUsers = ref(true)
const userStore = useUserStore()
const friends = ref([])
const isUpdating = ref(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
const { user, loggedIn } = useUserSession()

const users = computed(() => userStore.users)

async function addMembers() {
  if (!friends.value.length) return
  isUpdating.value = true
  const selectedUserIds = [...friends.value]

  const formData = new FormData()

  await useFetch(`/api/world/${props.blogId}/teams`, {
    method: 'PATCH',
    body: JSON.stringify({
      teams: selectedUserIds,
    }),
  })
  await new Promise(resolve => setTimeout(resolve, 1000))
  isUpdating.value = false
  dialog.value = false
}


async function fetchUsers() {
  await userStore.fetchUsers()
  loadingUsers.value = false
}

watch(loadingUsers, fetchUsers, { immediate: true })
onMounted(await fetchUsers)

</script>
