<template>
  <div class="badge text-uppercase" :class="klass">
    <fa
      icon="sync-alt"
      fixed-width
      spin
      v-if="task.status == DeploymentTaskStatus.Started"
    />
    <fa
      icon="check"
      class="me-1"
      v-else-if="task.status == DeploymentTaskStatus.Done"
    />
    <fa
      icon="times"
      class="me-1"
      v-else-if="task.status == DeploymentTaskStatus.Failed"
    />
    {{ title }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useStore } from "@/store";
import {
  DeploymentTask,
  DeploymentTaskStatus,
} from "@/store/models/deployment-task";
import { chartActionsSchema } from "@/store/chart-ext";

export default defineComponent({
  props: {
    task: {
      type: Object as PropType<DeploymentTask>,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();

    const klass = computed(() => {
      switch (props.task.status) {
        case DeploymentTaskStatus.Pending:
          return "border text-dark bg-light bg-gradient";
        case DeploymentTaskStatus.Started:
          return props.task.operation.InvokeAction ||
            props.task.operation.RestartK8sResource
            ? "border border-primary text-primary"
            : "border border-success text-success";
        case DeploymentTaskStatus.Done:
          return props.task.operation.InvokeAction ||
            props.task.operation.RestartK8sResource
            ? "bg-primary bg-gradient"
            : "bg-success bg-gradient";
        case DeploymentTaskStatus.Failed:
          return "bg-danger bg-gradient";
        default:
          return "bg-secondary bg-gradient";
      }
    });

    const title = computed(() => {
      if (props.task.operation.Install) {
        return props.task.status == DeploymentTaskStatus.Started
          ? "Installing"
          : "Install";
      }
      if (props.task.operation.Upgrade) {
        const operation = props.task.operation.Upgrade;
        if (!operation.prev_helm_chart_id) {
          return props.task.status == DeploymentTaskStatus.Started
            ? "Upgrading"
            : "Upgrade";
        }
        if (operation.prev_helm_chart_id !== operation.helm_chart_id) {
          const oldChart = store!.collections.helmCharts.getOne(
            operation.prev_helm_chart_id
          );
          const newChart = store!.collections.helmCharts.getOne(
            operation.helm_chart_id
          );
          const isUpgrade =
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
      if (props.task.operation.Reinstall) {
        return props.task.status == DeploymentTaskStatus.Started
          ? "Reinstalling"
          : "Reinstall";
      }
      if (props.task.operation.Recreate) {
        return props.task.status == DeploymentTaskStatus.Started
          ? "Recreating"
          : "Recreate";
      }
      if (props.task.operation.Uninstall) {
        return props.task.status == DeploymentTaskStatus.Started
          ? "Uninstalling"
          : "Uninstall";
      }
      if (props.task.operation.RestartK8sResource) {
        return props.task.status == DeploymentTaskStatus.Started
          ? "Restarting"
          : "Restart";
      }
      if (props.task.operation.InvokeAction) {
        const operation = props.task.operation.InvokeAction;
        const chart = store!.collections.helmCharts.getOne(
          operation.helm_chart_id
        );
        const action_schema = chartActionsSchema(chart).find(
          (action) => action.id == operation.action_id
        );
        if (!action_schema) {
          return "Action";
        }
        return action_schema.title;
      }
      return "Unknown";
    });

    return {
      DeploymentTaskStatus,
      klass,
      title,
    };
  },
});
</script>
