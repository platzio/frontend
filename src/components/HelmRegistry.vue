<template>
  <div>
    <fa :icon="registry.fa_icon" fixed-width class="me-1" />
    <span>{{ registry.domain_name }}</span>
    <span>/</span>
    <span class="fw-bold">{{ registry.repo_name }}</span>
  </div>
  <div class="mt-2 small text-muted" v-if="registry.category && showCategory">
    <fa icon="tag" fixed-width />
    {{ registry.category }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { HelmRegistry } from "@/store/models/helm-registry";

export default defineComponent({
  props: {
    registry: {
      type: Object as PropType<HelmRegistry>,
      required: true,
    },
    showCategory: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
