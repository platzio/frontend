<template>
  <div>
    <router-view />
    <VersionCheck />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useHead } from "@vueuse/head";
import VersionCheck from "./VersionCheck.vue";

export default defineComponent({
  components: {
    VersionCheck,
  },

  setup() {
    useHead({
      title: "Platz",
    });
  },
});
</script>
