<script setup>

import { ref } from 'vue';
import EnvironmentForm from "@/components/EnvironmentForm.vue";
import Dialog from "@/components/Dialog.vue";
import uuid from "@/uuid.js";

const emit = defineEmits(['submit'])

const dialog = ref(null);
const form = ref(null);

function submit(environment) {
  environment.id = uuid();
  emit('submit', environment);
}
const defaultValues = {name: '', status: true, baseUrl: ''};

function open() {
  dialog.value.open();
}
defineExpose({ open });
</script>

<template>
  <Dialog ref="dialog" header="Create Environment" @close="form.reset()">
    <EnvironmentForm ref="form" :environment="defaultValues" method="dialog" @save="submit" @cancel="dialog.close()"/>
  </Dialog>
</template>

