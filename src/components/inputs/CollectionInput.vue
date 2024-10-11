<template>
  <div class="form-floating">
    <template v-if="collection">
      <select
        :id="input.id"
        v-model="inner"
        class="form-select"
        :disabled="disabled"
        :required="input.required"
      >
        <option v-for="item in collectionItems" :key="item.id" :value="item.id">
          {{ collection ? collection.formatItem(item).text : item }}
        </option>
      </select>
      <label class="opacity-100">
        <span class="opacity-50">{{ input.label }}</span>
        <span v-if="input.required" class="ms-2 text-danger">*</span>
      </label>
    </template>
    <div v-else class="small alert alert-warning">
      <div class="mb-1 fw-bold">
        <FaIcon icon="exclamation-triangle" fixed-width />
        Can't Render This Field
      </div>
      <div>
        This chart required an input from an unknown collection named "{{
          input.collection
        }}".
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from "lodash";
import { computed, ref, watch, watchEffect } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";
import { getInputCollection } from "@/store/deployment-resources";

const props = withDefaults(
  defineProps<{
    envId: string;
    input: UiSchemaInput;
    disabled: boolean;
    modelValue?: any;
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

const collection = computed(
  () =>
    props.input.collection &&
    getInputCollection(props.envId, props.input.collection)
);

const collectionItems = computed(() => {
  if (!collection.value) {
    return [];
  }

  return collection.value.allForEnv(props.envId, props.input.filters);
});
</script>
