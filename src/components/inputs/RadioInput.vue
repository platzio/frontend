<template>
  <div>
    <label class="opacity-100">
      <span class="opacity-50">{{ input.label }}</span>
      <span v-if="input.required" class="ms-2 text-danger">*</span>
    </label>
    <div v-if="!input.options" class="alert alert-warning">
      Input of type RadioSelect must have an options field.
    </div>
    <div
      v-for="option in input.options"
      v-else
      :key="option.value"
      class="my-2 form-check"
    >
      <input
        :id="`${input.id}${option.value}`"
        v-model="inner"
        type="radio"
        class="form-check-input"
        :name="input.id"
        :value="option.value"
        :disabled="disabled"
        :required="input.required"
      />
      <label class="form-check-label" :for="`${input.id}${option.value}`">
        <div>
          {{ option.label || option.value }}
        </div>
        <div v-if="option.helpText" class="small opacity-50">
          {{ option.helpText }}
        </div>
      </label>
      <div v-if="input.helpText" class="form-text">
        {{ input.helpText }}
      </div>
    </div>
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
    disabled?: boolean;
    modelValue: any;
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
