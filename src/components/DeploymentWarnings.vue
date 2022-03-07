<template>
  <span
    v-if="warnings.length > 0"
    ref="warningsTriangle"
    class="ms-2 text-warning"
    data-bs-toggle="tooltip"
    data-bs-placement="right"
    :title="
      warnings
        .map((warning) => `<div class='my-1 mx-2'>${warning.text}</div>`)
        .join('')
    "
    data-bs-html="true"
  >
    <fa icon="exclamation-triangle" fixed-width />
  </span>
</template>

<script lang="ts">
import { Tooltip } from "bootstrap";
import { computed, defineComponent, ref, PropType, watchEffect } from "vue";
import { Deployment } from "@/store/models/deployment";
import {
  DeploymentNoticeLevel,
  deploymentStatusNotices,
} from "@/store/models/deployment-status";

export default defineComponent({
  props: {
    deployment: {
      type: Object as PropType<Deployment>,
      required: true,
    },
  },

  setup(props) {
    const warningsTriangle = ref();

    const warnings = computed(() =>
      deploymentStatusNotices(props.deployment).filter(
        (notice) => notice.level != DeploymentNoticeLevel.Info
      )
    );

    watchEffect(
      () => {
        if (!warningsTriangle.value) {
          return;
        }
        new Tooltip(warningsTriangle.value);
      },
      { flush: "post" }
    );

    return {
      warningsTriangle,
      warnings,
    };
  },
});
</script>
