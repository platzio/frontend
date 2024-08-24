<template>
  <div v-if="cluster">
    <span v-if="showRegion">
      <FaIcon icon="globe" fixed-width />
      {{ cluster.region_name }}
    </span>
    <span v-if="showRegion">
      <FaIcon icon="angle-right" class="mx-2 opacity-75" />
    </span>
    <span>
      <FaIcon icon="cubes" fixed-width />
      {{ cluster.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/store";

const props = withDefaults(
  defineProps<{
    id: string;
    showRegion: boolean;
  }>(),
  {
    showRegion: true,
  }
);

const store = useStore();
const cluster = computed(() => store!.collections.k8sClusters.getOne(props.id));
</script>
