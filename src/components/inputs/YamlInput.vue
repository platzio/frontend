<template>
  <textarea
    class="form-control font-monospace"
    :id="id"
    @change="changed"
    :style="{
      'padding-top': '2rem',
      height: `calc(2.5rem + calc(1.3rem * max(2, ${
        yaml.split('\n').length
      })))`,
    }"
    v-model="yaml"
    :disabled="disabled"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
  />
  <div class="form-text opacity-75">
    <span class="text-danger" v-if="error">
      <fa icon="exclamation-triangle" fixed-width />
      YAML parse error: {{ error.reason }}
    </span>
    <span v-else>&nbsp;</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import * as jsYaml from "js-yaml";

const UPDATE_EVENT = "update:modelValue";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: [UPDATE_EVENT],

  setup(props, { emit }) {
    const yaml = ref("");
    const json = ref({});
    const error = ref<any>(null);

    watch(
      () => props.modelValue,
      (newJson) => {
        if (error.value) {
          return;
        }
        json.value = Object.assign({}, newJson);
        yaml.value = jsYaml.dump(json.value);
      },
      { immediate: true, deep: true }
    );

    const changed = () => {
      if (error.value) {
        return;
      }
      emit(UPDATE_EVENT, json.value);
    };

    watch(yaml, (newYaml) => {
      try {
        json.value = (jsYaml.load(newYaml) as object) || {};
        error.value = null;
      } catch (err) {
        error.value = err;
      }
    });

    return {
      yaml,
      changed,
      error,
    };
  },
});
</script>
