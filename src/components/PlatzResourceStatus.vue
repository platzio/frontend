<template>
  <div class="d-flex flex-row align-items-center">
    <div
      class="dot"
      :class="`bg-${color}`"
      v-for="(color, idx) in resource.status_color"
      :key="idx"
    />
  </div>
</template>

<style lang="scss" scoped>
.dot {
  border-radius: 50%;
  width: 0.6rem;
  height: 0.6rem;
}
</style>

<script lang="ts">
import { useStore } from "@/store";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();

    const resource = computed(() =>
      store!.collections.k8sResources.getOne(props.id)
    );

    return {
      resource,
    };
  },
});
</script>
