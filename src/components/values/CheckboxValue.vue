<template>
  <div v-if="value !== undefined || showEmpty">
    <span v-if="showLabel && input.label" class="text-secondary">
      {{ input.label }}:
    </span>
    <span v-if="value !== undefined" class="text-monospace fw-bold">
      {{ value ? "On" : "Off" }}
    </span>
    <span v-else class="text-secondary fst-italic">(empty)</span>
  </div>
</template>

<script setup lang="ts">
import { type UiSchemaInput } from "@platzio/sdk";

withDefaults(
  defineProps<{
    input: UiSchemaInput;
    value?: boolean;
    showLabel: boolean;
    showEmpty: boolean;
  }>(),
  { withLabel: true, showEmpty: false }
);
</script>
