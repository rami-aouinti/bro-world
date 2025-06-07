<!-- Help.vue -->
<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <h1 class="text-h4 font-weight-bold mb-6">Help & FAQ</h1>

        <v-expansion-panels>
          <v-expansion-panel title="What is Bro World?">
            <v-expansion-panel-text>
              Bro World is a social web platform where you can post, chat, and add functional plugins to customize your experience.
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="How do I install a plugin?">
            <v-expansion-panel-text>
              Go to the Plugins section. If the plugin is not installed, click on "Install". Once installed, it will be accessible via the "Open" button.
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Is it free to use?">
            <v-expansion-panel-text>
              Yes, Bro World is free to use. Some plugins are free, while others may be marked as "Paid".
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Can I post anything I want?">
            <v-expansion-panel-text>
              You can post freely, but please respect others. Any abusive, harmful, or illegal content may be removed according to our community guidelines.
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel title="Who is behind Bro World?">
            <v-expansion-panel-text>
              Bro World is built by a passionate developer who believes in freedom, creativity, and social connection through modern web technologies.
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Static page — no logic needed
</script>
