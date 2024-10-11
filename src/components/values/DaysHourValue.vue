<template>
  <div v-if="value !== undefined || showEmpty">
    <span v-if="showLabel && input.label" class="text-secondary">
      {{ input.label }}:
    </span>
    <template v-if="days && hour">
      <span class="fw-bold">{{ days }}</span>
      <span> at </span>
      <span class="fw-bold">{{ hour }}</span>
      <span class="small text-secondary"> UTC</span>
    </template>
    <span v-else class="text-secondary fst-italic">(empty)</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type UiSchemaInput } from "@platzio/sdk";
import { type ExternalFormat } from "../inputs/DaysHourInput.vue";

function toDayName(n: string) {
  switch (n) {
    case "0":
      return "Sun";
    case "1":
      return "Mon";
    case "2":
      return "Tue";
    case "3":
      return "Wed";
    case "4":
      return "Thu";
    case "5":
      return "Fri";
    case "6":
      return "Sat";
  }
  return "???";
}
const props = withDefaults(
  defineProps<{
    input: UiSchemaInput;
    value?: ExternalFormat;
    showLabel?: boolean;
    showEmpty?: boolean;
  }>(),
  {
    showLabel: true,
    showEmpty: false,
  }
);

const days = computed(() => {
  const run_days = props.value?.run_days;
  return run_days ? run_days.split(",").map(toDayName).join(", ") : undefined;
});

const hour = computed(() => props.value?.schedule);
</script>
