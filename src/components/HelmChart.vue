<template>
  <div class="d-flex flex-row align-items-center" :class="classes" v-if="format === 'helm'">
    <fa icon="map" fixed-width class="me-1" />
    <span>{{ chart.image_tag }}</span>
    <span v-if="!chart.available" class="ms-2 badge bg-light text-dark border"> DELETED </span>
    <span v-else-if="chart.error" class="ms-2 badge bg-danger">ERROR</span>
  </div>

  <div class="d-flex flex-row align-items-baseline" :class="classes" v-if="format === 'git'">
    <span v-if="!chart.available" class="me-2 badge bg-light text-dark border"> DELETED </span>

    <span
      v-if="isMaster"
      class="badge rounded-pill fw-normal border border-primary bg-light text-primary"
      :style="pillStyle"
    >
      <fa icon="star" fixed-width />
      {{ chart.parsed_branch || "master" }}
    </span>

    <span
      v-if="!isMaster"
      class="badge rounded-pill fw-normal border bg-light text-dark"
      :style="pillStyle"
    >
      <fa icon="code-branch" fixed-width />
      {{ chart.parsed_branch || "master" }}
    </span>

    <span class="ms-2 fw-bold">{{ chart.parsed_version }}</span>
    <span v-if="chart.parsed_revision">-{{ chart.parsed_revision }}</span>
    <span v-if="chart.parsed_commit" class="ms-2 text-secondary font-monospace opacity75">
      <fa icon="code" /><span class="ms-1">{{ chart.parsed_commit }}</span>
    </span>
  </div>

  <div
    v-if="time"
    class="my-1 small"
    :class="{
      'text-black-50': chart.available,
      'text-muted': !chart.available,
    }"
  >
    <fa icon="clock" fixed-width />
    Uploaded <Moment :value="chart.created_at" />
  </div>

  <div v-if="digest" class="small text-muted">
    <fa icon="barcode" fixed-width />
    {{ chart.image_digest }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useStore } from "@/store";
import { HelmChart } from "@/store/models/helm-chart";

export default defineComponent({
  props: {
    chart: {
      type: Object as PropType<HelmChart>,
      required: true,
    },
    color: {
      type: Boolean,
      default: true,
    },
    format: {
      type: String,
      default: "helm",
    },
    time: {
      type: Boolean,
      default: true,
    },
    digest: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String as PropType<"regular" | "sm">,
      default: "regular",
    },
  },

  setup(props) {
    const store = useStore();
    const registry = computed(() =>
      store!.collections.helmRegistries.getOne(props.chart.helm_registry_id)
    );

    const classes = computed(() =>
      Object.assign(
        {},
        props.color
          ? {
              "text-success": props.chart.available && !props.chart.error,
              "text-danger": props.chart.available && props.chart.error,
              "text-muted": !props.chart.available,
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

    return {
      registry,
      classes,
      pillStyle,
      isMaster,
    };
  },
});
</script>
