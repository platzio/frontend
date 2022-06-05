<template>
  <div class="dropdown" v-if="isOwner">
    <a
      class="ms-4 btn btn-primary"
      href="#"
      role="button"
      id="collectionActionsDropdown"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Actions
      <fa icon="angle-down" fixed-width />
    </a>

    <ul class="dropdown-menu" aria-labelledby="collectionActionsDropdown">
      <li>
        <a class="dropdown-item" @click="editDeployment && editDeployment.openForCreate(kind)">
          <fa icon="plus" fixed-width />
          New {{ kind }} Deployment
        </a>
      </li>
      <li class="dropdown-divider" />
      <li>
        <a class="dropdown-item" @click="bulkUpgrade && bulkUpgrade.open()">
          <fa icon="arrow-down-up-across-line" fixed-width />
          Bulk Upgrade/Downgrade
        </a>
      </li>
    </ul>

    <EditDeployment ref="editDeployment" :envId="envId" />
    <BulkUpgrade ref="bulkUpgrade" :envId="envId" :kind="kind" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { isDeploymentOwner } from "@/store/permissions";
import EditDeployment from "./EditDeployment.vue";
import BulkUpgrade from "./BulkUpgrade.vue";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      required: true,
    },
  },

  components: {
    EditDeployment,
    BulkUpgrade,
  },

  setup(props) {
    const editDeployment = ref<typeof EditDeployment>();
    const bulkUpgrade = ref<typeof BulkUpgrade>();

    const isOwner = computed(() => isDeploymentOwner(props.envId, props.kind));

    return {
      editDeployment,
      bulkUpgrade,
      isOwner,
    };
  },
});
</script>
