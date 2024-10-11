<template>
  <pre v-if="body" class="mt-0 mb-2 small text-body-secondary">{{ body }}</pre>
</template>

<script setup lang="ts">
import { computed } from "vue";
import yaml from "js-yaml";
import { isEqual } from "lodash";
import { type DeploymentInvokeActionTask } from "@platzio/sdk";

const props = defineProps<{
  operation: DeploymentInvokeActionTask;
}>();

const body = computed(() =>
  isEqual(props.operation.body, {}) ? null : yaml.dump(props.operation.body)
);
</script>
