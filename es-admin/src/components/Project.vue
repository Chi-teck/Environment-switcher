<script setup>
import {ref, toRaw, watch} from 'vue';
import store from '../store';
import uuid from '../uuid';
import Dialog from './Dialog.vue';
import EnvironmentForm from './EnvironmentForm.vue';
import { changedProjects } from '@/store';
import NotFound from './NotFound.vue';
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();
const props = defineProps(['id', 'required']);
let project = ref(null);

const projectDeleteDialog = ref(null);
const environmentCreateDialog = ref(null);
const environmentCreateForm = ref(null);

const refs = new Map();
function registerRef(ref) {
  if (ref) {
    refs.set(ref.$el.id, ref)
  }
}

function createEnvironment(environment) {
  environment = { ...environment };
  environment.id = uuid();
  project.value.environments.push(environment);
}

function updateEnvironment(environment) {
  const { id } = environment;
  const index = project.value.environments.findIndex(environment => environment.id === id);
  project.value.environments[index] = environment;
}

function deleteEnvironment(environment) {
  const { id } = environment;
  const environments = project.value.environments.filter(environment => environment.id !== id);
  console.log(environments);
  project.value.environments = environments;
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
}

async function deleteProject() {
  await store.delete(project);
  changedProjects.remove(project.id);
  await router.push({ name: 'home' });
}

async function projectWatcher () {
  const method = JSON.stringify(project.value) === originalProject ? 'remove' : 'add';
  changedProjects[method](project.value.id);
}
watch(project, projectWatcher, { deep: true });

let originalProject = null;
watch(
  () => route.params.id,
  async () => { project.value = await store.get(props.id); originalProject = JSON.stringify(project.value) },
  { immediate: true },
)
</script>

<template>
  <div>
    <div v-if="project" class="project">
      <h1>{{ project.name }} <sup v-if="changedProjects.has(project.id) && project.name.length > 0" aria-label="Changed">*</sup></h1>
      <form @submit.prevent="saveProject">
        <div class="form-element">
          <label for="name">Project name</label>
          <input id="name" v-model="project.name" type="text" name="name" required>
        </div>
        <table>
          <caption>Environments</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Base URL</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="{id, name, status, baseUrl} in project.environments" :key="id">
              <td>{{ name }}</td>
              <td>{{ status ? 'Enabled' : 'Disabled' }}</td>
              <td><a :href="baseUrl">{{ baseUrl }}</a></td>
              <td class="operations">
                <button type="button" class="small" @click="refs.get('dialog-edit-environment-' + id).open()">Edit</button>
                <button type="button" class="small danger" @click="refs.get('dialog-delete-environment-' + id).open()">Delete</button>
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
      <Dialog ref="environmentCreateDialog" header="Create Environment" @close="environmentCreateForm.reset()">
        <EnvironmentForm ref="environmentCreateForm" :environment="{name: '', status: true, baseUrl: ''}" method="dialog" @save="createEnvironment" @cancel="environmentCreateDialog.close()"/>
      </Dialog>
      <Dialog :id="`dialog-edit-environment-${environment.id}`" :ref="registerRef" v-for="environment in project.environments" :key="environment.id" header="Edit Environment" @close="refs.get(`form-edit-environment-${environment.id}`).reset()">
        <EnvironmentForm :id="`form-edit-environment-${environment.id}`" :ref="registerRef" :environment="{...environment}" method="dialog" @save="updateEnvironment" @cancel="refs.get(`dialog-edit-environment-${environment.id}`).close()"/>
      </Dialog>
      <Dialog :id="`dialog-delete-environment-${environment.id}`" :ref="registerRef" v-for="environment in project.environments" :key="environment.id" header="Delete Environment?">
        <form method="dialog" @submit="deleteEnvironment(environment)">
          <p>This action cannot be undone.</p>
          <div class="actions">
            <button class="danger">Delete</button>
            <button data-close-modal type="button">Cancel</button>
          </div>
        </form>
      </Dialog>
      <Dialog ref="projectDeleteDialog" header="Delete project?">
        <form method="dialog" @submit="deleteProject">
          <p>This action cannot be undone.</p>
          <div class="actions">
            <button class="danger">Delete</button>
            <button data-close-modal type="button">Cancel</button>
          </div>
        </form>
      </Dialog>
    </div>
    <NotFound v-else />
  </div>
</template>

<style scoped>
    h1 {
        margin-bottom: var(--sp3);
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

    .actions {
        display: flex;
        gap: var(--sm3);
    }

    .actions button:not(:nth-child(4)) {
        width: 80px;
    }

    form p {
      margin-top: 0;
      margin-bottom: var(--sp2);
    }
</style>
