<template>
  <CenteredLogo
    :progress="100"
    :animate-progress="true"
    text="🚀 redirecting to google"
    :error="error"
  />
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, onMounted, ref } from "vue";

interface GoogleLoginInfo {
  redirect_url: string;
}

export default defineComponent({
  setup() {
    const error = ref<any>(null);

    onMounted(async () => {
      try {
        const res = await axios.get("/api/v2/auth/google");
        const login_info = res.data as GoogleLoginInfo;
        window.location.assign(login_info.redirect_url);
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
