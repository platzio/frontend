<template>
  <PlatzProgressPage text="finishing login" :error="error" />
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";

interface LoginResponse {
  access_token: string;
}

export default defineComponent({
  setup() {
    const store = useStore();
    const error = ref<any>(null);
    const router = useRouter();
    const route = useRoute();

    onMounted(async () => {
      try {
        const { code } = route.query;
        const res = await axios.post("/api/v2/auth/google/callback", {
          auth_code: code,
        });
        const login_res = res.data as LoginResponse;
        store!.auth.setAccessToken(login_res.access_token);
        await store!.auth.start();
        router.replace({ name: "main" });
      } catch (err) {
        error.value = err;
      }
    });

    return {
      error,
    };
  },
});
</script>
