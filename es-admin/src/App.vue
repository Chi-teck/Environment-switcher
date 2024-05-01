<script>
import SidebarItem from './components/SidebarItem.vue';
import ToolsItem from './components/ToolsItem.vue';

export default {
  components: { ToolsItem, SidebarItem },
};
</script>

<template>
  <div class="app">
    <SidebarItem class="app__sidebar"/>
    <main class="app__main">
      <router-view />
    </main>
    <ToolsItem class="app__tools"/>
  </div>
</template>

<style scoped>
  .app {
    display: flex;
    height: 100vh;
    position: relative;
    min-width: 60rem;
  }
  .app__main {
    padding: var(--s0);
    flex-basis: 1fr;
    max-width: 60rem;
  }
  .app__main h1 {
    margin: 0;
  }
  .app__sidebar {
    flex-basis: calc(18 * var(--s0));
    min-width: calc(14 * var(--s0));
  }
  .app__tools {
    position: absolute;
    bottom: var(--sm4);
    right: var(--sm4);
  }
</style>
