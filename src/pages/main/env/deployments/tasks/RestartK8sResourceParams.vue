<template>
  <div class="mt-1 mb-2 small text-muted">
    Restart <strong>{{ operation.resource_name }}</strong>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DeploymentRestartK8sResourceTask } from "@/store/models/deployment-task";

export default defineComponent({
  props: {
    operation: {
      type: Object as PropType<DeploymentRestartK8sResourceTask>,
      required: true,
    },
  },
});
</script>
