<template>
  <div v-if="formatted">
    <FaIcon :icon="formatted.icon" />
    {{ formatted.text }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/store";

const props = defineProps<{
  id: string;
}>();

const store = useStore();

const kind = computed(() =>
  store?.collections.deploymentKinds.getOne(props.id)
);

const formatted = computed(() =>
  kind.value
    ? store?.collections.deploymentKinds.formatItem(kind.value)
    : undefined
);
</script>
