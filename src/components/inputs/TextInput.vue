<template>
  <div class="form-floating">
    <input
      :id="input.id"
      v-model="inner"
      type="text"
      class="form-control"
      :disabled="disabled"
      :required="required"
    />
    <label class="opacity-100">
      <span class="opacity-50">{{ input.label }}</span>
      <span v-if="required" class="ms-2 text-danger">*</span>
    </label>
    <div v-if="input.helpText" class="form-text">
      {{ input.helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from "lodash";
import { ref, watch, watchEffect, computed } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";

const props = withDefaults(
  defineProps<{
    envId: string;
    input: UiSchemaInput;
    disabled?: boolean;
    modelValue?: string;
    allValues: Record<string, any>;
    isNew?: boolean;
  }>(),
  {
    disabled: false,
    modelValue: undefined,
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

const required = computed(
  () =>
    props.input.required &&
    (!props.input.sensitive || (props.input.sensitive && !props.isNew))
);
</script>
