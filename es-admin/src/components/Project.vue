<script setup>

import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store from '../store';
import { changedProjects } from '@/store';
import NotFound from './NotFound.vue';
import EnvironmentCreateDialog from './EnvironmentCreateDialog.vue';
import EnvironmentEditDialog from './EnvironmentEditDialog.vue';
import EnvironmentDeleteDialog from './EnvironmentDeleteDialog.vue';
import ProjectDeleteDialog from './ProjectDeleteDialog.vue';
import uuid from '@/uuid.js';

const router = useRouter();
const route = useRoute();
const props = defineProps({
  id: { type: String, required: true },
});

const cachedProjects = [];

const project = ref(null);
const projectDeleteDialog = ref(null);
const environmentCreateDialog = ref(null);
const projectName = ref(null);

const refs = new Map();
function registerRef(targetRef) {
  if (targetRef) {
    refs.set(targetRef.$el.id, targetRef);
  }
}

function createEnvironment(environment) {
  project.value.environments.push({ ...environment, ...{ id: uuid() } });
}

function updateEnvironment(targetEnvironment) {
  const index = project.value.environments.findIndex(environment => environment.id === targetEnvironment.id);
  if (index === -1) {
    throw Error('Could not find environment');
  }
  project.value.environments[index] = targetEnvironment;
}

function deleteEnvironment(targetEnvironment) {
  project.value.environments = project.value.environments.filter(environment => environment.id !== targetEnvironment.id);
}

async function saveProject() {
  const savedProject = await store.update(project.value);
  project.value = savedProject;
  changedProjects.remove(savedProject.id);
}

async function revert() {
  const storedProject = await store.get(props.id);
  if (storedProject) {
    project.value = storedProject;
  }
  changedProjects.remove(storedProject.id);

  // Remove cached project.
  const index = cachedProjects.findIndex(cachedProject => cachedProject.id === props.id);
  if (index !== -1) {
    cachedProjects.splice(index, 1);
  }
}

async function deleteProject() {
  await store.delete(project);
  await router.push({ name: 'home' });
}

async function projectWatcher() {
  const originalProject = JSON.stringify(await store.get(props.id));
  const method = JSON.stringify(project.value) === originalProject ? 'remove' : 'add';
  changedProjects[method](project.value.id);
}

watch(project, projectWatcher, { deep: true });

async function routeParamsWatcher(projectId) {
  const cachedProject = cachedProjects.find(targetProject => targetProject.id === projectId);
  if (cachedProject) {
    project.value = cachedProject;
  } else {
    project.value = await store.get(props.id);
    cachedProjects.push(project.value);
  }
}
watch(() => route.params.id, routeParamsWatcher, { immediate: true });
</script>

<template>
  <div>
    <div v-if="project" class="project">
      <h1>{{ project.name }} <sup v-if="changedProjects.has(project.id) && project.name.length > 0" aria-label="Changed">*</sup></h1>
      <form @submit.prevent="saveProject">
        <div class="form-element">
          <label for="name">Project name</label>
          <input id="name" ref="projectName" v-model="project.name" type="text" name="name" required>
        </div>
        <table>
          <caption>Environments</caption>
          <thead>
            <tr>
              <th>Name</th><th>Enabled</th><th>Base URL</th><th>Operations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="environment in project.environments" :key="environment.id">
              <td>{{ environment.name }}</td>
              <td>{{ environment.status ? 'Yes' : 'No' }}</td>
              <td><a :href="environment.baseUrl">{{ environment.baseUrl }}</a></td>
              <td class="operations">
                <button type="button" class="small" @click="refs.get('edit-environment-' + environment.id).open()">Edit</button>
                <button type="button" class="small danger" @click="refs.get('dialog-delete-environment-' + environment.id).open()">Delete</button>
              </td>
            </tr>
            <tr v-if="project.environments.length === 0">
              <td colspan="4">The are no environments yet.</td>
            </tr>
          </tbody>
        </table>
        <div class="actions">
          <button class="primary">Save</button>
          <button class="secondary" type="button" :disabled="!changedProjects.has(id)" @click="revert">Revert</button>
          <button class="danger" type="button" @click="projectDeleteDialog.open()">Delete</button>
          <button class="create-environment" type="button" @click="environmentCreateDialog.open()">+ Create environment</button>
        </div>
      </form>
      <EnvironmentCreateDialog ref="environmentCreateDialog" @submit="createEnvironment"/>
      <EnvironmentEditDialog v-for="environment in project.environments" :id="`edit-environment-${environment.id}`" :key="environment.id" :ref="registerRef" :environment="{...environment}" @submit="updateEnvironment"/>
      <EnvironmentDeleteDialog v-for="environment in project.environments" :id="`dialog-delete-environment-${environment.id}`" :key="environment.id" :ref="registerRef" :environment="{...environment}" @submit="deleteEnvironment"/>
      <ProjectDeleteDialog ref="projectDeleteDialog" @submit="deleteProject"/>
    </div>
    <NotFound v-else />
  </div>
</template>

<style scoped>
  h1 {
    margin-bottom: var(--sp3);
    min-height: calc(var(--s0) *2);
  }

  sup {
    color: var(--c-orange);
    font-size: 0.65em;
  }

  .project > form > *:not(dialog) {
    margin-bottom: var(--sp3);
  }

  caption {
    font-size: var(--s0);
    font-weight: bold;
    text-align: left;
  }

  table td:nth-child(2) {
    text-align: center;
  }

  table th:nth-child(4),
  table td:nth-child(4) {
    width: 130px;
    text-align: center;
  }

  table button {
    margin: 0 var(--sm5);
  }

  .create-environment {
    margin-left: auto;
  }

  label {
    margin-bottom: var(--sm3);
  }

  .actions button:not(:nth-child(4)) {
    width: 80px;
  }
</style>
