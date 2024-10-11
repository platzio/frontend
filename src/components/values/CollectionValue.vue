<template>
  <div v-if="formattedItem">
    <span v-if="showLabel && formattedItem.inputLabel" class="text-secondary">
      {{ input.label }}:
    </span>
    <span v-else-if="showLabel && formattedItem.label" class="text-secondary">
      {{ formattedItem.label }}:
    </span>
    <span
      :class="{
        'text-secondary': !formattedItem.label && !formattedItem.inputLabel,
      }"
    >
      <FaIcon
        v-if="formattedItem.icon"
        :icon="formattedItem.icon"
        fixed-width
      />
      {{ formattedItem.text }}
    </span>
  </div>
  <div v-else-if="showEmpty" class="d-flex flex-row">
    <div v-if="showLabel" class="me-1">{{ input.label }}:</div>
    <div class="text-secondary fst-italic">(empty)</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";
import { getInputCollection } from "@/store/deployment-resources";

const props = withDefaults(
  defineProps<{
    envId: string;
    input: UiSchemaInput;
    value?: string | object;
    showLabel: boolean;
    showEmpty: boolean;
  }>(),
  {
    value: undefined,
    showLabel: true,
    showEmpty: false,
  }
);

const collection = computed(
  () =>
    props.input.collection &&
    getInputCollection(props.envId, props.input.collection)
);

const item = computed(() =>
  props.value ? collection.value?.getOne(props.value) : undefined
);

const formattedItem = computed(() =>
  item.value ? collection.value?.formatItem(item.value) : undefined
);
</script>
