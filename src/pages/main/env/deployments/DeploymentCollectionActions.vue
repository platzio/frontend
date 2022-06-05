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
    </ul>

    <EditDeployment ref="editDeployment" :envId="envId" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { isDeploymentOwner, isDeploymentMaintainer } from "@/store/permissions";
import EditDeployment from "./EditDeployment.vue";

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
  },

  setup(props) {
    const editDeployment = ref<typeof EditDeployment>();

    const isOwner = computed(() => isDeploymentOwner(props.envId, props.kind));

    return {
      editDeployment,
      isOwner,
    };
  },
});
</script>
