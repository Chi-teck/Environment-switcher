<script>
import Sidebar from './components/SidebarItem.vue';
import Tools from './components/ToolsItem.vue';

export default {
  components: { Tools, Sidebar },
};
</script>

<template>
  <div class="app">
    <Sidebar class="app__sidebar" />
    <main class="main">
      <router-view />
    </main>
    <Tools class="tools" />
  </div>
</template>

<style scoped>
    .app {
        display: flex;
        height: 100vh;
        position: relative;
        min-width: 60rem;
    }
    .main {
        padding: var(--s0);
        flex-basis: 1fr;
        max-width: 60rem;
    }
    .main h1 {
        margin: 0;
    }
    .app__sidebar {
        flex-basis: calc(18 * var(--s0));
        min-width: calc(14 * var(--s0));
    }
    .tools {
        position: absolute;
        bottom: var(--sm4);
        right: var(--sm4);
    }
</style>
