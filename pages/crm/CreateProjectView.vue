<script lang="ts" setup>
import {reactive, ref} from "vue";
import {useUserProjectsStore} from "../../stores/task/userProjects";
import FormError from "~/components/Task/FormError.vue";
import FormSuccess from "~/components/Task/FormSuccess.vue";
import CommonProjectFormFields
  from "~/components/Task/CommonProjectFormFields.vue";
import LockableButton from "~/components/Task/LockableButton.vue";

const projectId = ref();
const project = reactive({
  name: '',
  description: '',
  finishDate: null
});
const userProjectsStore = useUserProjectsStore();
const isLocked = ref(false);

function onSubmit() {
  projectId.value = null;
  isLocked.value = true;

  return userProjectsStore.create(project)
      .then((response) => {
        if (!userProjectsStore.error) {
          projectId.value = project.id;
          project.name = '';
          project.description = '';
          project.finishDate = null;
        }

        return response;
      })
      .finally(() => {
        isLocked.value = false;
      });
}
</script>

<template>
  <div class="container-md">
    <h3 class="my-4">Create project</h3>
    <form @submit.prevent="onSubmit">
      <fieldset class="row mt-4" :disabled="isLocked">
        <div class="col">
        </div>
        <div class="col-md-9">
          <FormError :error="userProjectsStore.error" />
          <FormSuccess v-if="projectId">
            Successfully saved. <RouterLink :to="{name: 'project', params: { id: projectId }}">View</RouterLink> this project info.
          </FormSuccess>
          <CommonProjectFormFields :project="project" />
          <div class="mb-3 text-end">
            <LockableButton type="submit" class="btn btn-primary" :locked="isLocked">Save</LockableButton>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>
