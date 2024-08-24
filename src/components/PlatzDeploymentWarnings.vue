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
    <FaIcon icon="exclamation-triangle" fixed-width />
  </span>
</template>

<script setup lang="ts">
import { Tooltip } from "bootstrap";
import { computed, ref, watchEffect } from "vue";
import { type Deployment, DeploymentReportedNoticeLevel } from "@platzio/sdk";
import { deploymentStatusNotices } from "@/store/models/deployment-status";

const props = defineProps<{
  deployment: Deployment;
}>();

const warningsTriangle = ref();

const warnings = computed(() =>
  deploymentStatusNotices(props.deployment).filter(
    (notice) => notice.level != DeploymentReportedNoticeLevel.Info
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
</script>
