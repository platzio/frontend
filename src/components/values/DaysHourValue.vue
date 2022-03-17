<template>
  <div v-if="value || showEmpty">
    <span class="text-secondary" v-if="showLabel && input.label">
      {{ input.label }}:
    </span>
    <template v-if="value">
      <span class="fw-bold">{{ days }}</span>
      <span> at </span>
      <span class="fw-bold">{{ hour }}</span>
      <span class="small text-secondary"> UTC</span>
    </template>
    <span class="text-secondary fst-italic" v-else>(empty)</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { HelmChartUiInput } from "@/store/chart-ext";
import { ExternalFormat } from "../inputs/DaysHourInput.vue";

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
export default defineComponent({
  props: {
    input: {
      type: Object as PropType<HelmChartUiInput>,
      required: true,
    },
    value: {
      type: Object as PropType<ExternalFormat>,
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

  setup(props) {
    const days = computed(() =>
      props.value && props.value.run_days
        ? props.value.run_days.split(",").map(toDayName).join(", ")
        : null
    );

    const hour = computed(() =>
      props.value && props.value.schedule ? props.value.schedule : null
    );

    return {
      days,
      hour,
    };
  },
});
</script>
