<template>
  <draggable
    v-model="internalItems"
    group="taxon"
    item-key="id"
    :move="onMove"
    @end="onDragEnd"
  >
    <template #item="{ element }">
      <div>
        <v-list-item class="pl-2">
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2 d-flex align-center">
              <v-btn icon size="x-small" variant="text" @click="emit('edit', element)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <span class="ml-2">{{ element.name }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Children Tree -->
        <div class="ml-4 mt-1">
          <!-- initialize children if absent -->
          <TaxonTree
            v-if="(element.children ||= [])"
            :items="element.children"
            @update:items="emitUpdate"
            @edit="emit('edit', $event)"
          />
        </div>
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps<{
  items: any[]
}>()

const emit = defineEmits(['update:items', 'edit'])

const internalItems = ref([...props.items])

watch(
  () => props.items,
  (val) => {
    internalItems.value = [...val]
  },
  { deep: true }
)

// Always allow movement
function onMove() {
  return true
}

// Emit update when tree changes
function emitUpdate(items: any[]) {
  emit('update:items', items)
}

// Called when drag ends
function onDragEnd() {
  emit('update:items', internalItems.value)
}
</script>
