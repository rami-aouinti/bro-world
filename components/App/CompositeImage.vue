<template>
  <div
    class="group-avatar"
    :class="{ glow: isActive }"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <v-skeleton-loader
      v-if="loading"
      type="avatar"
      :width="size"
      :height="size"
      class="rounded-circle"
    />

    <template v-else>
      <template v-if="avatars.length === 1">
        <v-avatar :size="size">
          <NuxtImg :src="avatars[0]" />
        </v-avatar>
      </template>

      <template v-else-if="avatars.length === 2">
        <div class="two-avatars">
          <v-avatar v-for="(img, i) in avatars" :key="i" :size="size / 1.5">
            <NuxtImg :src="img" />
          </v-avatar>
        </div>
      </template>

      <template v-else>
        <div class="grid-avatars">
          <v-avatar
            v-for="(img, i) in avatars.slice(0, 4)"
            :key="i"
            :size="size / 2.2"
          >
            <NuxtImg :src="img" />
          </v-avatar>
        </div>
      </template>


    </template>
  </div>
</template>

<script setup lang="ts">
defineProps({
  avatars: {
    type: Array as () => string[],
    required: true,
  },
  size: {
    type: Number,
    default: 64,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  }
})
</script>

<style scoped>
.group-avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.two-avatars {
  margin-left: 65px;
  display: flex;
  gap: 4px;
}

.grid-avatars {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
}

.glow {
  box-shadow:
    0 0 8px var(--v-theme-primary),
    0 0 14px var(--v-theme-primary);
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite alternate;
}

@keyframes pulse-glow {
  from {
    box-shadow: 0 0 4px var(--v-theme-primary);
  }
  to {
    box-shadow: 0 0 20px var(--v-theme-primary);
  }
}

</style>
