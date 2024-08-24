<template>
  <div v-if="value || showEmpty">
    <span class="text-secondary" v-if="showLabel"> {{ input.label }}: </span>
    <span class="text-monospace fw-bold" v-if="value">
      {{ display }}
    </span>
    <span class="text-secondary fst-italic" v-else>(empty)</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";

const props = withDefaults(
  defineProps<{
    input: UiSchemaInput;
    value: any;
    showLabel: boolean;
    showEmpty: boolean;
  }>(),
  {
    showLabel: true,
    showEmpty: false,
  }
);

const display = computed(() => {
  for (const option of props.input.options || []) {
    if (option.value == props.value) {
      return option.label || option.value;
    }
  }
  return props.value;
});
</script>
