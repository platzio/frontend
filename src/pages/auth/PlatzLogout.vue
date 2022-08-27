<template>
  <PlatzCenteredLogo :progress="100" :animate-progress="true" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();

    onMounted(() => {
      store!.auth.logout();
      setTimeout(() => router.push({ name: "main" }), 1500);
    });

    return {};
  },
});
</script>
