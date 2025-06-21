<template>
  <FormSection
    title="Profile"
    description="Some public information about you"
  >
    <v-card class="card-shadow border-radius-xl" id="basic">
      <div class="px-3 py-2 mb-3">
        <h5 class="text-h6 font-weight-bold text-typo">Basic Info</h5>
      </div>
      <div class="px-2 pb-6 pt-1">
        <v-row>
          <v-col cols="12">
            <v-text-field
              name="photo-url"
              id="photo-url"
              label="Photo Url"
              v-model="modelImage"
              variant="solo-filled"
              class="font-size-input input-style"
              dense
              flat
              filled
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              name="name"
              id="name"
              autocomplete="given-name"
              label="Full Name"
              v-model="modelName"
              variant="solo-filled"
              class="font-size-input input-style"
              dense
              flat
              filled
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              id="about"
              name="about"
              hide-details
              variant="solo-filled"
              label="Description"
              class="input-style font-size-input text-light-input placeholder-light"
              dense
              flat
              filled
              height="43"
              v-model="modelDesc"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              name="email"
              id="email"
              label="Email"
              v-model="email"
              variant="solo-filled"
              class="font-size-input input-style"
              dense
              flat
              filled
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              name="whatsapp"
              id="whatsapp"
              label="Phone"
              v-model="whatsapp"
              variant="solo-filled"
              class="font-size-input input-style"
              dense
              flat
              filled
              clearable
              hide-details
            />
          </v-col>
        </v-row>
      </div>
    </v-card>
  </FormSection>
</template>

<script setup>
import FormSection from "~/components/Job/Resume/FormSection.vue";

const props = defineProps(["name", "desc", "image", "email", "whatsapp"]);
const emit = defineEmits(["update:name", "update:desc", "update:image", "update:email", "update:whatsapp"]);

import { computed } from "vue";

const modelName = computed({
  get: () => props.name,
  set: (value) => emit("update:name", value),
});

const email = computed({
  get: () => props.email,
  set: (value) => emit("update:email", value),
});

const whatsapp = computed({
  get: () => props.whatsapp,
  set: (value) => emit("update:whatsapp", value),
});

const modelDesc = computed({
  get: () => props.desc,
  set: (value) => emit("update:desc", value),
});

const modelImage = computed({
  get: () => props.image,
  set: (value) => emit("update:image", value),
});
</script>
