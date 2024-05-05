<script setup>

import { ref, onMounted } from 'vue'

const props = defineProps({id: String, header: String});
const root = ref('root');

onMounted(() => {
  const close = () => root.value.close();
  root.value
    // Consumers may provide own close buttons.
    .querySelectorAll('[data-close-modal]')
    .forEach(element => element.addEventListener('click', close));
})

const expose = {
  open() {
    root.value.showModal();
  },
  close() {
    root.value.close();
  },
}
defineExpose(expose);
</script>

<template>
  <dialog :id="id" ref="root">
    <div class="header">
      <h2>{{ header }}</h2>
      <button type="button" data-close-modal class="close" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32" aria-hidden="true">
          <line x1="2" y1="2" x2="30" y2="30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <line x1="30" y1="2" x2="2" y2="30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="body"><slot/></div>
  </dialog>
</template>
<style scoped>
  dialog {
    padding: var(--sp2);
    box-shadow: 0 0 6px var(--c-border);
    border-style: none;
  }
  dialog[open] {
    animation: dialogFadeIn 0.25s ease normal;
  }
  @keyframes dialogFadeIn {
    from {
      opacity: 0;
      transform: scale(0.85);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  dialog {
    min-width: 30rem;
  }
  dialog::backdrop {
    backdrop-filter: saturate(15%);
  }
  .header {
    display: flex;
    margin-bottom: var(--sp2);
  }
  h2 {
    line-height: 1;
    margin: 0;
  }
  .close {
    margin-left: auto;
    background-color: transparent;
    border-style: none;
    cursor: pointer;
    color: var(--c-border);
    width: 28px;
    height: 28px;
    padding: 6px;
    transform: translate(6px, -6px);
  }
  .close:hover {
    color: var(--c-black);
  }
  .close:active {
    transform: scale(0.9) translate(6px, -6px);
  }
</style>
