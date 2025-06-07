<template>
  <v-card
    id="delete"
    class="py-4"
    rounded="xl"
    variant="text"
  >
    <v-row>
      <v-col cols="12">
        <div class="px-6 py-6">
          <h5 class="text-h5 font-weight-bold text-typo mb-2">
            Delete Account
          </h5>
          <p class="text-sm text-body font-weight-light">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
        </div>
      </v-col>
      <v-col cols="12"class="my-auto">
        <div class="px-6 pt-0">
          <div class="d-sm-flex align-center ms-auto">
            <v-btn
              variant="text"
              class="font-weight-bolder btn-outline-secondary"
              small
            >
              Deactivate
            </v-btn>
            <v-btn
              variant="text"
              class="font-weight-bolder btn-danger bg-gradient-danger"
              small
            >
              Delete Account
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: 'DeleteAccount',
}
</script>
