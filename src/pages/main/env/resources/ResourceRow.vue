<template>
  <div>
    <div class="my-2 text-secondary fw-bold" v-if="formatted">
      <fa :icon="formatted.icon" fixed-width />
      {{ formatted.text }}
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { DeploymentResource } from "@/store/models/deployment-resource";
import { computed, defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  props: {
    resource: {
      type: Object as PropType<DeploymentResource>,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const formatted = computed(() =>
      store!.collections.deploymentResources.formatItem(props.resource)
    );

    return {
      formatted,
    };
  },
});
</script>
