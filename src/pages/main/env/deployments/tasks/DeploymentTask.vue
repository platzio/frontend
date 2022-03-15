<template>
  <div>
    <Reason class="flex-fill" :text="task.reason" :is-bad="isBad">
      <template #before>
        <TaskBadge class="me-2" :task="task" />
      </template>
    </Reason>

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
      <template v-if="task.user_id">
        <User :id="task.user_id" :showName="true" size="sm" />
        <span>,&nbsp;</span>
      </template>
      <Moment :value="task.created_at" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import {
  DeploymentTaskStatus,
  DeploymentTask,
} from "@/store/models/deployment-task";
import TaskBadge from "./TaskBadge.vue";
import UpgradeParams from "./UpgradeParams.vue";
import ReinstallParams from "./ReinstallParams.vue";
import RecreateParams from "./RecreateParams.vue";
import InvokeActionParams from "./InvokeActionParams.vue";
import RestartK8sResourceParams from "./RestartK8sResourceParams.vue";

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
    const isBad = computed(
      () => props.task.status == DeploymentTaskStatus.Failed
    );

    return {
      isBad,
    };
  },
});
</script>
