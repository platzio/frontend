<template>
    <div class="badge text-uppercase" :class="klass">
        <FaIcon
            icon="sync-alt"
            fixed-width
            spin
            v-if="task.status == DeploymentTaskStatus.Started"
        />
        <FaIcon
            icon="check"
            class="me-1"
            v-else-if="task.status == DeploymentTaskStatus.Done"
        />
        <FaIcon
            icon="times"
            class="me-1"
            v-else-if="task.status == DeploymentTaskStatus.Failed"
        />
        {{ title }}
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { DeploymentTask, DeploymentTaskStatus } from "@platzio/sdk";
import { useStore } from "@/store";
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
                    const oldChart = store!.collections.helmCharts.getOne(
                        operation.prev_helm_chart_id
                    );
                    const newChart = store!.collections.helmCharts.getOne(
                        operation.helm_chart_id
                    );
                    const isUpgrade =
                        oldChart.created_at.localeCompare(
                            newChart.created_at
                        ) === -1;
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
