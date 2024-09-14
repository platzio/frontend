<template>
  <div class="form-check form-switch">
    <input
      class="form-check-input"
      type="checkbox"
      role="switch"
      :id="input.id"
      v-model.number="inner"
      :disabled="disabled"
      :required="input.required"
    />
    <label class="form-check-label" :for="input.id">
      {{ input.label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from "lodash";
import { ref, watch, watchEffect } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";

const props = withDefaults(
  defineProps<{
    envId: string;
    input: UiSchemaInput;
    disabled: boolean;
    modelValue?: boolean;
    allValues: Record<string, any>;
    isNew?: boolean;
  }>(),
  {
    disabled: false,
    isNew: true,
  }
);

const emit = defineEmits(["update:modelValue"]);

const inner = ref();

watch(
  () => props.modelValue,
  (newValue) => {
    if (isEqual(newValue, inner.value)) {
      return;
    }
    inner.value = newValue;
  },
  { immediate: true, deep: true }
);

watchEffect(() => {
  emit("update:modelValue", inner.value);
});
</script>
