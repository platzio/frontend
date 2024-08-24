<template>
  <div>
    <EnvsNavbar :envId="envId" />
    <router-view :envId="envId" />
  </div>
</template>

<script setup lang="ts">
import EnvsNavbar from "./EnvsNavbar.vue";

defineProps<{
  envId: string;
}>();
</script>
