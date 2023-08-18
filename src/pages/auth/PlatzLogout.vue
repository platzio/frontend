<template>
    <PlatzProgressPage :progress="100" :animate-progress="true" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import PlatzProgressPage from "@/components/base/PlatzProgressPage.vue";
import { useStore } from "@/store";

export default defineComponent({
    components: {
        PlatzProgressPage,
    },

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
