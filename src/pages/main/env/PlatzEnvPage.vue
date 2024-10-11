<template>
  <div>
    <EnvsNavbar :env-id="envId" />
    <router-view :env-id="envId" />
  </div>
</template>

<script setup lang="ts">
import EnvsNavbar from "./EnvsNavbar.vue";

defineProps<{
  envId: string;
}>();
</script>
