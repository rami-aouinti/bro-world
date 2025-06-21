<template>
  <ClientOnly>
  <v-row id="pdf-content">
    <v-col cols="4">
      <v-card rounded="0" class="mx-auto bg-primary full-height" elevation="20">
        <div class="pa-4">
          <Profile
            :name="acc.n"
            image="img/team-1.jpg"
            title="Marketing Manager"
          ></Profile>
          <div class="d-flex justify-center py-1">
            <Social></Social>
          </div>

          <div>
            <About :description="acc.d"></About>
          </div>
          <div>
            <Contact
              phone="+880 1765923094"
              email="alaminhimu0@gmail.com"
              address="Santibug, Rangpur"
            ></Contact>
          </div>
          <div>
            <div class="d-flex align-center">
              <span class="education-icon" v-html="educationIcons.education"></span>
              <h6 class="text-h7 ms-2 text-body-1 font-weight-bold">Education</h6>
            </div>
            <v-divider :thickness="5"></v-divider>
            <Education
              school="Higher Secondary Certificate"
              date="2019-2022"
              description="Collectorate School & College"
            ></Education>
            <v-divider :thickness="2"></v-divider>
            <Education
              school="Higher Secondary Certificate"
              date="2019-2022"
              description="Collectorate School & College"
            ></Education>
            <v-divider :thickness="2"></v-divider>
            <Education
              school="Higher Secondary Certificate"
              date="2019-2022"
              description="Collectorate School & College"
            ></Education>
          </div>
          <div>
            <div class="d-flex align-center">
              <span class="icon" v-html="icons.skills"></span>
              <h6 class="text-h7 ms-2 text-body-1 font-weight-bold">Skills</h6>
            </div>
            <v-divider :thickness="5"></v-divider>
            <div class="px-0 py-2 text-sm">
              <Stars label="HTML" :score="80"></Stars>
              <Stars label="PHP" :score="50"></Stars>
              <Stars label="CSS" :score="40"></Stars>
            </div>
          </div>
          <div>
            <div class="d-flex align-center">
              <svg width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>earth</title>
                <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
              <h6 class="text-h7 ms-2 text-body-1 font-weight-bold">Languages</h6>
            </div>
            <v-divider :thickness="5"></v-divider>
            <div class="px-0 py-2 text-sm">
              <Language label="Deutsch" :stars="4"/>
              <Language label="French" :stars="3" />
              <Language label="English" :stars="5" />
            </div>
          </div>
          <div>
            <Interests :items="items"></Interests>
          </div>
        </div>
      </v-card>

    </v-col>
    <v-col cols="8">
      <v-row>
        <Experience></Experience>
        <Experience></Experience>
        <Experience></Experience>
      </v-row>
    </v-col>
  </v-row>
  <v-btn color="primary" @click="handleExport">Télécharger le PDF</v-btn>
  </ClientOnly>
</template>

<script lang="ts" setup>

import { defineProps } from 'vue'
import Stars from "~/components/Resume/Stars.vue";
import Language from "~/components/Resume/Language.vue";
import Contact from "~/components/Resume/Contact.vue";
import Social from "~/components/Resume/Social.vue";
import Profile from "~/components/Resume/Profile.vue";
import Education from "~/components/Resume/Education.vue";
import Interests from "~/components/Resume/Interests.vue";
import About from "~/components/Resume/About.vue";
import Experience from "~/components/Resume/Experience.vue";


const iconSize = 20;

const icons = {
  skills: `
<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" fill="white" viewBox="0 0 24 24">
  <path d="M20 17H4V15H20V17M20 13H4V11H20V13M20 7V9H4V7H20Z" />
</svg>`
};


const handleExport = async () => {
  if (typeof window === 'undefined') return

  const html2pdf = (await import('html2pdf.js')).default
  const element = document.getElementById('pdf-content')

  // ⏳ Attendre chargement des images
  await Promise.all(
    Array.from(element.querySelectorAll('img')).map((img) => {
      return new Promise((resolve) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve(null)
        } else {
          img.onload = img.onerror = () => resolve(null)
        }
      })
    })
  )

  const opt = {
    margin:       0,
    filename:     'resume.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  }
  html2pdf().set(opt).from(element).save()
}
const props = defineProps({
  acc: {
    type: Object,
    required: true,
  },
});
const items = [
  { text: 'My Files', icon: 'mdi-folder' },
  { text: 'Shared with me', icon: 'mdi-account-multiple' },
]

const educationIconSize = 20;

const educationIcons = {
  education: `
<svg xmlns="http://www.w3.org/2000/svg" width="${educationIconSize}" height="${educationIconSize}" fill="white" viewBox="0 0 24 24">
  <path d="M5 13.18V17H3V11L12 6L21 11V17H19V13.18L12 17L5 13.18M12 8.27L6.18 11.5L12 14.73L17.82 11.5L12 8.27Z" />
</svg>`
};
</script>
<style scoped>
.full-height {
  min-height: 100%;
}
.icon {
  display: inline-block;
}

@media print {
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
