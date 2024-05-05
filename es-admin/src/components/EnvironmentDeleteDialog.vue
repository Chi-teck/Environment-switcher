<script setup>

import Dialog from "@/components/Dialog.vue";
import { ref } from 'vue';

const emit = defineEmits(['submit'])

const props = defineProps({
  environment: { type: Object, required: true },
});

const dialog = ref(null);

function onSubmit(environment) {
  emit('submit', environment);
  // Default submit behavior (close modal) is prevented
  // because the form may be already disconnected from document
  // once project is deleted.
  dialog.value.close()
}

function open() {
  dialog.value.open();
}
defineExpose({ open });
</script>

<template>
  <Dialog header="Delete Environment?" ref="dialog">
    <div>
      <form method="dialog" @submit.prevent="onSubmit(environment)">
        <p>This action cannot be undone.</p>
        <div class="actions">
          <button class="danger">Delete</button>
          <button data-close-modal type="button">Cancel</button>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<style scoped>
  form p {
    margin-top: 0;
    margin-bottom: var(--sp2);
  }
</style>
