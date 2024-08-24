<template>
  <div
    v-for="(notice, idx) in notices"
    :key="idx"
    class="alert mb-2"
    :class="{
      'alert-info': notice.level == DeploymentReportedNoticeLevel.Info,
      'alert-warning': notice.level == DeploymentReportedNoticeLevel.Warning,
      'alert-danger': notice.level == DeploymentReportedNoticeLevel.Danger,
    }"
  >
    <div>
      <FaIcon
        v-if="notice.level == DeploymentReportedNoticeLevel.Info"
        icon="info-circle"
        fixed-width
      />
      <FaIcon v-else icon="exclamation-triangle" fixed-width />
      {{ notice.text }}
    </div>
    <div v-if="notice.extra_info" class="mt-1 small fw-bold opacity-75">
      {{ notice.extra_info }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeploymentReportedNoticeWithInfo } from "@/store/models/deployment-status";
import { DeploymentReportedNoticeLevel } from "@platzio/sdk";

defineProps<{
  notices: DeploymentReportedNoticeWithInfo[];
}>();
</script>
