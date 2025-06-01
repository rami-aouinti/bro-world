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
        firstName: data.value?.firstName || '',
        lastName: data.value?.lastName || '',
        gender: data.value?.gender || '',
        birthMonth: data.value?.birthMonth || '',
        birthDay: data.value?.birthDay || '',
        birthYear: data.value?.birthYear || '',
        email: data.value?.email || '',
        confirmEmail: data.value?.email || '',
        location: data.value?.location || '',
        phone: data.value?.phone || '',
        language: data.value?.language || '',
        skills: [],
      };
    }
  }
  pending.value = false
}
const saveProfile = async () => {
  try {
    await useFetch('/api/profile/update', {
      method: 'POST',
      body: userData.value,
      credentials: 'include',
    })
    alert("Profile updated successfully!");
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
          <v-col cols="6">
            <v-text-field variant="outlined" v-model="userData.firstName" label="First Name" />
          </v-col>
          <v-col cols="6">
            <v-text-field variant="outlined" v-model="userData.lastName" label="Last Name" />
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="4" cols="12">
            <v-select variant="outlined" v-model="userData.gender" :items="gender" label="Gender" />
          </v-col>
          <v-col sm="8">
            <v-row>
              <v-col cols="5">
                <v-select variant="outlined" v-model="userData.birthMonth" :items="months" label="Month" />
              </v-col>
              <v-col cols="3">
                <v-select variant="outlined" v-model="userData.birthDay" :items="days" label="Day" />
              </v-col>
              <v-col cols="4">
                <v-select variant="outlined" v-model="userData.birthYear" :items="years" label="Year" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field variant="outlined" v-model="userData.email" label="Email" />
          </v-col>
          <v-col cols="6">
            <v-text-field variant="outlined" v-model="userData.confirmEmail" label="Confirmation Email" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field variant="outlined" v-model="userData.location" label="Your Location" />
          </v-col>
          <v-col cols="6">
            <v-text-field variant="outlined" v-model="userData.phone" label="Phone Number" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select variant="outlined" v-model="userData.language" :items="languages" label="Language" />
          </v-col>
          <v-col cols="6">
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


