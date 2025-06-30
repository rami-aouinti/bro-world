<script lang="ts" setup>
import { ref } from "vue";

const { user } = await useUserSession()
const pending = ref(false)
const gender = ["Female", "Male"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());
const languages = ["English", "French", "Spanish", "German", "Chinese"];
const skills = ["JavaScript", "Vue.js", "React", "Node.js", "Python"];
const userData = ref({
  title:  '',
  description:  '',
  firstName:  '',
  lastName:  '',
  gender:  '',
  birthMonth:  '',
  birthDay:  '',
  birthYear:  '',
  email: '',
  confirmEmail: '',
  location: '',
  phone: '',
  language: '',
  skills: [],
});

const loadProfile = async () => {
  pending.value = true
  if (user.value.username) {
    const { data } = await useFetch(`/api/profile/${user.value.username}`)
    if (data.value) {
      userData.value = {
        title: data.value?.profile?.title || '',
        description: data.value?.profile?.description || '',
        firstName: data.value?.firstName || '',
        lastName: data.value?.lastName || '',
        gender: data.value?.profile?.gender || '',
        birthMonth: data.value?.birthMonth || '',
        birthDay: data.value?.birthDay || '',
        birthYear: data.value?.birthYear || '',
        email: data.value?.email || '',
        confirmEmail: data.value?.email || '',
        location: data.value?.location || '',
        phone: data.value?.profile?.phone || '',
        language: data.value?.language || '',
        skills: [],
      };
    }
  }
  pending.value = false
}

const saveProfile = async () => {
  const formData = new FormData();
  formData.append('firstName', userData?.value.firstName);
  formData.append('lastName', userData?.value.lastName);
  formData.append('title', userData?.value.title);
  formData.append('description', userData?.value.description);
  formData.append('gender', userData?.value.gender);
  formData.append('phone', userData?.value.phone);

  try {
    const response = await useFetch('/api/profile/update', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    if (response.data.value) {
      userData.value = {
        title: response.data.value?.profile.title,
        description: response.data.value?.profile.description,
        firstName: response.data.value?.firstName,
        lastName: response.data.value?.lastName,
        gender: response.data.value?.profile.gender,
        birthMonth: response.data.value?.birthMonth,
        birthDay: response.data.value?.birthDay,
        birthYear: response.data.value?.birthYear,
        email: response.data.value?.email,
        confirmEmail: response.data.value?.email,
        location: response.data.value?.location,
        phone: response.data.value?.profile.phone,
        language: response.data.value?.language,
        skills: [],
      };
    }

  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile.");
  }
};
watch(user.value.username, () => {
  loadProfile()
}, { immediate: true })

onMounted(async () => {
  await loadProfile()
})
</script>
<template>
  <v-card
    id="basic"
    class="py-4"
    rounded="xl"
    variant="text"
  >
    <div class="px-6 py-6">
      <h5 class="text-h5 font-weight-bold text-typo">Basic Info</h5>
    </div>
    <div class="px-6 pb-6 pt-0">
      <v-form ref="formRef">
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field rounded="xl" variant="outlined" v-model="userData.title" label="Title" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field rounded="xl" variant="outlined" v-model="userData.description" label="Description" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field rounded="xl" variant="outlined" v-model="userData.firstName" label="First Name" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field rounded="xl" variant="outlined" v-model="userData.lastName" label="Last Name" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <v-select variant="outlined" v-model="userData.gender" :items="gender" label="Gender" />
          </v-col>
          <v-col cols="12" sm="8">
            <v-date-input
              rounded="xl"
              label="Date of birth"
              prepend-icon=""
              variant="outlined"
              persistent-placeholder
            ></v-date-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field rounded="xl" variant="outlined" v-model="userData.email" label="Email" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field rounded="xl" variant="outlined" v-model="userData.confirmEmail" label="Confirmation Email" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field rounded="xl" label="Address" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field rounded="xl" label="City" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field rounded="xl" label="State" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field rounded="xl" label="Zip code" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field rounded="xl" variant="outlined" v-model="userData.location" label="Your Location" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field rounded="xl" variant="outlined" v-model="userData.phone" label="Phone Number" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-select variant="outlined" v-model="userData.language" :items="languages" label="Language" />
          </v-col>
          <v-col cols="12" md="6">
            <v-select variant="outlined" v-model="userData.skills" :items="skills" label="Skills" multiple chips />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn color="primary" @click="saveProfile">Save</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-card>
</template>


