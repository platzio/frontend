<template>
  <div>
    <div class="my-2" v-if="formatted">
      <fa :icon="formatted.icon" fixed-width />
      {{ formatted.text }}
    </div>
    <div class="my-2">
      <Reason
        :text="resource.sync_reason"
        :isBad="resource.sync_status === SyncStatus.Error"
        :allowExpand="false"
      >
        <template #before>
          <div class="me-2 badge" :class="syncStatusClass">
            {{ resource.sync_status.toUpperCase() }}
          </div>
        </template>
      </Reason>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import {
  DeploymentResource,
  SyncStatus,
} from "@/store/models/deployment-resource";
import { computed, defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
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
      formatted,
      syncStatusClass,
      SyncStatus,
    };
  },
});
</script>
