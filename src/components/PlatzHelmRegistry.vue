<template>
  <div>
    <FaIcon :icon="registry.fa_icon" fixed-width class="me-1" />
    <span>{{ registry.domain_name }}</span>
    <span>/</span>
    <span class="fw-bold">{{ registry.repo_name }}</span>
  </div>
</template>

<script setup lang="ts">
import { type HelmRegistry } from "@platzio/sdk";

defineProps<{
  registry: HelmRegistry;
}>();
</script>
