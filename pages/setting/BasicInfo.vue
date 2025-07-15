<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";

const { user } = await useUserSession()
const pending = ref(false)
const loading = ref(false)
const gender = ["Female", "Male"];
const languages = ["English", "French", "Spanish", "German", "Chinese"];
const skills = ["JavaScript", "Vue.js", "React", "Node.js", "Python"];
const userData = ref({
  title:  '',
  description:  '',
  firstName:  '',
  lastName:  '',
  gender:  '',
  birthday:  '',
  birthMonth:  '',
  birthDay:  '',
  birthYear:  '',
  email: '',
  confirmEmail: '',
  location: '',
  phone: '',
  address: '',
  language: '',
  skills: [],
});

const loadProfile = async () => {
  pending.value = true
  if (user.value.username) {
    const  data  = await $fetch(`/api/profile/${user.value.username}`)
    if (data) {
      userData.value = {
        title: data?.profile?.title || '',
        description: data?.profile?.description || '',
        firstName: data?.firstName || '',
        lastName: data?.lastName || '',
        gender: data?.profile?.gender || '',
        birthday: data?.profile?.birthday || '',
        birthMonth: data?.birthMonth || '',
        birthDay: data?.birthDay || '',
        birthYear: data?.birthYear || '',
        email: data?.email || '',
        confirmEmail: data?.email || '',
        location: data?.location || '',
        phone: data?.profile?.phone || '',
        address: data?.profile?.address || '',
        language: data?.language || '',
        skills: [],
      };
    }
  }
  pending.value = false
}

const saveProfile = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append('firstName', userData?.value.firstName);
  formData.append('lastName', userData?.value.lastName);
  formData.append('title', userData?.value.title);
  formData.append('description', userData?.value.description);
  formData.append('gender', userData?.value.gender);
  formData.append('phone', userData?.value.phone);
  formData.append('address', userData?.value.address);
  if (userData?.value?.birthday) {
    const rawDate = userData?.value.birthday;
    const rawDateStr = String(rawDate)
    const cleanedDate = rawDateStr.replace(/\s*\(.*?\)\s*$/, '');
    formData.append('birthday', cleanedDate);
  }

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
        birthday: response.data.value?.birthday,
        birthMonth: response.data.value?.birthMonth,
        birthDay: response.data.value?.birthDay,
        birthYear: response.data.value?.birthYear,
        email: response.data.value?.email,
        confirmEmail: response.data.value?.email,
        location: response.data.value?.location,
        phone: response.data.value?.profile.phone,
        address: response.data.value?.profile.address,
        language: response.data.value?.language,
        skills: [],
      };
      loading.value = false;
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
    elevation="10"
    id="basic"
    class="bg-gradient-primary shadow-primary py-4"
    rounded="xl"
    variant="text"
  >
    <div class="px-6 py-6">
      <h5 class="text-h5 font-weight-bold text-typo">Basic Info</h5>
    </div>
    <div class="px-6 pb-6 pt-0">
      <v-form :loading="loading" ref="formRef">
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field density="compact" rounded="xl" variant="outlined" v-model="userData.title" label="Title" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field density="compact" rounded="xl" variant="outlined" v-model="userData.description" label="Description" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field density="compact" rounded="xl" variant="outlined" v-model="userData.firstName" label="First Name" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field density="compact" rounded="xl" variant="outlined" v-model="userData.lastName" label="Last Name" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="3">
            <v-select density="compact" rounded="xl" variant="outlined" v-model="userData.gender" :items="gender" label="Gender" />
          </v-col>
          <v-col cols="12" sm="3">
            <v-date-input
              v-model="userData.birthday"
              density="compact"
              rounded="xl"
              label="Date of birth"
              prepend-icon=""
              variant="outlined"
              persistent-placeholder
            ></v-date-input>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field density="compact" v-model="userData.address" rounded="xl" label="Address" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field density="compact" rounded="xl" variant="outlined" v-model="userData.phone" label="Phone Number" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field density="compact" rounded="xl" variant="outlined" v-model="userData.email" label="Email" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field density="compact" rounded="xl" variant="outlined" v-model="userData.confirmEmail" label="Confirmation Email" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn :loading="loading" :disabled="loading" color="primary" @click="saveProfile">Save</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-card>
</template>


