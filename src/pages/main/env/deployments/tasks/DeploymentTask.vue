<template>
    <div>
        <PlatzReason class="flex-fill" :text="task.reason" :is-bad="isBad">
            <template #before>
                <TaskBadge class="me-2" :task="task" />
            </template>
        </PlatzReason>

        <UpgradeParams
            v-if="task.operation.Upgrade"
            :operation="task.operation.Upgrade"
            :envId="envId"
        />

        <ReinstallParams
            v-if="task.operation.Reinstall"
            :operation="task.operation.Reinstall"
        />

        <RecreateParams
            v-if="task.operation.Recreate"
            :operation="task.operation.Recreate"
        />

        <InvokeActionParams
            v-if="task.operation.InvokeAction"
            :operation="task.operation.InvokeAction"
        />

        <RestartK8sResourceParams
            v-if="task.operation.RestartK8sResource"
            :operation="task.operation.RestartK8sResource"
        />

        <div class="mt-1 small d-flex flex-row align-items-center">
            <template v-if="task.acting_user_id">
                <PlatzUser
                    :id="task.acting_user_id"
                    :showName="true"
                    size="sm"
                />
                <span>,&nbsp;</span>
            </template>
            <template v-if="task.acting_deployment_id">
                <span v-if="formattedDeployment">
                    <FaIcon :icon="formattedDeployment.icon" />
                    {{ formattedDeployment.text }}
                </span>
                <span>,&nbsp;</span>
            </template>
            <PlatzMoment :value="task.created_at" />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { DeploymentTaskStatus, DeploymentTask } from "@platzio/sdk";
import TaskBadge from "./TaskBadge.vue";
import UpgradeParams from "./UpgradeParams.vue";
import ReinstallParams from "./ReinstallParams.vue";
import RecreateParams from "./RecreateParams.vue";
import InvokeActionParams from "./InvokeActionParams.vue";
import RestartK8sResourceParams from "./RestartK8sResourceParams.vue";
import { useStore } from "@/store";

export default defineComponent({
    props: {
        envId: {
            type: String,
            required: true,
        },
        task: {
            type: Object as PropType<DeploymentTask>,
            required: true,
        },
    },

    components: {
        TaskBadge,
        UpgradeParams,
        ReinstallParams,
        RecreateParams,
        InvokeActionParams,
        RestartK8sResourceParams,
    },

    setup(props) {
        const store = useStore();

        const isBad = computed(
            () => props.task.status == DeploymentTaskStatus.Failed
        );

        const formattedDeployment = computed(
            () =>
                props.task.acting_deployment_id &&
                store!.collections.deployments.formatItem(
                    store!.collections.deployments.getOne(
                        props.task.acting_deployment_id
                    )
                )
        );

        return {
            isBad,
            formattedDeployment,
        };
    },
});
</script>
