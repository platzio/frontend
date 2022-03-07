<template>
  <div class="mt-1 mb-2 small text-muted">
    Deployment reinstalled: <strong>{{ operation.reason }}</strong>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DeploymentReinstallTask } from "@/store/models/deployment-task";

export default defineComponent({
  props: {
    operation: {
      type: Object as PropType<DeploymentReinstallTask>,
      required: true,
    },
  },
});
</script>
