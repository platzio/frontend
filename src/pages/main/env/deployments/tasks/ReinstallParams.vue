<template>
  <div class="mt-1 mb-2 small text-body-secondary">
    Deployment reinstalled: <strong>{{ operation.reason }}</strong>
  </div>
</template>

<script setup lang="ts">
import { type DeploymentReinstallTask } from "@platzio/sdk";

defineProps<{
  operation: DeploymentReinstallTask;
}>();
</script>
