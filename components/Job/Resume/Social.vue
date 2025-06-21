<template>
  <FormSection
    title="Social Links"
    description="Add some social media links"
  >
    <v-row justify="center" class="mt-1">
      <v-btn
        v-for="(social, index) in socials"
        :key="social.name"
        :color="social.color"
        :icon="social.icon"
        size="x-small"
        class="ma-1"
        @click="openDialog(index)"
      />
    </v-row>

    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-text>
          <v-text-field
            :name="selectedSocial?.name"
            :id="selectedSocial?.name"
            :placeholder="selectedSocial?.placeholder"
            :model-value="modelValue"
            @input="handleInput"
            dense
            hide-details
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </FormSection>
</template>

<script setup>
import { ref, computed } from "vue";
import FormSection from "~/components/Job/Resume/FormSection.vue";

const emit = defineEmits([
  "update:facebook",
  "update:twitter",
  "update:instagram",
  "update:linkedin",
  "update:telegram",
  "update:github",
  "update:youtube"
]);

const props = defineProps([
  "facebook",
  "twitter",
  "instagram",
  "linkedin",
  "github",
  "telegram",
  "youtube",
]);

const socials = [
  { name: "facebook", color: "#3b5998", icon: "mdi-facebook", placeholder: "https://fb.com/elonmusk" },
  { name: "twitter", color: "#1da1f2", icon: "mdi-twitter", placeholder: "https://twitter.com/elonmusk" },
  { name: "instagram", color: "#e1306c", icon: "mdi-instagram", placeholder: "https://instagram.com/elonmusk" },
  { name: "linkedin", color: "#0077b5", icon: "mdi-linkedin", placeholder: "https://linkedin.com/in/elonmusk" },
  { name: "github", color: "#333333", icon: "mdi-github", placeholder: "https://github.com/elonmusk" },
  { name: "telegram", color: "#0088cc", icon: "mdi-telegram", placeholder: "https://t.me/elonmusk" },
  { name: "youtube", color: "#ff0000", icon: "mdi-youtube", placeholder: "https://youtube.com/@elonmusk" },
];

const dialog = ref(false);
const selectedSocial = ref(null);

const modelValue = computed(() => {
  if (!selectedSocial.value) return "";
  return props[selectedSocial.value.name] || "";
});

const openDialog = (index) => {
  selectedSocial.value = socials[index];
  dialog.value = true;
};

const handleInput = (event) => {
  if (selectedSocial.value) {
    emit(`update:${selectedSocial.value.name}`, event.target.value);
  }
};
</script>
