<template>
  <div>
    <EnvsNavbar :env-id="envId" />
    <router-view :env-id="envId" />
  </div>
</template>

<script setup lang="ts">
import { useEnvScope } from "@/store";
import EnvsNavbar from "./EnvsNavbar.vue";

const props = defineProps<{
  envId: string;
}>();

// Load and subscribe this environment's collections while it is being viewed.
useEnvScope(() => props.envId);
</script>
