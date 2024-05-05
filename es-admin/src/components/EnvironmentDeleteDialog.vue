<script setup>

import { ref } from 'vue';
import Dialog from "@/components/Dialog.vue";

const emit = defineEmits(['submit'])

const props = defineProps({
  environment: { type: Object, required: true },
});

const dialog = ref(null);

function submit(environment) {
  emit('submit', environment);
}

function open() {
  dialog.value.open();
}

defineExpose({ open });
</script>

<template>
  <Dialog header="Delete Environment?" ref="dialog">
    <div>
      <form method="dialog" @submit.prevent="submit(environment)">
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
