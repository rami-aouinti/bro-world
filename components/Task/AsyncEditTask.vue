<script lang="ts" setup>
import FormSuccess from "./FormSuccess.vue";
import LockableButton from "./LockableButton.vue";
import FormError from "./FormError.vue";
import {ref} from "vue";
import {useProjectStore} from "../../stores/task/project";
import {useRoute} from "vue-router";
import TaskStatus from "./TaskStatus.vue";
import {useTaskStore} from "../../stores/task/task";
import CommonTaskFormFields from "./CommonTaskFormFields.vue";

const route = useRoute();
const id = route.params.id;
const taskId = route.params.taskId;
const success = ref(false);
const projectStore = useProjectStore();
const taskStore = useTaskStore();

await projectStore.load(id);
await taskStore.load(taskId);
const project = projectStore.project(id);
const task = taskStore.task(taskId);
const isTaskEditor = project.isOwner;

async function onSubmit() {
  success.value = false;
  await taskStore.update(taskId)
      .then((result) => {
        if (!taskStore.error(taskId)) {
          success.value = true;
        }
        return result;
      });
}

async function toggleStatus() {
  await taskStore.toggleStatus(taskId);
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <fieldset :disabled="taskStore.isLocked(taskId) || project.status === 0 || task.status === 0 || !isTaskEditor">
      <FormError :error="taskStore.error(taskId)" />
      <FormSuccess v-if="success">Successfully saved.</FormSuccess>
      <div class="mb-3">
        <label class="form-label">Status</label>
        <div class="h5">
              <span v-if="taskStore.isLocked(taskId)" class="badge bg-light text-dark">
                <div class="spinner-border spinner-border-sm mx-1" role="status" />Loading...
              </span>
          <span v-else>
                <a href="#" v-if="project.status !== 0 && isTaskEditor" @click.prevent="toggleStatus"><TaskStatus :status="task.status" /></a>
                <TaskStatus v-else :status="task.status" />
              </span>
        </div>
      </div>
      <CommonTaskFormFields :project="project" :task="task" />
      <div class="mb-3 text-end" v-if="isTaskEditor">
        <LockableButton type="submit" class="btn btn-primary" :locked="taskStore.isLocked(taskId)">Save</LockableButton>
      </div>
    </fieldset>
  </form>
</template>
