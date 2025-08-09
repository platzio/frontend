<template>
  <div class="form-floating">
    <input
      :id="input.id"
      v-model.number="inner"
      type="number"
      :step="input.step || 0.0000000000001"
      class="form-control"
      :disabled="disabled"
      :required="input.required"
      :min="minimum"
      :max="maximum"
    />
    <label class="opacity-100">
      <span class="opacity-50">{{ input.label }}</span>
      <span v-if="input.required" class="ms-2 text-danger">*</span>
    </label>
    <div v-if="input.helpText" class="form-text">
      {{ input.helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from "lodash";
import { computed, ref, watch } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";

const props = withDefaults(
  defineProps<{
    envId: string;
    input: UiSchemaInput;
    disabled?: boolean;
    modelValue?: number | string;
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
    inner.value = newValue === "" ? undefined : newValue;
  },
  { immediate: true, deep: true }
);

watch(
  () => inner,
  () => {
    emit("update:modelValue", inner.value === "" ? undefined : inner.value);
  },
  { deep: true }
);

const minimum = computed(() =>
  props.input.minimum ? parseInt(props.input.minimum) : undefined
);
const maximum = computed(() =>
  props.input.maximum ? parseInt(props.input.maximum) : undefined
);
</script>
