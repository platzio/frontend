<template>
  <PlatzProgressPage :progress="loadingProgress" :text="loadingStatus" />
</template>

<script setup lang="ts">
import PlatzProgressPage from "@/components/base/PlatzProgressPage.vue";
import { useStore } from "@/store";

const store = useStore();

const loadingProgress = store?.loadingProgress;
const loadingStatus = store?.loadingStatus;
</script>
