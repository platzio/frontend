<template>
  <div v-if="value !== undefined || showEmpty">
    <span v-if="showLabel && input.label" class="text-secondary">
      {{ input.label }}:
    </span>
    <span v-if="value" class="text-monospace fw-bold">
      {{ value }}
    </span>
    <span v-else class="text-secondary fst-italic">(empty)</span>
  </div>
</template>

<script setup lang="ts">
import { type UiSchemaInput } from "@platzio/sdk";

withDefaults(
  defineProps<{
    input: UiSchemaInput;
    value?: string;
    showLabel?: boolean;
    showEmpty?: boolean;
  }>(),
  {
    value: undefined,
    showLabel: true,
    showEmpty: false,
  }
);
</script>
