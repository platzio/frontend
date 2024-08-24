<template>
  <div class="form-floating">
    <input
      type="number"
      :step="input.step || 0.0000000000001"
      class="form-control"
      :id="input.id"
      v-model.number="inner"
      :disabled="disabled"
      :required="input.required"
      :min="minimum"
      :max="maximum"
    />
    <label class="opacity-100">
      <span class="opacity-50">{{ input.label }}</span>
      <span class="ms-2 text-danger" v-if="input.required">*</span>
    </label>
    <div class="form-text" v-if="input.helpText">
      {{ input.helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from "lodash";
import { computed, ref, watch, watchEffect } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";

const props = withDefaults(
  defineProps<{
    envId: string;
    input: UiSchemaInput;
    disabled: boolean;
    modelValue: {};
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

const minimum = computed(() =>
  props.input.minimum ? parseInt(props.input.minimum) : undefined
);
const maximum = computed(() =>
  props.input.maximum ? parseInt(props.input.maximum) : undefined
);
</script>
