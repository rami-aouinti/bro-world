<script lang="ts" setup>
import AddNoteForm from "~/components/Crm/AddNoteForm.vue";
import NotesTable from "~/components/Crm/NotesTable.vue";

const { fetchNotes} = useNotes()
const {  fetchCustomers } = useCustomers()
fetchCustomers()
fetchNotes()

</script>

<template>
  <AddNoteForm class="col-span-2 md:col-span-1" />
  <NotesTable class="col-span-2" />
</template>
