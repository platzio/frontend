<template>
  <div>
    <label class="opacity-100">
      <span class="opacity-50">{{ input.label }}</span>
      <span class="ms-2 text-danger" v-if="input.required">*</span>
    </label>
    <div class="alert alert-warning" v-if="!input.options">
      Input of type RadioSelect must have an options field.
    </div>
    <div
      class="my-2 form-check"
      v-else
      v-for="option in input.options"
      :key="option.value"
    >
      <input
        type="radio"
        class="form-check-input"
        v-model="inner"
        :name="input.id"
        :id="`${input.id}${option.value}`"
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
      <div class="form-text" v-if="input.helpText">
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
</script>
