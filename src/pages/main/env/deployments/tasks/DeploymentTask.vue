<template>
  <div>
    <div class="mt-1 mb-2 d-flex flex-row align-items-baseline">
      <TaskBadge class="me-2" :task="task" />
      <PlatzReason
        :title="`Task ${task.id} Log`"
        :text="task.reason"
        :allow-expand="true"
        :is-bad="isBad"
      />
    </div>

    <UpgradeParams
      v-if="'Upgrade' in task.operation"
      :operation="task.operation.Upgrade"
      :env-id="envId"
    />

    <ReinstallParams
      v-if="'Reinstall' in task.operation"
      :operation="task.operation.Reinstall"
    />

    <RecreateParams
      v-if="'Recreate' in task.operation"
      :operation="task.operation.Recreate"
    />

    <InvokeActionParams
      v-if="'InvokeAction' in task.operation"
      :operation="task.operation.InvokeAction"
    />

    <RestartK8sResourceParams
      v-if="'RestartK8sResource' in task.operation"
      :operation="task.operation.RestartK8sResource"
    />

    <div class="mt-1 small d-flex flex-row align-items-center">
      <template v-if="task.acting_user_id">
        <PlatzUser :id="task.acting_user_id" :show-name="true" size="sm" />
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

<script setup lang="ts">
import { computed } from "vue";
import { DeploymentTaskStatus, type DeploymentTask } from "@platzio/sdk";
import PlatzReason from "@/components/base/PlatzReason.vue";
import PlatzMoment from "@/components/base/PlatzMoment.vue";
import PlatzUser from "@/components/PlatzUser.vue";
import TaskBadge from "./TaskBadge.vue";
import UpgradeParams from "./UpgradeParams.vue";
import ReinstallParams from "./ReinstallParams.vue";
import RecreateParams from "./RecreateParams.vue";
import InvokeActionParams from "./InvokeActionParams.vue";
import RestartK8sResourceParams from "./RestartK8sResourceParams.vue";
import { useStore } from "@/store";

const props = defineProps<{
  envId: string;
  task: DeploymentTask;
}>();

const store = useStore();

const isBad = computed(() => props.task.status == DeploymentTaskStatus.Failed);

const formattedDeployment = computed(() => {
  if (!props.task.acting_deployment_id) {
    return undefined;
  }
  const deployment = store?.collections.deployments.getOne(
    props.task.acting_deployment_id
  );
  if (!deployment) {
    return undefined;
  }
  return store?.collections.deployments.formatItem(deployment);
});
</script>
