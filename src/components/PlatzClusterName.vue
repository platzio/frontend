<template>
  <div>
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

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    showRegion: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    const store = useStore();
    const cluster = computed(() => store!.collections.k8sClusters.getOne(props.id));

    return {
      cluster,
    };
  },
});
</script>
