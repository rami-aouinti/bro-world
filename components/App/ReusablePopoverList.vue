<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  icon: string
  title?: string
  items: any[]
  badgeCount?: number
  batchSize?: number
  height?: number
  color?: string
  emptyText?: string
  footerText?: string
  footerUrl?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['loaded', 'open'])

const isOpen = ref(false)
const displayed = ref<any[]>([])
const batch = computed(() => props.batchSize ?? 5)

function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
  const already = displayed.value.length
  const next = props.items.slice(already, already + batch.value)

  if (next.length === 0) {
    done('empty')
    return
  }

  displayed.value.push(...next)
  emit('loaded', displayed.value)
  done('ok')
}

// Reset displayed list when items change
watch(() => props.items, () => {
  displayed.value = props.items.slice(0, batch.value)
})

// Emit event when menu opens
watch(isOpen, (opened) => {
  if (opened) {
    emit('open')
  }
})
</script>

<template>
  <v-menu v-model="isOpen" location="bottom">
    <template #activator="{ props: menuProps }">
      <v-btn icon :title="title" v-bind="menuProps" class="ml-0 opacity-80" :color="color ?? 'secondary'">
        <v-badge
          v-if="badgeCount && badgeCount > 0"
          :content="badgeCount"
          :color="color ?? 'primary'"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-badge>
        <v-icon v-else>{{ icon }}</v-icon>
      </v-btn>
    </template>

    <v-list :min-width="300" class="pa-1">
      <v-infinite-scroll
        v-if="displayed.length"
        :min-height="height ?? 80"
        :max-height="height ?? 300"
        :items="displayed"
        @load="load"
      >
        <template v-for="(item, index) in displayed" :key="item.id || index">
          <slot name="item" :item="item" />
        </template>
      </v-infinite-scroll>

      <v-list-item
        v-if="!displayed.length && emptyText"
        class="d-flex justify-center text-center pa-2"
      >
        <h6 class="text-body-2">{{ emptyText ?? 'No items available' }}</h6>
      </v-list-item>
      <v-list-item
        v-if="footerText"
        :to="footerUrl"
        class="d-flex justify-center text-center pa-2"
      >
        <h6 class="text-sm font-weight-normal text-typo mb-1">
          {{ footerText }}
        </h6>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
