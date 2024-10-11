<template>
  <div>
    <div v-if="formatted" class="my-2">
      <FaIcon :icon="formatted.icon" fixed-width />
      {{ formatted.text }}
    </div>
    <ResourceReason class="my-2" :resource="resource" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type DeploymentResource } from "@platzio/sdk";
import { useStore } from "@/store";
import ResourceReason from "./ResourceReason.vue";

const props = defineProps<{
  resource: DeploymentResource;
}>();

const store = useStore();

const formatted = computed(() =>
  store?.collections.deploymentResources.formatItem(props.resource)
);
</script>
