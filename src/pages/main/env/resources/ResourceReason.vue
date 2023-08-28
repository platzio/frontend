<template>
    <div class="d-flex flex-row align-items-baseline">
        <div class="me-2 badge" :class="syncStatusClass">
            {{ resource.sync_status.toUpperCase() }}
        </div>
        <PlatzReason
            :text="resource.sync_reason"
            :isBad="resource.sync_status === DeploymentResourceSyncStatus.Error"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { DeploymentResource, DeploymentResourceSyncStatus } from "@platzio/sdk";
import PlatzReason from "@/components/base/PlatzReason.vue";

export default defineComponent({
    components: {
        PlatzReason,
    },

    props: {
        resource: {
            type: Object as PropType<DeploymentResource>,
            required: true,
        },
    },

    setup(props) {
        const syncStatusClass = computed(() => {
            switch (props.resource.sync_status) {
                case DeploymentResourceSyncStatus.Creating:
                case DeploymentResourceSyncStatus.Updating:
                    return "bg-primary";
                case DeploymentResourceSyncStatus.Deleting:
                    return "bg-warning";
                case DeploymentResourceSyncStatus.Ready:
                    return "bg-success";
                case DeploymentResourceSyncStatus.Error:
                    return "bg-danger";
            }
            return "bg-secondary";
        });

        return {
            syncStatusClass,
            DeploymentResourceSyncStatus,
        };
    },
});
</script>
