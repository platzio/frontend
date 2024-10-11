<template>
  <div
    v-if="format === 'helm'"
    class="d-flex flex-row align-items-center"
    :class="classes"
  >
    <FaIcon icon="map" fixed-width class="me-1" />
    <span>{{ chart.image_tag }}</span>
    <span
      v-if="!chart.available"
      class="ms-2 badge bg-light-subtle text-dark border"
    >
      DELETED
    </span>
    <span v-else-if="chart.error" class="ms-2 badge bg-danger">ERROR</span>
  </div>

  <div
    v-if="format === 'git'"
    class="d-flex flex-row align-items-baseline"
    :class="classes"
  >
    <span
      v-if="!chart.available"
      class="me-2 badge bg-light-subtle text-dark border"
    >
      DELETED
    </span>

    <span
      v-if="isMaster"
      class="badge rounded-pill fw-normal border border-primary-subtle bg-body-tertiary text-primary"
      :style="pillStyle"
    >
      <FaIcon icon="star" fixed-width />
      {{ chart.parsed_branch || "master" }}
    </span>

    <span
      v-if="!isMaster"
      class="badge rounded-pill fw-normal border bg-body-tertiary text-body"
      :style="pillStyle"
    >
      <FaIcon icon="code-branch" fixed-width />
      {{ chart.parsed_branch || "master" }}
    </span>

    <span class="ms-2 fw-bold text-body-tertiary">{{
      chart.parsed_version
    }}</span>
    <span v-if="chart.parsed_revision">-{{ chart.parsed_revision }}</span>
    <span
      v-if="chart.parsed_commit"
      class="ms-2 text-body-tertiary font-monospace"
    >
      <FaIcon icon="code-commit" /><span class="ms-1">{{
        chart.parsed_commit.slice(0, 7)
      }}</span>
    </span>
  </div>

  <div
    v-if="time"
    class="my-1 small"
    :class="{
      'text-opacity-50': chart.available,
      'text-body-secondary': !chart.available,
    }"
  >
    <FaIcon icon="clock" fixed-width />
    Uploaded
    <PlatzMoment :value="chart.created_at" />
  </div>

  <div v-if="digest" class="small text-body-secondary">
    <FaIcon icon="barcode" fixed-width />
    {{ chart.image_digest }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type HelmChart } from "@platzio/sdk";
import PlatzMoment from "./base/PlatzMoment.vue";

const props = withDefaults(
  defineProps<{
    chart: HelmChart;
    color?: boolean;
    format?: "helm" | "git";
    time?: boolean;
    digest?: boolean;
    size?: "regular" | "sm";
  }>(),
  { color: true, format: "helm", time: true, digest: true, size: "regular" }
);

const classes = computed(() =>
  Object.assign(
    {},
    props.color
      ? {
          "text-success": props.chart.available && !props.chart.error,
          "text-danger": props.chart.available && props.chart.error,
          "text-body-secondary": !props.chart.available,
        }
      : {},
    {
      small: props.size == "sm",
    }
  )
);

const pillStyle = computed(() => ({
  "font-size": props.size == "regular" ? "0.8rem" : "0.735rem",
}));

const isMaster = computed(
  () =>
    !props.chart.parsed_branch ||
    props.chart.parsed_branch === "master" ||
    props.chart.parsed_branch === "main"
);
</script>
