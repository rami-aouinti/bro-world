<template>
  <v-card flat class="pa-0 mt-2">
    <PersonalGrid v-model="model.personal" />
    <v-row class="g-2" no-gutters>
      <v-col cols="12" md="6">
        <InfoRow icon="mdi-account" label="Name">
          <EditableText v-model="model.identity.name" placeholder="Vorname Nachname" />
        </InfoRow>
        <InfoRow icon="mdi-cake-variant" label="Geburtstag">
          <EditableText
            v-model="model.identity.birth"
            dir="ltr"
            placeholder="Geburtstag eingeben"
          />        </InfoRow>
        <InfoRow icon="mdi-map-marker" label="Adresse">
          <EditableText
            v-model="model.contact.address"
            dir="ltr"
            placeholder="Address eingeben"
          />
          <EditableText
            v-model="model.contact.city"
            dir="ltr"
            placeholder="City eingeben"
          />
        </InfoRow>
      </v-col>
      <v-col cols="12" md="6">
        <InfoRow icon="mdi-phone" label="Telefon">
          <EditableText
            v-model="model.contact.phone"
            dir="ltr"
            placeholder="Telefon eingeben"
          />
        </InfoRow>
        <InfoRow icon="mdi-email" label="E-Mail">
          <EditableText
            v-model="model.contact.email"
            dir="ltr"
            placeholder="Email eingeben"
          />
        </InfoRow>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import InfoRow from '@/components/cv/parts/InfoRow.vue'
import EditableText from "~/components/common/EditableText.vue";
import PersonalGrid from "~/components/cv/PersonalGrid.vue";
const props = defineProps<{ model: any }>()
const emit = defineEmits<{ (e:'update-field', ev:Event, path:string):void }>()
function onInput(e: Event, path: string){ emit('update-field', e, path) }
</script>

<style scoped>
/* quand tu veux explicitement du RTL (ex. champ arabe) */
[contenteditable] { direction: rtl; text-align: right; }
.editable{ padding:6px 10px; border-radius:6px; }
.editable:focus{ outline: 2px solid rgba(0,0,0,.15); }
</style>
