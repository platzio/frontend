<template>
  <div class="small text-body-secondary">
    <div
      v-if="operation.old_cluster_id !== operation.new_cluster_id"
      class="mt-1"
    >
      <span class="me-1">Move from</span>
      <span class="text-secondary">
        <strong>
          <PlatzClusterName
            :id="operation.old_cluster_id"
            style="display: inline"
          />
        </strong>
      </span>
      <span class="mx-2">to</span>
      <span class="text-secondary">
        <strong>
          <PlatzClusterName
            :id="operation.new_cluster_id"
            style="display: inline"
          />
        </strong>
      </span>
    </div>
    <div
      v-if="operation.old_namespace !== operation.new_namespace"
      class="mt-1"
    >
      <span
        v-if="operation.old_cluster_id !== operation.new_cluster_id"
        class="me-1"
      >
        Then rename
      </span>
      <span v-else class="me-1"> Rename </span>
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

<script setup lang="ts">
import { type DeploymentRecreaseTask } from "@platzio/sdk";
import PlatzClusterName from "@/components/PlatzClusterName.vue";

defineProps<{
  operation: DeploymentRecreaseTask;
}>();
</script>
