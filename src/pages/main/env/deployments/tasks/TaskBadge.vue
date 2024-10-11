<template>
  <div class="badge text-uppercase" :class="klass">
    <FaIcon
      v-if="task.status == DeploymentTaskStatus.Started"
      icon="sync-alt"
      fixed-width
      spin
    />
    <FaIcon
      v-else-if="task.status == DeploymentTaskStatus.Done"
      icon="check"
      class="me-1"
    />
    <FaIcon
      v-else-if="task.status == DeploymentTaskStatus.Failed"
      icon="times"
      class="me-1"
    />
    {{ title }}
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { type DeploymentTask, DeploymentTaskStatus } from "@platzio/sdk";
import { chartActionsSchema } from "@/store/chart-ext";
import {
  type HelmChartsCollection,
  InjectedHelmChartsCollection,
} from "@/store/models/helm-chart";

const props = defineProps<{
  task: DeploymentTask;
}>();

const helmChartsCollection = inject<HelmChartsCollection>(
  InjectedHelmChartsCollection
);

const klass = computed(() => {
  switch (props.task.status) {
    case DeploymentTaskStatus.Pending:
      return "border text-dark bg-light-subtle bg-gradient";
    case DeploymentTaskStatus.Started:
      return "InvokeAction" in props.task.operation ||
        "RestartK8sResource" in props.task.operation
        ? "border border-primary text-primary"
        : "border border-success text-success";
    case DeploymentTaskStatus.Done:
      return "InvokeAction" in props.task.operation ||
        "RestartK8sResource" in props.task.operation
        ? "bg-primary bg-gradient"
        : "bg-success bg-gradient";
    case DeploymentTaskStatus.Failed:
      return "bg-danger bg-gradient";
    default:
      return "bg-secondary bg-gradient";
  }
});

const title = computed(() => {
  if ("Install" in props.task.operation) {
    return props.task.status == DeploymentTaskStatus.Started
      ? "Installing"
      : "Install";
  }
  if ("Upgrade" in props.task.operation) {
    const operation = props.task.operation.Upgrade;
    if (!operation.prev_helm_chart_id) {
      return props.task.status == DeploymentTaskStatus.Started
        ? "Upgrading"
        : "Upgrade";
    }
    if (operation.prev_helm_chart_id !== operation.helm_chart_id) {
      const oldChart = helmChartsCollection?.getOne(
        operation.prev_helm_chart_id
      );
      const newChart = helmChartsCollection?.getOne(operation.helm_chart_id);
      const isUpgrade =
        oldChart &&
        newChart &&
        oldChart.created_at.localeCompare(newChart.created_at) === -1;
      return props.task.status == DeploymentTaskStatus.Started
        ? isUpgrade
          ? "Upgrading"
          : "Downgrading"
        : isUpgrade
        ? "Upgrade"
        : "Downgrade";
    }
    return props.task.status == DeploymentTaskStatus.Started
      ? "Reconfiguring"
      : "Reconfigure";
  }
  if ("Reinstall" in props.task.operation) {
    return props.task.status == DeploymentTaskStatus.Started
      ? "Reinstalling"
      : "Reinstall";
  }
  if ("Recreate" in props.task.operation) {
    return props.task.status == DeploymentTaskStatus.Started
      ? "Recreating"
      : "Recreate";
  }
  if ("Uninstall" in props.task.operation) {
    return props.task.status == DeploymentTaskStatus.Started
      ? "Uninstalling"
      : "Uninstall";
  }
  if ("RestartK8sResource" in props.task.operation) {
    return props.task.status == DeploymentTaskStatus.Started
      ? "Restarting"
      : "Restart";
  }
  if (props.task.operation.InvokeAction) {
    const operation = props.task.operation.InvokeAction;
    const chart = helmChartsCollection?.getOne(operation.helm_chart_id);
    if (chart) {
      const action_schema = chartActionsSchema(chart).find(
        (action) => action.id == operation.action_id
      );
      if (action_schema) {
        return action_schema.title;
      }
    }
    return "Action";
  }
  return "Unknown";
});
</script>
