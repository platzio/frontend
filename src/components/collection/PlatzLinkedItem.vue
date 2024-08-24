<template>
  <router-link
    :to="to"
    class="list-group-item list-group-item-action d-flex flex-row align-items-center justify-content-between"
  >
    <div class="flex-fill">
      <slot />
    </div>
    <div class="ms-3">
      <FaIcon icon="chevron-right" fixed-width />
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  to: RouteLocationRaw;
}>();
</script>
