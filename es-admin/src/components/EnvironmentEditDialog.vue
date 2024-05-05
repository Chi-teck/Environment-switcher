<script setup>

import { ref } from 'vue';
import EnvironmentForm from "@/components/EnvironmentForm.vue";
import Dialog from "@/components/Dialog.vue";

const emit = defineEmits(['submit'])

const props = defineProps({
  environment: { type: Object, required: true },
});

const dialog = ref(null);
const form = ref(null);

function onSubmit(environment) {
  emit('submit', environment);
}

function open() {
  dialog.value.open();
}

defineExpose({ open });
</script>

<template>
  <Dialog ref="dialog" header="Edit Environment" @close="form.reset()">
    <EnvironmentForm ref="form" :environment="environment" method="dialog" @submit="onSubmit" @cancel="dialog.close()"/>
  </Dialog>
</template>

