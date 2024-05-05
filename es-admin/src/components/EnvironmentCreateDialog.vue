<script setup>

import { ref } from 'vue';
import EnvironmentForm from "@/components/EnvironmentForm.vue";
import Dialog from "@/components/Dialog.vue";
import uuid from "@/uuid.js";

const emit = defineEmits(['submit'])

// const props = defineProps({
//   environment: { type: Object, required: true },
// });

const dialog = ref(null);
const form = ref(null);


function submit(environment) {
  environment.id = uuid();
  emit('submit', environment);
}
const defaultValues = {name: '', status: true, baseUrl: ''};


const expose = {
  open() {
    dialog.value.open();
  },
}

defineExpose(expose);

</script>

<template>
  <Dialog ref="dialog" header="Create Environment" @close="form.reset()">
    <EnvironmentForm ref="form" :environment="defaultValues" method="dialog" @save="submit" @cancel="dialog.close()"/>
  </Dialog>
</template>

