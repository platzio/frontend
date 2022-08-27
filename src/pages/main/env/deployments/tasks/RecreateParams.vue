<template>
  <div class="small text-muted">
    <div class="mt-1" v-if="operation.old_cluster_id !== operation.new_cluster_id">
      <span class="me-1">Move from</span>
      <span class="text-secondary">
        <strong>
          <PlatzClusterName :id="operation.old_cluster_id" style="display: inline" />
        </strong>
      </span>
      <span class="mx-2">to</span>
      <span class="text-secondary">
        <strong>
          <PlatzClusterName :id="operation.new_cluster_id" style="display: inline" />
        </strong>
      </span>
    </div>
    <div class="mt-1" v-if="operation.old_namespace !== operation.new_namespace">
      <span class="me-1" v-if="operation.old_cluster_id !== operation.new_cluster_id">
        Then rename
      </span>
      <span class="me-1" v-else> Rename </span>
      <span>
        <strong>
          {{ operation.old_namespace }}
        </strong>
      </span>
      <span class="mx-2">to</span>
      <span>
        <strong>
          {{ operation.new_namespace }}
        </strong>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DeploymentRecreaseTask } from "@/store/models/deployment-task";

export default defineComponent({
  props: {
    operation: {
      type: Object as PropType<DeploymentRecreaseTask>,
      required: true,
    },
  },
});
</script>
