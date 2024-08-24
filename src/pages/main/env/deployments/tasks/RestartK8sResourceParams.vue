<template>
  <div class="mt-1 mb-2 small text-body-secondary">
    Restart <strong>{{ operation.resource_name }}</strong>
  </div>
</template>

<script setup lang="ts">
import { type DeploymentRestartK8sResourceTask } from "@platzio/sdk";

defineProps<{
  operation: DeploymentRestartK8sResourceTask;
}>();
</script>
