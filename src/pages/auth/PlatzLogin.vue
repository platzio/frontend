<template>
  <PlatzProgressPage
    :progress="100"
    :animate-progress="true"
    text="🚀 redirecting to google"
    :error="error"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { AuthenticationApi } from "@platzio/sdk";
import { useStore } from "@/store";

const store = useStore();
const api = new AuthenticationApi(store!.auth.sdkConfig());
const error = ref<any>(null);

onMounted(async () => {
  try {
    const res = await api.startGoogleLogin();
    window.location.assign(res.data.redirect_url);
  } catch (err) {
    error.value = err;
  }
});
</script>
