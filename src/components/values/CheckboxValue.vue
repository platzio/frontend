<template>
  <div v-if="value !== undefined || showEmpty">
    <span class="text-secondary" v-if="showLabel && input.label">
      {{ input.label }}:
    </span>
    <span class="text-monospace fw-bold" v-if="value !== undefined">
      {{ value ? "On" : "Off" }}
    </span>
    <span class="text-secondary fst-italic" v-else>(empty)</span>
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
