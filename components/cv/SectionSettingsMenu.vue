<template>
  <v-menu
    v-model="openLocal"
    :activator="activator || undefined"
  :close-on-content-click="false"
  :open-on-click="!hideActivator"
  transition="scale-transition"
  location="bottom-end"
  :scrim="false"
  scroll-strategy="reposition"
  >
  <!-- Bouton interne (optionnel) -->
  <template #activator v-if="!hideActivator">
    <v-btn
      variant="outlined"
      size="small"
      class="rounded-xl text-none px-4"
      @click.stop="openLocal = true"
    >
      <v-icon start icon="mdi-tune-variant" />
      Settings
    </v-btn>
  </template>

  <v-card
    class="pa-0"
    elevation="8"
    rounded="xl"
    :width="hasList ? 620 : 480"
  >
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
      <!-- Liste sections → visible seulement si > 1 -->
      <v-col
        v-if="hasList"
        cols="4"
        class="pa-3"
        style="border-right: 1px solid rgba(0,0,0,.06);"
      >
        <v-list nav density="compact">
          <v-list-item
            v-for="s in sectionsList"
            :key="s.key"
            :active="s.key === activeKey"
            @click="setActive(s.key)"
          >
            <template #prepend>
              <v-icon :icon="s.icon" />
            </template>
            <v-list-item-title class="text-body-2">
              {{ s.label }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>

      <!-- Contenu -->
      <v-col :cols="hasList ? 8 : 12" class="pa-3">
        <v-slide-x-transition mode="out-in">
          <div :key="activeKey">
            <template v-if="fields.length">
              <div v-for="f in fields" :key="f.key" class="mb-3">
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
                        :key="String(opt.value)"
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
                          {{ opt.label ?? opt.value }}
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
                        v-for="c in (f.colors || swatchesList)"
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

                <!-- BUTTON -->
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
            </template>

            <template v-else>
              <div class="text-caption text-medium-emphasis">
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
import { ref, computed, watch } from 'vue'

type SegOpt = { value: any; label?: string; icon?: string }
type Field =
  | { type: 'switch';    key: string; label: string }
  | { type: 'slider';    key: string; label: string; min: number; max: number; step?: number }
  | { type: 'select';    key: string; label: string; items: Array<{ title: string; value: any }> }
  | { type: 'segmented'; key: string; label: string; options: SegOpt[] }
  | { type: 'swatches';  key: string; label?: string; colors?: string[] }
  | { type: 'button';    key: string; label: string; action?: string; icon?: string; color?: string }

type SectionCfg = { key: string; label: string; icon?: string; fields: Field[] }

const props = defineProps<{
  sections: SectionCfg[]
  bindings: Record<string, any>
  swatches?: string[]
  modelValue?: boolean
  active?: string
  hideActivator?: boolean
  /** Passe un sélecteur CSS (ex: '#toolbar-settings') ou un élément HTMLElement */
  activator?: string | Element | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'action', sectionKey: string, actionKey: string): void
  (e: 'changed', sectionKey: string, fieldKey: string, value: any): void
}>()

const openLocal = computed({
  get: () => props.modelValue ?? false,
  set: v  => emit('update:modelValue', v),
})

const sectionsList = computed(() => props.sections || [])
const hasList      = computed(() => (sectionsList.value?.length || 0) > 1)
const swatchesList = computed(() =>
  props.swatches || ['#1E88E5','#43A047','#8E24AA','#37474F','#0D47A1','#FB8C00','#E53935','#D81B60','#3949AB','#4E342E']
)

const activeKey = ref(props.active || sectionsList.value?.[0]?.key || '')
watch([() => props.active, sectionsList], () => {
  const keys = new Set((sectionsList.value || []).map(s => s.key))
  if (!keys.has(activeKey.value)) {
    activeKey.value = props.active && keys.has(props.active)
      ? props.active
      : sectionsList.value?.[0]?.key || ''
  }
}, { immediate: true })

const activeSection = computed(() => sectionsList.value.find(s => s.key === activeKey.value))
const fields        = computed(() => activeSection.value?.fields || [])

function setActive(key: string) {
  activeKey.value = key
}

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
