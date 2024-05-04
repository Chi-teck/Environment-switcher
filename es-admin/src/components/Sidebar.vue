<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import store, { changedProjects } from '../store';

const router = useRouter();
const projects = ref([]);

async function createProject() {
  const project = await store.create();
  await router.push(
    { name: 'project', params: { id: project.id } },
  );
}

async function updateProjects() {
  projects.value = await store.getAll();
}

store.addListener(updateProjects);
onMounted(updateProjects);
</script>

<template>
  <div class="sidebar">
    <button type="button" class="primary" @click="createProject">Create Project</button>
    <hr>
    <ul v-if="projects.length > 0">
      <li v-for="{id, name} in projects" :key="id">
        <router-link :to="{name: 'project', params: {id}}" class="sidebar__project">
          <div class="link-text">
            {{ name }}<sup v-if="changedProjects.has(id)" aria-label="Changed">*</sup>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .sidebar {
    padding: var(--s0);
    background-color: var(--c-snow);
    border-right: solid 1px var(--c-border);
  }
  .sidebar > * {
    margin-bottom: var(--s0);
  }
  hr {
    margin-top: 0;
    border-top: 1px solid var(--c-border);
  }
  button {
    width: 100%;
    text-transform: uppercase;
    height: var(--sp5);
  }
  button:active {
    background-color: var(--c-venice);
    transition: background-color 0.25s;
  }
  ul {
    list-style: none;
    padding-left: 0;
  }
  li {
    margin-bottom: var(--s0);
  }
  li a {
    background-color: white;
    padding: 0 var(--s0);
    border: solid 1px var(--c-silver);
    height: var(--sp5);
    color: var(--c-whale);
    text-decoration: none;
    display: flex;
    align-items: center;
  }
  .sidebar__project.active {
    box-shadow: inset 5px 0 var(--c-orange);
    border-left-color: var(--c-orange);
  }
  .sidebar__project:active {
    box-shadow: inset 5px 0 var(--c-banana);
    transform: translatex(2px);
    transition: 0.15s;
  }
</style>
