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
      <FaIcon icon="angle-down" fixed-width />
    </a>

    <ul class="dropdown-menu" aria-labelledby="collectionActionsDropdown">
      <li>
        <a
          class="dropdown-item"
          @click="editDeployment && editDeployment.openForCreate(kindId)"
        >
          <FaIcon icon="plus" fixed-width />
          New {{ kind?.name }} Deployment
        </a>
      </li>
    </ul>

    <EditDeployment ref="editDeployment" :envId="envId" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/store";
import { isDeploymentOwner } from "@/store/permissions";
import EditDeployment from "./EditDeployment.vue";

const props = defineProps<{
  envId: string;
  kindId: string;
}>();

const editDeployment = ref<typeof EditDeployment>();

const store = useStore();

const kind = computed(() =>
  props.kindId
    ? store?.collections.deploymentKinds.getOne(props.kindId)
    : undefined
);

const isOwner = computed(() => isDeploymentOwner(props.envId, props.kindId));
</script>
