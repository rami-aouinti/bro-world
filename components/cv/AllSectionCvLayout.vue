<template>
  <v-menu
    v-model="openLocal"
    :close-on-content-click="false"
    :open-on-click="false"
    persistent
    transition="scale-transition"
    :location="menuLocation"
  >
    <!-- Activator interne (optionnel) -->
    <template v-if="!hideActivator" #activator="{ props: act }">
      <v-btn
        v-bind="act"
        variant="outlined"
        size="small"
        class="rounded-xl text-none px-4"
        @click.stop="openLocal = true"
      >
        <v-icon start icon="mdi-tune-variant" />
      </v-btn>
    </template>

    <v-card class="pa-0" elevation="10" rounded="xl" width="680">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between px-4 py-3">
        <div class="text-subtitle-1 font-weight-600 d-flex align-center">
          <v-icon class="mr-2" :icon="activeSection?.icon || 'mdi-tune-variant'" />
          {{ activeSection?.label || 'Settings' }}
        </div>

        <v-btn icon variant="text" size="small" :ripple="false" @click.stop="openLocal = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </div>
      <v-divider />

      <v-row class="ma-0">
        <!-- Liste des sections -->
        <v-col cols="4" class="pa-3 sections-list">
          <v-list nav density="compact">
            <v-list-item
              v-for="s in sections"
              :key="s.key"
              :active="s.key === activeKey"
              rounded="lg"
              @click="setActive(s.key)"
            >
              <template #prepend>
                <v-icon :icon="s.icon || 'mdi-shape-outline'" />
              </template>
              <v-list-item-title class="text-body-2">{{ s.label }}</v-list-item-title>
              <v-list-item-subtitle
                v-if="s.description"
                class="text-caption text-medium-emphasis mt-1 line-clamp-2"
              >
                {{ s.description }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Panneau section -->
        <v-col cols="8" class="pa-3">
          <v-slide-x-transition mode="out-in">
            <div :key="activeKey">
              <template v-if="activeSection">
                <!-- En-tête section (icône + label + description) -->
                <div class="d-flex align-start mb-3">
                  <v-avatar size="32" class="mr-2">
                    <v-icon :icon="activeSection.icon || 'mdi-tune-variant'" />
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-2 font-weight-600">{{ activeSection.label }}</div>
                    <div v-if="activeSection.description" class="text-caption text-medium-emphasis">
                      {{ activeSection.description }}
                    </div>
                  </div>
                </div>

                <!-- Champs -->
                <div v-if="(activeSection.fields?.length || 0) > 0">
                  <div
                    v-for="f in activeSection.fields"
                    :key="f.key"
                    class="mb-3"
                  >
                    <!-- SWITCH -->
                    <template v-if="f.type === 'switch'">
                      <div class="d-flex align-center justify-space-between">
                        <div class="text-body-2">{{ f.label }}</div>
                        <v-switch
                          hide-details
                          density="compact"
                          inset
                          :model-value="read(activeKey, f.key)"
                          @update:modelValue="val => write(activeKey, f.key, val)"
                        />
                      </div>
                    </template>

                    <!-- SLIDER -->
                    <template v-else-if="f.type === 'slider'">
                      <div class="text-body-2 mb-1">{{ f.label }}</div>
                      <v-slider
                        hide-details
                        thumb-label="always"
                        density="compact"
                        :min="f.min" :max="f.max" :step="f.step || 1"
                        :model-value="read(activeKey, f.key)"
                        @update:modelValue="val => write(activeKey, f.key, val)"
                      />
                    </template>

                    <!-- SELECT -->
                    <template v-else-if="f.type === 'select'">
                      <div class="text-body-2 mb-1">{{ f.label }}</div>
                      <v-select
                        hide-details
                        density="compact"
                        :items="f.items || []"
                        item-title="title"
                        item-value="value"
                        :model-value="read(activeKey, f.key)"
                        @update:modelValue="val => write(activeKey, f.key, val)"
                      />
                    </template>

                    <!-- SEGMENTED -->
                    <template v-else-if="f.type === 'segmented'">
                      <div class="text-body-2 mb-1">{{ f.label }}</div>
                      <v-item-group
                        :model-value="read(activeKey, f.key)"
                        @update:modelValue="val => write(activeKey, f.key, val)"
                        mandatory
                        density="compact"
                      >
                        <div class="d-flex flex-wrap">
                          <v-item
                            v-for="opt in f.options || []"
                            :key="opt.value"
                            :value="opt.value"
                            v-slot="{ isSelected, toggle }"
                          >
                            <v-btn
                              size="small"
                              class="ma-1 text-none px-2 py-1"
                              :variant="isSelected ? 'elevated' : 'text'"
                              :class="isSelected
                                ? 'border border-radius-xl border-secondary border-md shadow-2xl shadow-primary'
                                : 'border border-radius-xl border-secondary border-md'"
                              @click="toggle"
                            >
                              <v-icon v-if="opt.icon" start :icon="opt.icon" />
                              {{ opt.label ?? String(opt.value) }}
                            </v-btn>
                          </v-item>
                        </div>
                      </v-item-group>
                    </template>

                    <!-- SWATCHES -->
                    <template v-else-if="f.type === 'swatches'">
                      <div class="text-body-2 mb-1">{{ f.label || 'Accent' }}</div>
                      <v-item-group
                        :model-value="read(activeKey, f.key)"
                        @update:modelValue="val => write(activeKey, f.key, val)"
                        mandatory
                      >
                        <div class="d-flex flex-wrap">
                          <v-item
                            v-for="c in (f.colors || swatches)"
                            :key="c"
                            :value="c"
                            v-slot="{ isSelected, toggle }"
                          >
                            <v-btn
                              class="ma-1"
                              :class="isSelected ? 'elevation-12' : ''"
                              size="small"
                              :style="{
                                backgroundColor: c,
                                borderRadius: '8px',
                                minWidth: '28px',
                                width: '28px',
                                height: '28px'
                              }"
                              :elevation="isSelected ? 8 : 1"
                              @click="toggle"
                            />
                          </v-item>
                        </div>
                      </v-item-group>
                    </template>

                    <!-- BUTTON (actions spéciales) -->
                    <template v-else-if="f.type === 'button'">
                      <v-btn
                        block
                        :color="f.color || 'primary'"
                        variant="outlined"
                        class="text-none"
                        @click="$emit('action', activeKey, f.action || f.key)"
                      >
                        <v-icon v-if="f.icon" start :icon="f.icon" />
                        {{ f.label }}
                      </v-btn>
                    </template>
                  </div>
                </div>

                <div v-else class="text-caption text-medium-emphasis">
                  Aucun réglage pour cette section.
                </div>
              </template>
            </div>
          </v-slide-x-transition>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

/** Types */
type SegOpt = { value: any; label?: string; icon?: string }
type Field =
  | { type: 'switch'; key: string; label: string }
  | { type: 'slider'; key: string; label: string; min: number; max: number; step?: number }
  | { type: 'select'; key: string; label: string; items: Array<{ title: string; value: any }> }
  | { type: 'segmented'; key: string; label: string; options: SegOpt[] }
  | { type: 'swatches'; key: string; label?: string; colors?: string[] }
  | { type: 'button'; key: string; label: string; action?: string; icon?: string; color?: string }

type SectionCfg = {
  key: string
  label: string
  icon?: string
  /** ✅ description facultative (affichée dans la liste et le header) */
  description?: string
  fields: Field[]
}

const props = defineProps<{
  sections: SectionCfg[]
  bindings: Record<string, any>
  swatches?: string[]
  /** v-model: ouvrir/fermer */
  modelValue?: boolean
  /** section active initiale (clé) */
  active?: string
  /** masquer l’activator interne (utile si tu ouvres via openSettings()) */
  hideActivator?: boolean
  /** emplacement du menu (fallback: bottom-end ; si hideActivator, défaut: center) */
  location?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'action', sectionKey: string, actionKey: string): void
  (e: 'changed', sectionKey: string, fieldKey: string, value: any): void
  (e: 'update:active', v: string): void
}>()

/** Etat d’ouverture (v-model) */
const openLocal = computed({
  get: () => props.modelValue ?? false,
  set: v  => emit('update:modelValue', v),
})

/** Sections + initialisation sur la 1ère si aucune active */
const sections = computed(() => props.sections || [])
const hideActivator = computed(() => !!props.hideActivator)
const menuLocation = computed(() => props.location || (hideActivator.value ? 'center' : 'bottom-end'))
const swatches = computed(() =>
  props.swatches || ['#1E88E5','#43A047','#8E24AA','#37474F','#0D47A1','#FB8C00','#E53935','#D81B60','#3949AB','#4E342E']
)

const activeKey = ref<string>('')

/** initialise l’activeKey :
 *  - props.active si fourni et existe
 *  - sinon la 1ère section disponible
 */
function ensureActive() {
  const list = sections.value
  if (!list.length) { activeKey.value = ''; return }
  const fromProp = props.active && list.some(s => s.key === props.active) ? props.active : null
  activeKey.value = fromProp ?? list[0].key
  emit('update:active', activeKey.value)
}

// 1) à l’ouverture du menu, 2) si la liste change, 3) au montage
watch(() => openLocal.value, (v) => { if (v) ensureActive() })
watch(sections, () => ensureActive(), { deep: true, immediate: true })
watch(() => props.active, () => ensureActive(), { immediate: true })

const activeSection = computed(() => sections.value.find(s => s.key === activeKey.value))

function setActive(key: string) {
  if (key === activeKey.value) return
  activeKey.value = key
  emit('update:active', key)
}

/** lecture / écriture dans l’objet de binding correspondant */
function read(sectionKey: string, fieldKey: string) {
  const obj = props.bindings?.[sectionKey]
  return obj ? obj[fieldKey] : undefined
}
function write(sectionKey: string, fieldKey: string, value: any) {
  const obj = props.bindings?.[sectionKey]
  if (obj) {
    obj[fieldKey] = value
    emit('changed', sectionKey, fieldKey, value)
  }
}
</script>

<style scoped>
.sections-list :deep(.v-list-item--active) {
  background-color: rgba(0,0,0,.05);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
