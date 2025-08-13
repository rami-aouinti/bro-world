<!-- MenuToolbar.vue (Vuetify 3) -->
<template>
  <div class="d-flex gap-1">
    <!-- Bouton: Sections / Actions -->
    <v-menu
      v-model="menuOpen"
      :open-on-click="false"
      :close-on-content-click="false"
      persistent
      location="end"
      transition="scale-transition"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          size="small"
          class="ma-1 text-none border border-radius-xl border-secondary border-md"
          variant="outlined"
          rounded="lg"
          @click.stop="menuOpen = true"
        >
          <v-icon start icon="mdi-tune" />
        </v-btn>
      </template>

      <v-card
        class="pa-3 border-0"
        elevation="0"
        rounded="xl"
        width="360"
        style="position: relative; z-index: 1000;"
      >
        <!-- Bouton de fermeture -->
        <v-btn
          icon
          variant="text"
          size="small"
          color="primary"
          :ripple="false"
          style="position:absolute; top:16px; right:8px; z-index: 100;"
          @click.stop="menuOpen = false"
          aria-label="Close menu Sections"
          title="Close"
        >
          <v-icon icon="mdi-close" />
        </v-btn>
        <v-card-title class="text-uppercase text-default font-weight-bold">
          <v-icon size="small" icon="mdi-tune" class="mr-1" />
          Sections
        </v-card-title>
        <v-list class="py-2" density="compact" nav>
          <template v-for="(section, i) in sectionModels" :key="section.key">
            <div
              @mouseenter="$emit('hover-section', section.key)"
              @click="$emit('click-section', section.key)"
            >
              <v-list-subheader class="text-uppercase text-default font-weight-bold">
                <v-icon size="small" :icon="section.icon" class="mr-1" />
                {{ section.label }}
              </v-list-subheader>

              <!-- Groupe d’actions de la section (si présent) -->
              <v-item-group
                v-if="(section.actions?.length ?? 0) > 0"
                v-model="selectedLocal[section.key]"
                mandatory
                @update:modelValue="val => handleSectionChange(section.key, val)"
              >
                <div class="d-flex">
                  <v-item
                    v-for="a in section.actions"
                    :key="a.key"
                    :value="a.key"
                    v-slot="{ isSelected, toggle }"
                  >
                    <v-btn
                      class="ma-1 text-none"
                      :class="isSelected ? 'border border-radius-xl border-secondary border-md shadow-2xl shadow-primary' : 'border border-radius-xl border-secondary border-md'"
                      :variant="isSelected ? 'elevated' : 'text'"
                      size="small"
                      rounded="lg"
                      @click="toggle"
                    >
                      <v-icon v-if="a.icon" start :icon="a.icon" />
                      {{ a.label ?? a.key }}
                    </v-btn>
                  </v-item>
                </div>
              </v-item-group>

              <v-divider class="my-1" v-if="i < sectionModels.length - 1" />
            </div>
          </template>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'

type Section = {
  key: string
  label: string
  icon?: string
  actions: Array<{ key: string; label?: string; icon?: string }>
}

const props = defineProps<{
  sectionModels: Section[]
  modelValue?: Record<string, string | null>   // sélection par section (ex: { skills: 'two-col', ... })
  accent?: string                              // ui.accent (conservé pour compat, non utilisé ici)
  flatSwatches?: string[]                      // compat si déjà passé depuis le parent
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, string | null>): void
  (e: 'update:accent', v: string): void
  (e: 'action', sectionKey: string, actionKey: string): void
  (e: 'hover-section', sectionKey: string): void
  (e: 'click-section', sectionKey: string): void
}>()

const menuOpen = ref(false)

// Sélections locales synchronisées
const selectedLocal = reactive<Record<string, string | null>>({ ...(props.modelValue ?? {}) })

watch(
  () => props.modelValue,
  (v) => {
    if (!v) return
    for (const k of Object.keys(v)) selectedLocal[k] = v[k]
  },
  { deep: true }
)

function handleSectionChange(sectionKey: string, actionKey: string) {
  selectedLocal[sectionKey] = actionKey
  emit('update:modelValue', { ...selectedLocal })
  emit('action', sectionKey, actionKey)
}
</script>

<style scoped>
/* petit polish visuel optionnel */
</style>
