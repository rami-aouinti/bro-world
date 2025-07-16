<script setup lang="ts">
const props = defineProps<{
  dialogCreateWorld: boolean
  plugins: any[]
  loading: boolean
  loggedIn: boolean
}>()

const CreateWorldDialog = defineAsyncComponent(() => import('~/components/App/Home/CreateWorldDialog.vue'))
const Blogs = defineAsyncComponent(() => import('~/pages/home/dashboard/Blogs.vue'))
</script>

<template>
  <v-card class="mx-3 mb-4" rounded="xl" variant="text" elevation="10">
    <div class="d-flex justify-center">
      <v-btn
        class="font-weight-bold w-100"
        color="primary"
        height="80"
        variant="text"
        @click="$emit('update:dialogCreateWorld', true)"
      >
        <h6 class="text-h6 font-weight-bolder mb-0">Build your World Bro</h6>
      </v-btn>
    </div>
  </v-card>

  <CreateWorldDialog :modelValue="props.dialogCreateWorld" :plugins="props.plugins" />

  <Suspense>
    <template #default>
      <Blogs v-if="loggedIn" />
    </template>
    <template #fallback>
      <v-skeleton-loader type="card" class="rounded-xl mx-3 mb-3" height="140" />
    </template>
  </Suspense>
</template>
