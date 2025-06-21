<script setup lang="ts">
import Social from "~/components/Job/Resume/Social.vue";
import Profile from "~/components/Job/Resume/Profile.vue";
import Preview from "~/components/Job/Resume/Preview.vue";

const data = ref({
  n: "",
  d: "",
  i: "",
  f: "",
  t: "",
  ig: "",
  gh: "",
  tg: "",
  l: "",
  e: "",
  w: "",
  y: "",
  ls: [],
});
const publish = `1?data=${encodeData(data.value)}`;

const downloadPdf = async () => {
  const res = await useFetch('/api/resume/export-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: publish })
  })

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'resume.pdf'
  link.click()

  URL.revokeObjectURL(url)
}

</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="12">
        <v-row>
          <v-col cols="12" md="3">
            <v-row>
              <v-btn @click="downloadPdf">Exporter en PDF</v-btn>
              <v-col cols="12" md="12">
                <Social v-model:facebook="data.f"
                                 v-model:twitter="data.t"
                                 v-model:instagram="data.ig"
                                 v-model:github="data.gh"
                                 v-model:telegram="data.tg"
                                 v-model:linkedin="data.l"
                                 v-model:email="data.e"
                                 v-model:whatsapp="data.w"
                                 v-model:youtube="data.y" />
              </v-col>
              <v-col cols="12" md="12">
                <Profile
                  v-model:name="data.n"
                  v-model:desc="data.d"
                  v-model:image="data.i"
                  v-model:email="data.e"
                  v-model:whatsapp="data.w"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="9">
            <v-card class="position-sticky top-1 transparent-card">
            <Preview :data="data" />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.transparent-card {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
}
</style>
