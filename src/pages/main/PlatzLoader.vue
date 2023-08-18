<template>
    <PlatzProgressPage :progress="loadingProgress" :text="loadingStatus" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PlatzProgressPage from "@/components/base/PlatzProgressPage.vue";
import { useStore } from "@/store";

export default defineComponent({
    components: {
        PlatzProgressPage,
    },

    setup() {
        const store = useStore();

        return {
            loadingProgress: store!.loadingProgress,
            loadingStatus: store!.loadingStatus,
        };
    },
});
</script>
