<template>
  <v-row justify="center" class="align-center justify-center mx-4">
    <v-col cols="12" class="mx-4">
      <v-banner
        v-if="loggedIn && !user?.enabled"
        color="primary"
        icon="mdi-alert-circle"
        lines="one"
        class="mb-1 px-8 text-center rounded-lg"
      >
        <template #text>
          Your account is currently <strong>not activated</strong>. Please check your email or
          <span class="text-primary font-weight-medium cursor-pointer" @click="requestActivation">
        request activation
      </span>
          or contact support.
        </template>
      </v-banner>
    </v-col>
  </v-row>

</template>

<script setup lang="ts">
const { user, loggedIn } = useUserSession()
async function requestActivation() {
  try {
    await $fetch(`/api/users/${user.value.id}/request-activation`, {
      method: 'POST',
    })
    alert('Activation request sent successfully.')
  } catch (e) {
    alert('Failed to send activation request.')
  }
}
</script>
