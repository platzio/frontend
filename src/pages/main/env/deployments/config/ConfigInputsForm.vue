<template>
  <div v-if="uiSchema">
    <InputField
      v-for="input in uiSchema.inputs"
      :key="input.id"
      v-model="allValues[input.id]"
      :input="input"
      :env-id="envId"
      :disabled="disabled"
      :all-values="allValues"
      :is-new="isNew"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, reactive } from "vue";
import { cloneDeep, isEqual } from "lodash";
import { type UiSchema } from "@platzio/sdk";
import InputField from "@/components/inputs/InputField.vue";

const props = withDefaults(
  defineProps<{
    envId: string;
    uiSchema?: UiSchema | null;
    disabled: boolean;
    modelValue?: object;
    isNew?: boolean;
  }>(),
  {
    uiSchema: undefined,
    modelValue: () => ({}),
    isNew: true,
  }
);

const emit = defineEmits(["update:modelValue"]);

const allValues = reactive<Record<string, any>>({});

watch(
  () => props.modelValue,
  (oldvalue, newvalue) => {
    if (isEqual(oldvalue, newvalue)) {
      return;
    }
    Object.assign(allValues, cloneDeep(props.modelValue));
  },
  { immediate: true, deep: true }
);

watch(
  () => props.uiSchema,
  () => {
    if (!props.uiSchema) {
      return;
    }
    for (const input of props.uiSchema.inputs) {
      if (input.initialValue !== undefined && !allValues[input.id]) {
        allValues[input.id] = input.initialValue;
      }
    }
  },
  { immediate: true }
);

watch(
  allValues,
  () => {
    emit("update:modelValue", allValues);
  },
  { deep: true }
);
</script>
