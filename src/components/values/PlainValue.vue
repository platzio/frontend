<template>
  <div v-if="value || showEmpty">
    <span class="text-secondary" v-if="showLabel && input.label">
      {{ input.label }}:
    </span>
    <span class="text-monospace fw-bold" v-if="value">
      {{ value }}
    </span>
    <span class="text-secondary fst-italic" v-else>(empty)</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { HelmChartUiInput } from "@/store/models/helm-chart";

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<HelmChartUiInput>,
      required: true,
    },
    value: {
      required: true,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    showEmpty: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
