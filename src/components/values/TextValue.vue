<template>
  <div v-if="value !== undefined || showEmpty">
    <span class="text-secondary" v-if="showLabel && input.label">
      {{ input.label }}:
    </span>
    <span class="text-monospace fw-bold" v-if="value">
      {{ value }}
    </span>
    <span class="text-secondary fst-italic" v-else>(empty)</span>
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
    showLabel: true,
    showEmpty: false,
  }
);
</script>
