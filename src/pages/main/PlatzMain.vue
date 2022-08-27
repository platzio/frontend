<template>
  <div v-if="ready">
    <div class="container-fluid px-5 mb-5">
      <router-view />
    </div>
  </div>

  <PlatzLoader v-else />

  <PlatzFontPreloader />
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import PlatzLoader from "./PlatzLoader.vue";
import PlatzFontPreloader from "./PlatzFontPreloader.vue";

export default defineComponent({
  components: {
    PlatzLoader,
    PlatzFontPreloader,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    watch(
      () => store!.auth.needsLogin,
      (needsLogin) => {
        if (needsLogin) {
          router.replace({
            name: "auth.login",
            query: {
              next: route.fullPath,
            },
          });
        }
      },
      { immediate: true }
    );

    return {
      ready: store!.ready,
    };
  },
});
</script>
