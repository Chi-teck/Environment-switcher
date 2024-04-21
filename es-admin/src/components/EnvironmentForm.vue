<script>

import {toRaw} from "vue";

const defaultErrors = {name: null, baseUrl: null};

export default {
    props: {
        environment: {type: Object, required: true},
    },
    data() {
        return {
            errors: {...defaultErrors},
            environment: {...this.$props.environment}
        }
    },
    methods: {
        reset() {
            this.$data.errors =  {...defaultErrors};
            this.$data.environment = {...this.$props.environment};
        },
        _onSubmit: function (event) {
            this.errors = {...defaultErrors};
            const {name: $name, base_url: $baseUrl} = event.target.elements;

            if (!$name.validity.valid) {

                this.errors.name = $name.validationMessage;
            }
            if (!$baseUrl.validity.valid) {
                this.errors.baseUrl = $baseUrl.validationMessage;
            }
            else {
                const baseUrl = new URL(this.environment.baseUrl);
                if (baseUrl.hash !== '') {
                    this.errors.baseUrl = 'The URL should not include anchor.';
                }
                else if (baseUrl.search !== '') {
                    this.errors.baseUrl = 'The URL should not include query string.';
                }
                else if (baseUrl.pathname !== '/') {
                    this.errors.baseUrl = 'The URL should not include path.';
                }
                else if (this.environment.baseUrl.endsWith('/')) {
                    this.errors.baseUrl = 'The URL should not have ending slash.';
                }
            }

            if (this.errors.name || this.errors.baseUrl) {
                event.preventDefault()
                return;
            }

            this.environment.baseUrl = new URL(this.environment.baseUrl).origin;
            this.$emit('save', {...this.environment});
            this.reset();
        },
        _onCancel: function () {
            this.$emit('cancel');
            this.reset();
        }
    },
}
</script>
<template>
    <form v-on:submit="_onSubmit" novalidate>
        <div class="form-item checkbox-item">
            <label>Enabled</label>
            <input type="checkbox" name="status" v-model="environment.status"/>
        </div>
        <div class="form-item text-item" :class="{'has-errors': errors.name}">
            <label>Name</label>
            <input type="text" name="name" required v-model="environment.name" placeholder="Localhost"/>
            <div class="error">{{ errors.name }}</div>
        </div>
        <div class="form-item text-item" :class="{'has-errors': errors.baseUrl}">
            <label>Base URL</label>
            <input type="url" name="base_url" required v-model="environment.baseUrl" placeholder="https://example.com"/>
            <div class="error">{{ errors.baseUrl }}</div>
        </div>
        <div class="form-item actions">
            <button class="primary">Save</button>
            <button type="button" v-on:click="_onCancel">Cancel</button>
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
