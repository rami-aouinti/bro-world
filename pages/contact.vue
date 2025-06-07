<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <h1 class="text-h6 font-weight-bold mb-4">Contact Us</h1>
        <v-form @submit.prevent="sendMessage">
          <v-text-field
            v-model="form.name"
            label="Your Name"
            required
            outlined
            class="mb-4"
          />

          <v-text-field
            v-model="form.email"
            label="Your Email"
            required
            type="email"
            outlined
            class="mb-4"
          />

          <v-textarea
            v-model="form.message"
            label="Your Message"
            required
            auto-grow
            outlined
            class="mb-4"
          />

          <v-btn type="submit" color="primary" class="mt-2">
            Send Message
          </v-btn>
        </v-form>
      </v-col>
      <v-col cols="12" md="6">
        <h2 class="text-h6 font-weight-bold mb-4">Location</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2521.357954112808!2d6.8267341!3d50.9487694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bf2624c3b909f9%3A0x91a64c5e276e91c6!2s50%C2%B056'55.6%22N%206%C2%B049'45.5%22E!5e0!3m2!1sen!2sde!4v1717777777777!5m2!1sen!2sde"
          width="100%"
          height="340"
          style="border:5px; border-radius: 12px"
          allowfullscreen=""
          loading="lazy"
        ></iframe>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: '',
})

function sendMessage() {
  // Replace with real API or mail sending logic
  console.log('Message sent:', form.value)
  alert('Thank you! Your message has been sent.')
  form.value = { name: '', email: '', message: '' }
}
</script>
