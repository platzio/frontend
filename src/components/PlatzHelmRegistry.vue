<template>
    <div>
        <FaIcon :icon="registry.fa_icon" fixed-width class="me-1" />
        <span>{{ registry.domain_name }}</span>
        <span>/</span>
        <span class="fw-bold">{{ registry.repo_name }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { HelmRegistry } from "@platzio/sdk";

export default defineComponent({
    props: {
        registry: {
            type: Object as PropType<HelmRegistry>,
            required: true,
        },
    },
});
</script>
