<script setup>

const defaultErrors = { name: null, baseUrl: null };
import {ref} from 'vue';

const props = defineProps({
  environment: { type: Object, required: true },
});

const emit = defineEmits(['save', 'cancel'])

let errors = ref({ ...defaultErrors });
let environment = ref({ ...props.environment });

function reset() {
  errors = { ...defaultErrors };
  environment.value = { ...props.environment };
}

function _onSubmit(event) {
  errors.value = { ...defaultErrors };
  const { name: $name, base_url: $baseUrl } = event.target.elements;

  if (!$name.validity.valid) {
    errors.value.name = $name.validationMessage;
  }
  if (!$baseUrl.validity.valid) {
    errors.value.baseUrl = $baseUrl.validationMessage;
  } else {
    const baseUrl = new URL(environment.value.baseUrl);
    if (baseUrl.hash !== '') {
      errors.value.baseUrl = 'The URL should not include anchor.';
    } else if (baseUrl.search !== '') {
      errors.value.baseUrl = 'The URL should not include query string.';
    } else if (baseUrl.pathname !== '/') {
      errors.value.baseUrl = 'The URL should not include path.';
    } else if (environment.value.baseUrl.endsWith('/')) {
      errors.value.baseUrl = 'The URL should not have ending slash.';
    }
  }

  if (errors.value.name || errors.value.baseUrl) {
    event.preventDefault();
    return;
  }

  environment.value.baseUrl = new URL(environment.value.baseUrl).origin;
  emit('save', { ...environment.value });
  reset();
}

function _onCancel() {
  emit('cancel');
  reset();
}

defineExpose({reset});

</script>
<template>
  <form novalidate @submit="_onSubmit">
    <div class="form-item checkbox-item">
      <label>Enabled</label>
      <input v-model="environment.status" type="checkbox" name="status">
    </div>
    <div class="form-item text-item" :class="{'has-errors': errors.name}">
      <label>Name</label>
      <input v-model="environment.name" type="text" name="name" required placeholder="Localhost">
      <div class="error">{{ errors.name }}</div>
    </div>
    <div class="form-item text-item" :class="{'has-errors': errors.baseUrl}">
      <label>Base URL</label>
      <input v-model="environment.baseUrl" type="url" name="base_url" required placeholder="https://example.com" spellcheck="false">
      <div class="error">{{ errors.baseUrl }}</div>
    </div>
    <div class="form-item actions">
      <button class="primary">Save</button>
      <button type="button" @click="_onCancel">Cancel</button>
    </div>
  </form>
</template>
<style scoped>
    .text-item label {
      margin-bottom: 0.35em;
    }

    .checkbox-item {
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    input[type=checkbox] {
      transform: scale(1.25);
    }

    .form-item:not(:last-child) {
        margin-bottom: var(--sp1);
    }

    .actions {
        display: flex;
        gap: var(--sm3);
    }

    .actions button {
      width: 80px;
      text-align: center;
    }

    .has-errors {
        color: var(--c-carmine);
    }
    .has-errors input {
        border-color: var(--c-carmine);
    }
    .has-errors input:focus {
        --c-input-shadow: var(--c-carmine);
    }
    .error {
        color: var(--c-carmine);
        font-size: small;
    }

</style>
