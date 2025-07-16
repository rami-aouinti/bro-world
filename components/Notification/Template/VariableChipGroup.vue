<template>
  <div>
    <v-chip-group v-model="selection" selected-class="bg-deep-purple-lighten-2" column>
      <v-chip
        v-for="(variable, index) in data"
        :key="index"
        @click="handleChipClick(variable)"
        class="ma-1"
      >
        <span v-if="typeof variable === 'string'">
          {{ variable }}
        </span>
        <span v-else-if="typeof variable === 'object' && variable !== null">
          {{ Object.keys(variable)[0] }}
        </span>
      </v-chip>
    </v-chip-group>

    <!-- Dialog for object values -->
    <v-dialog v-model="dialog" max-width="300">
      <template #default>
        <v-card>
          <v-card-title>
            Content of "{{ selectedObjectKey }}"
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(item, i) in selectedObjectValues"
                :key="i"
              >
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="dialog = false" color="primary" variant="text">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue'

const selection = ref(null)
const dialog = ref(false)
const selectedObjectKey = ref('')
const selectedObjectValues = ref([])
defineProps({
  data: {
    type: Array,
    required: true
  }
})

function handleChipClick(variable) {
  if (typeof variable === 'object' && variable !== null) {
    const key = Object.keys(variable)[0]
    selectedObjectKey.value = key
    selectedObjectValues.value = variable[key]
    dialog.value = true
  }
}
</script>
