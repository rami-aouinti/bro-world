<template>
  <base-form-section
    title="Social Links"
    description="Add some social media links"
  >
    <v-row>
      <v-col cols="12" md="12">
        <div>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span
              class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
            >
              <v-icon>mdi-facebook</v-icon>
            </span>
            <input
              type="search"
              name="facebook"
              id="facebook"
              :value="facebook"
              @input="$emit('update:facebook', $event.target.value)"
              class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://fb.com/elonmusk"
            />
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="12">
        <div>
          <div class="flex rounded-md shadow-sm">
            <span
              class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
            >
              <v-icon>mdi-twitter</v-icon>
            </span>
            <input
              type="search"
              name="twitter"
              id="twitter"
              :value="twitter"
              @input="$emit('update:twitter', $event.target.value)"
              class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://twitter.com/elonmusk"
            />
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="12">
        <div>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span
              class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
            >
              <v-icon>mdi-instagram</v-icon>
            </span>
            <input
              type="search"
              name="instagram"
              id="instagram"
              :value="instagram"
              @input="$emit('update:instagram', $event.target.value)"
              class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://instagram.com/elonmusk"
            />
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="12">
        <div>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span
              class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
            >
              <v-icon>mdi-github-circle</v-icon>
            </span>
            <input
              type="search"
              name="github"
              id="github"
              :value="github"
              @input="$emit('update:github', $event.target.value)"
              class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://github.com/elonmusk"
            />
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="12">
        <div>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span
              class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
            >
              <v-icon>mdi-telegram</v-icon>
            </span>
            <input
              type="search"
              name="telegram"
              id="telegram"
              :value="telegram"
              @input="$emit('update:telegram', $event.target.value)"
              class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://t.me/elonmusk"
            />
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="12">
        <div>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span
              class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
            >
              <v-icon>mdi-linkedin</v-icon>
            </span>
            <input
              type="search"
              name="linkedin"
              id="linkedin"
              :value="linkedin"
              @input="$emit('update:linkedin', $event.target.value)"
              class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://linkedin.com/elonmusk"
            />
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="12">
        <div>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span
              class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
            >
              <v-icon>mdi-email</v-icon>
            </span>
            <input
              type="search"
              name="email"
              id="email"
              :value="email"
              @input="$emit('update:email', $event.target.value)"
              class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="elonmusk@geemail.com"
            />
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="12">
        <div>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span
              class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
            >
              <v-icon>mdi-youtube-play</v-icon>
            </span>
            <input
              type="search"
              name="youtube"
              id="youtube"
              :value="youtube"
              @input="$emit('update:youtube', $event.target.value)"
              class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://youtube.com/elonmusk"
            />
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="12">
        <div>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span
              class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
            >
              <v-icon>mdi-whatsapp</v-icon>
            </span>
            <input
              type="search"
              name="whatsapp"
              id="whatsapp"
              :value="whatsapp"
              @input="$emit('update:whatsapp', $event.target.value)"
              class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="+9190000000000"
            />
          </div>
        </div>
      </v-col>
    </v-row>
  </base-form-section>
</template>
<script setup>
const props = defineProps([
  "facebook",
  "twitter",
  "instagram",
  "linkedin",
  "github",
  "telegram",
  "whatsapp",
  "youtube",
  "email",
]);
</script>
