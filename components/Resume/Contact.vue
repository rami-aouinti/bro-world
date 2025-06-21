<template>
  <div class="d-inline-flex align-center">
    <span v-html="icons.contact"></span>
    <h6 class="text-h6 ms-2 text-body-1 font-weight-bold">Contact</h6>
  </div>
  <v-divider :thickness="5"></v-divider>
  <div class="text-sm py-2">
    <div class="d-flex align-center py-1 text-sm">
      <span v-html="icons.phone" class="icon"></span>
      <a class="ms-2 text-sm" :href="`tel:${phone}`">{{ phone }}</a>
    </div>
    <div class="d-flex align-center py-1 text-sm">
      <span v-html="icons.email" class="icon"></span>
      <a class="ms-2 text-sm" :href="`mailto:${email}`">{{ email }}</a>
    </div>
    <div class="d-flex align-center py-1 text-sm">
      <span v-html="icons.map" class="icon"></span>
      <span class="ms-2">{{ address }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  phone: String,
  email: String,
  address: String,
});

const iconSize = 20;

const icons = {
  contact: `
<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" fill="white" viewBox="0 0 24 24">
<path d="M2,3V6H22V3H2M2,21H22V8H2V21M13,14H20V19H13V14M4,14H11V16H4V14M4,17H11V19H4V17Z" />
</svg>`,
  phone: `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
<path d="M20,15.5C18.83,15.5 17.67,15.3 16.56,14.91C16.29,14.81 15.98,14.88 15.77,15.09L13.21,17.65C10.07,15.87 8.13,13.93
6.35,10.79L8.91,8.23C9.12,8.02 9.19,7.71 9.09,7.44C8.7,6.33 8.5,5.17 8.5,4C8.5,3.45 8.05,3 7.5,3H4C3.45,3
3,3.45 3,4C3,14.39 9.61,21 20,21C20.55,21 21,20.55 21,20V16.5C21,15.95 20.55,15.5 20,15.5Z" />
</svg>`,
  email: `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24"><title>email</title><path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" /></svg>`,
  map: `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 24 24">
<path d="M12,6A6,6 0 0,1 18,12C18,16.67 12,22 12,22C12,22 6,16.67 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0
8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
</svg>`
};
</script>
