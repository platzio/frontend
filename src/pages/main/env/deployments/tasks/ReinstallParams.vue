<template>
    <div class="mt-1 mb-2 small text-body-secondary">
        Deployment reinstalled: <strong>{{ operation.reason }}</strong>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { DeploymentReinstallTask } from "@platzio/sdk";

export default defineComponent({
    props: {
        operation: {
            type: Object as PropType<DeploymentReinstallTask>,
            required: true,
        },
    },
});
</script>
