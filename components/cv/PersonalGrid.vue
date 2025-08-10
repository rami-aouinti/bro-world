<template>
  <div
    class="personal-grid-wrapper"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <v-btn
      v-if="isHovered"
      class="neu-component-add-btn"
      size="small"
      variant="outlined"
      color="primary"
      prepend-icon="mdi-plus"
      @click="add"
    >
      neuer Eintrag
    </v-btn>
    <draggable
      v-model="localItems"
      item-key="id"
      handle=".drag"
      animation="150"
      class="grid"
    >
      <template #item="{ element, index }">
        <div class="tile">
          <div class="drag" title="Glisser pour réordonner">
            <v-icon icon="mdi-dots-grid" size="18" />
          </div>

          <div class="label">
            <span class="align-center justify-center d-flex me-1" v-html="ICONS[element.icon]" />
            {{ element.label }}
          </div>

          <div class="value">
            <EditableText
              v-model="localItems[index].value"
              :placeholder="element.placeholder || 'Text tippen...'"
            />
          </div>
          <div class="delete" title="Delete this item">
            <v-icon color="error" icon="mdi-delete" size="18" @click="remove(index)" />
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import EditableText from '@/components/common/EditableText.vue'
const ICONS = {
  'mdi-account': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><title>account-circle</title><path fill="currentColor" d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" /></svg>`,
  'mdi-phone': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><title>phone</title><path fill="currentColor" d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" /></svg>`,
  'mdi-email': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><title>email</title><path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" /></svg>`,
  'mdi-cake-variant': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><title>cake-variant</title><path fill="currentColor" d="M12,6C13.11,6 14,5.1 14,4C14,3.62 13.9,3.27 13.71,2.97L12,0L10.29,2.97C10.1,3.27 10,3.62 10,4A2,2 0 0,0 12,6M16.6,16L15.53,14.92L14.45,16C13.15,17.29 10.87,17.3 9.56,16L8.5,14.92L7.4,16C6.75,16.64 5.88,17 4.96,17C4.23,17 3.56,16.77 3,16.39V21A1,1 0 0,0 4,22H20A1,1 0 0,0 21,21V16.39C20.44,16.77 19.77,17 19.04,17C18.12,17 17.25,16.64 16.6,16M18,9H13V7H11V9H6A3,3 0 0,0 3,12V13.54C3,14.62 3.88,15.5 4.96,15.5C5.5,15.5 6,15.3 6.34,14.93L8.5,12.8L10.61,14.93C11.35,15.67 12.64,15.67 13.38,14.93L15.5,12.8L17.65,14.93C18,15.3 18.5,15.5 19.03,15.5C20.11,15.5 21,14.62 21,13.54V12A3,3 0 0,0 18,9Z" /></svg>`,
  'mdi-map-marker': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><title>map-marker</title><path fill="currentColor" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" /></svg>`,
};
type Item = {
  id: string
  icon: string
  label: string
  value: string
  placeholder?: string
}

const props = defineProps<{ modelValue: Item[] }>()
const emit = defineEmits<{ (e:'update:modelValue', v: Item[]): void }>()

const isHovered = ref(false)


const localItems = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

function add() {
  localItems.value = [
    ...localItems.value,
    {
      id: `p-${crypto.randomUUID()}`,
      icon: 'mdi-text',
      label: 'Neues Feld',
      value: '',
      placeholder: 'Wert',
    },
  ]
}
function remove(i: number) {
  const copy = [...localItems.value]
  copy.splice(i, 1)
  localItems.value = copy
}

watch(localItems, (newItems) => {
  const nameItem = newItems.find(item => item.id === 'name')
  if (nameItem) {
    // on émet aussi un événement dédié pour mettre à jour model.identity.name
    emit('update-name', nameItem.value)
  }
}, { deep: true })
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 colonnes */
}
@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr; }
}
.tile {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  padding: 4px;
  border-radius: 12px;
  margin:4px;
}
.neu-component-add-btn {
  position: absolute;
  top: 150px;
  right: 5px;
}
.drag {
  position: absolute;
  top: 10px;
  right: 0px;
  cursor: grab;
  opacity: .6;
}
.label{ width:90px; font-weight:600; opacity:.85; display:flex; align-items:center; }
.value{ flex:1; }
.delete {
  position: absolute;
  right: 16px;
  top: 10px;
}
.tile .drag,
.tile .delete {
  opacity: 0;
  pointer-events: none;   /* évite les clics quand caché */
  transition: opacity .15s ease;
}

.tile:hover .drag,
.tile:hover .delete {
  opacity: 1;
  pointer-events: auto;
}

/* Option: sur mobile (pas de hover), toujours visibles */
@media (hover: none) {
  .tile .drag,
  .tile .delete {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
