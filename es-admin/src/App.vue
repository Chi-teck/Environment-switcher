<script>
import Sidebar from './components/Sidebar.vue';
import Tools from './components/Tools.vue';

export default {
  components: { Tools, Sidebar },
};
</script>

<template>
  <div class="app">
    <Sidebar class="app__sidebar"/>
    <main class="app__main">
      <keep-alive include="project">
        <router-view/>
      </keep-alive>
    </main>
    <Tools class="app__tools"/>
  </div>
</template>

<style scoped>
  .app {
    display: flex;
    height: 100vh;
    position: relative;
  }
  .app__main {
    padding: var(--s0);
    flex-basis: calc(60 * var(--s0));
    min-width: calc(40 * var(--s0));
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
