<template>
    <PlatzReason
        :text="resource.sync_reason"
        :isBad="resource.sync_status === SyncStatus.Error"
        :allowExpand="false"
    >
        <template #before>
            <div class="me-2 badge" :class="syncStatusClass">
                {{ resource.sync_status.toUpperCase() }}
            </div>
        </template>
    </PlatzReason>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import {
    DeploymentResource,
    SyncStatus,
} from "@/store/models/deployment-resource";

export default defineComponent({
    props: {
        resource: {
            type: Object as PropType<DeploymentResource>,
            required: true,
        },
    },

    setup(props) {
        const syncStatusClass = computed(() => {
            switch (props.resource.sync_status) {
                case SyncStatus.Creating:
                case SyncStatus.Updating:
                    return "bg-primary";
                case SyncStatus.Deleting:
                    return "bg-warning";
                case SyncStatus.Ready:
                    return "bg-success";
                case SyncStatus.Error:
                    return "bg-danger";
            }
            return "bg-secondary";
        });

        return {
            syncStatusClass,
            SyncStatus,
        };
    },
});
</script>
