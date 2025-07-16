<template>
  <v-col cols="12" md="12">
    <v-card rounded="0" elevation="20">
      <template #title>
        <div class="d-flex align-center">
          <span class="icon" v-html="icons.experience"></span>
          <h6 class="ms-2 text-h7 text-body-1 font-weight-bold">Experience</h6>
        </div>
      </template>
      <div class="d-flex justify-center">
        <v-progress-linear
          bg-color="primary"
          class="mx-auto mb-2"
          color="primary"
          height="5"
          model-value="100"
        ></v-progress-linear>
      </div>
      <v-card-text>
        <div class="px-3 padding-top-sm">
          <v-row class="mb-1">
            <v-col cols="8" class="d-flex align-center">
              <p class="text-body-2 font-weight-medium mb-0">
                Company name | 123 Anywhere, City Name
              </p>
            </v-col>

            <v-col cols="4" class="d-flex justify-end align-center">
              <p class="text-body-2 text-grey-darken-1 mb-0">2019–2022</p>
            </v-col>

            <p class="px-3 text-body-1 font-weight-bold">Job Position Here</p>

            <v-col cols="12">
              <p class="text-body-2 text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Necessitatibus, sequi quam excepturi dolores facere illum
                aut reiciendis nemo explicabo praesentium facilis autem quae
                rem nulla aperiam repudiandae fugiat assumenda delectus aliquam asperiores?
                Ea rerum at odit ducimus quidem placeat, quasi expedita, voluptatibus quas quod,
                alias repellendus eius recusandae eos fuga quam dolorum numquam dolor omnis
                mollitia provident! Dicta repellendus neque voluptatibus eligendi obcaecati eum
                tempora, nobis nisi cum, eaque laborum?
              </p>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex justify-center">
          <v-progress-linear
            bg-color="primary"
            class="mx-auto mb-2 progress-bar"
            color="primary"
            height="1"
            model-value="100"
          ></v-progress-linear>
        </div>
        <div class="px-3 padding-top-sm">
          <v-row class="mb-1">
            <v-col cols="8" class="d-flex align-center">
              <p class="text-body-2 font-weight-medium mb-0">
                Company name | 123 Anywhere, City Name
              </p>
            </v-col>

            <v-col cols="4" class="d-flex justify-end align-center">
              <p class="text-body-2 text-grey-darken-1 mb-0">2019–2022</p>
            </v-col>

            <p class="px-3 text-body-1 font-weight-bold">Job Position Here</p>

            <v-col cols="12">
              <p class="text-body-2 text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Necessitatibus, sequi quam excepturi dolores facere illum
                aut reiciendis nemo explicabo praesentium facilis autem quae
                rem nulla aperiam repudiandae fugiat assumenda delectus aliquam asperiores?
                Ea rerum at odit ducimus quidem placeat, quasi expedita, voluptatibus quas quod,
                alias repellendus eius recusandae eos fuga quam dolorum numquam dolor omnis
                mollitia provident! Dicta repellendus neque voluptatibus eligendi obcaecati eum
                tempora, nobis nisi cum, eaque laborum?
              </p>
            </v-col>
          </v-row>
        </div>
        <div class="d-flex justify-center">
          <v-progress-linear
            bg-color="primary"
            class="mx-auto mb-2 progress-bar"
            color="primary"
            height="1"
            model-value="100"
          ></v-progress-linear>
        </div>
        <div class="px-3 padding-top-sm">
          <v-row class="mb-1">
            <v-col cols="8" class="d-flex align-center">
              <p class="text-body-2 font-weight-medium mb-0">
                Company name | 123 Anywhere, City Name
              </p>
            </v-col>

            <v-col cols="4" class="d-flex justify-end align-center">
              <p class="text-body-2 text-grey-darken-1 mb-0">2019–2022</p>
            </v-col>

            <p class="px-3 text-body-1 font-weight-bold">Job Position Here</p>

            <v-col cols="12">
              <p class="text-body-2 text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Necessitatibus, sequi quam excepturi dolores facere illum
                aut reiciendis nemo explicabo praesentium facilis autem quae
                rem nulla aperiam repudiandae fugiat assumenda delectus aliquam asperiores?
                Ea rerum at odit ducimus quidem placeat, quasi expedita, voluptatibus quas quod,
                alias repellendus eius recusandae eos fuga quam dolorum numquam dolor omnis
                mollitia provident! Dicta repellendus neque voluptatibus eligendi obcaecati eum
                tempora, nobis nisi cum, eaque laborum?
              </p>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts" setup>
const props = defineProps({

});
const iconSize = 20;

const icons = {
  experience: `
<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24"><title>briefcase</title><path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" /></svg>`
}
</script>

<style scoped>
.progress-bar {
  width: 90%;
}
.icon {
  display: inline-block;
}
</style>
