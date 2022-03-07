<template>
  <div v-if="ready">
    <div class="container-fluid px-5 mb-5">
      <router-view />
    </div>
  </div>

  <Loader v-else />

  <FontPreloader />
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import Loader from "./Loader.vue";
import FontPreloader from "./FontPreloader.vue";

export default defineComponent({
  components: {
    Loader,
    FontPreloader,
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
