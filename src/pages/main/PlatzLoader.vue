<template>
  <PlatzCenteredLogo :progress="loadingProgress" :text="loadingStatus" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  setup() {
    const store = useStore();

    return {
      loadingProgress: store!.loadingProgress,
      loadingStatus: store!.loadingStatus,
    };
  },
});
</script>
