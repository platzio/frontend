<template>
    <div>
        <div class="my-2" v-if="formatted">
            <FaIcon :icon="formatted.icon" fixed-width />
            {{ formatted.text }}
        </div>
        <ResourceReason class="my-2" :resource="resource" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useStore } from "@/store";
import { DeploymentResource } from "@/store/models/deployment-resource";
import ResourceReason from "./ResourceReason.vue";

export default defineComponent({
    copmponents: {
        ResourceReason,
    },

    props: {
        resource: {
            type: Object as PropType<DeploymentResource>,
            required: true,
        },
    },

    setup(props) {
        const store = useStore();

        const formatted = computed(() =>
            store!.collections.deploymentResources.formatItem(props.resource)
        );

        return {
            formatted,
        };
    },
});
</script>
