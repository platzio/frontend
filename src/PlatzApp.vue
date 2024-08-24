<template>
  <div>
    <router-view />
    <VersionCheck />
  </div>
</template>

<script setup lang="ts">
import { useHead } from "@vueuse/head";
import VersionCheck from "./VersionCheck.vue";

useHead({
  title: "Platz",
});
</script>
