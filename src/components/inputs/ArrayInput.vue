<template>
  <div
    v-for="(item, idx) in inner"
    :key="idx"
    class="d-flex flex-row justify-content-between align-items-center mb-n2"
  >
    <SingleInputField
      v-model="inner[idx]"
      class="flex-fill"
      :input="itemInput(idx)"
      :env-id="envId"
      :disabled="disabled"
      :all-values="allValues"
      :is-new="isNew"
    />
    <div class="ps-2 mb-3">
      <a class="text-secondary" @click="removeFromArray(idx)">
        <FaIcon icon="times-circle" fixed-width />
      </a>
    </div>
  </div>
  <div class="small mb-4">
    <a class="text-primary" @click="addToArray">
      <FaIcon icon="plus-circle" fixed-width />
      Add {{ input.label }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from "lodash";
import { computed, ref, watch } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";
import SingleInputField from "./SingleInputField.vue";

const props = withDefaults(
  defineProps<{
    envId: string;
    input: UiSchemaInput;
    disabled: boolean;
    modelValue?: Array<any>;
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

const inner = ref<any[]>([]);

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      inner.value = [];
      return;
    }
    if (isEqual(newValue, inner.value)) {
      return;
    }
    if (typeof newValue === "string" || typeof newValue === "number") {
      newValue = [newValue];
    }
    inner.value = newValue;
  },
  { immediate: true, deep: true }
);

watch(
  () => inner,
  () => {
    emit("update:modelValue", inner.value);
  },
  { deep: true }
);

const addToArray = () => {
  switch (props.input.itemType) {
    case "text":
      inner.value.push(props.input.initialValue || "");
      break;
    case "number":
      inner.value.push(props.input.initialValue || props.input.minimum || 0);
      break;
    case "CollectionSelect":
      inner.value.push({});
      break;
    case "RadioSelect":
      inner.value.push(
        props.input.initialValue || (props.input.options || [])[0].value
      );
      break;
    case "DaysAndHour":
      inner.value.push(props.input.initialValue || {});
      break;
    case "Checkbox":
      inner.value.push(props.input.initialValue || false);
      break;
  }
};

const removeFromArray = (idx: number) => {
  inner.value.splice(idx, 1);
};

const itemInput = computed(() => (idx: number): UiSchemaInput | undefined => {
  if (!props.input.itemType) {
    return undefined;
  }
  return {
    ...props.input,
    id: `${props.input.id}-${idx}`,
    type: props.input.itemType,
  };
});
</script>
