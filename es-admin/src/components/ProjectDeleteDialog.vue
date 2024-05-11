<script setup>

import Dialog from "@/components/Dialog.vue";
import { ref } from 'vue';

const emit = defineEmits(['submit'])
const dialog = ref(null);

function onSubmit(environment) {
  emit('submit', environment);
}

function open() {
  dialog.value.open();
}
defineExpose({ open });
</script>

<template>
  <Dialog ref="dialog" header="Delete project?">
    <form method="dialog" @submit="onSubmit">
      <p>This action cannot be undone.</p>
      <div class="actions">
        <button class="danger">Delete</button>
        <button data-close-modal type="button">Cancel</button>
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
  form p {
    margin-top: 0;
    margin-bottom: var(--sp2);
  }
</style>
