<template>
    <PlatzProgressPage text="finishing login" :error="error" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PlatzProgressPage from "@/components/base/PlatzProgressPage.vue";
import { AuthenticationApi } from "@platzio/sdk";
import { useStore } from "@/store";

export default defineComponent({
    components: {
        PlatzProgressPage,
    },

    setup() {
        const store = useStore();
        const api = new AuthenticationApi(store!.auth.sdkConfig());
        const error = ref<any>(null);
        const router = useRouter();
        const route = useRoute();

        onMounted(async () => {
            try {
                const { code } = route.query;
                if (!code) {
                    throw new Error("No code in query parametrs");
                }
                const res = await api.finishGoogleLogin({
                    oAuth2Response: {
                        auth_code: code.toString(),
                    },
                });
                store!.auth.setAccessToken(res.data.access_token);
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
