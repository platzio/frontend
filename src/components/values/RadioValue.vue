<template>
  <div v-if="value !== undefined || showEmpty">
    <span v-if="showLabel" class="text-secondary"> {{ input.label }}: </span>
    <span v-if="value" class="text-monospace fw-bold">
      {{ display }}
    </span>
    <span v-else class="text-secondary fst-italic">(empty)</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";

const props = withDefaults(
  defineProps<{
    input: UiSchemaInput;
    value?: any;
    showLabel?: boolean;
    showEmpty?: boolean;
  }>(),
  {
    value: undefined,
    showLabel: true,
    showEmpty: false,
  }
);

const display = computed(() => {
  for (const option of props.input.options || []) {
    if (option.value === props.value) {
      return option.label || option.value;
    }
  }
  return props.value;
});
</script>
