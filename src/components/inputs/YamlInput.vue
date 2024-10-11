<template>
  <textarea
    :id="id"
    v-model="yaml"
    class="form-control font-monospace"
    :style="{
      'padding-top': '2.5rem',
      'line-height': '1.5rem',
      height: `calc(2.5rem + calc(1.5rem * max(2, ${
        yaml.split('\n').length + 1
      })))`,
    }"
    :disabled="disabled"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
    @change="changed"
  />
  <div class="form-text opacity-75">
    <span v-if="error" class="text-danger">
      <FaIcon icon="exclamation-triangle" fixed-width />
      YAML parse error: {{ error.reason }}
    </span>
    <span v-else>&nbsp;</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import * as jsYaml from "js-yaml";

const props = withDefaults(
  defineProps<{
    id: string;
    disabled?: boolean;
    modelValue?: object;
    isNew?: boolean;
  }>(),
  {
    disabled: false,
    modelValue: () => ({}),
    isNew: true,
  }
);

const emit = defineEmits(["update:modelValue"]);

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
  emit("update:modelValue", json.value);
};

watch(yaml, (newYaml) => {
  try {
    json.value = (jsYaml.load(newYaml) as object) || {};
    error.value = null;
  } catch (err) {
    error.value = err;
  }
});
</script>
