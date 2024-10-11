<template>
  <div v-if="resourceType">
    <div class="mb-3 form-floating">
      <input
        id="name"
        v-model="new_data.name"
        type="text"
        class="form-control"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        required
        pattern="^[\-A-Za-z0-9_]+$"
        :disabled="disabled"
      />
      <label for="name" class="form-label">
        <FaIcon :icon="resourceType.spec.fontawesome_icon" fixed-width />
        {{ resourceType.spec.name_singular }} Name
      </label>
    </div>

    <div class="mb-3 form-floating">
      <select
        id="deployment_id"
        v-model="new_data.deployment_id"
        class="form-select"
        :disabled="disabled || !!new_data.id"
        :required="true"
      >
        <option
          v-for="deployment in possibleDeployments"
          :key="deployment.id"
          :value="deployment.id"
        >
          {{ formatDeployment && formatDeployment(deployment).text }}
        </option>
      </select>
      <label class="opacity-100">
        <span class="opacity-50">Managing Deployment</span>
      </label>
      <div v-if="new_data.id" class="form-text">
        Managing deployment can't be changed for existing resources
      </div>
    </div>

    <ConfigInputsForm
      v-model="new_data.props"
      :env-id="envId"
      :ui-schema="resourceType.spec.values_ui"
      :disabled="disabled"
      :is-new="isNew"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { cloneDeep } from "lodash";
import { useStore } from "@/store";
import { type DeploymentResource } from "@platzio/sdk";
import ConfigInputsForm from "../deployments/config/ConfigInputsForm.vue";

const props = defineProps<{
  envId: string;
  resourceTypeId: string;
  currentData: Partial<DeploymentResource>;
  disabled: boolean;
}>();

const store = useStore();

const resourceType = computed(() =>
  store?.collections.deploymentResourceTypes.getOne(props.resourceTypeId)
);

const possibleDeployments = computed(() =>
  store?.collections.deployments
    .allForEnv(props.envId)
    .filter(
      (deployment) =>
        deployment.kind_id === resourceType.value?.deployment_kind_id
    )
);

const new_data = ref<Partial<DeploymentResource>>({});

watch(
  () => props.currentData,
  (newData) => {
    new_data.value = cloneDeep(newData);
  }
);

const isNew = computed(() => !props.currentData.id);

async function save() {
  if (!isNew.value) {
    if (!props.currentData.id) {
      return;
    }
    const updated = await store?.collections.deploymentResources.updateItem({
      id: props.currentData.id,
      data: {
        name: new_data.value.name,
        props: new_data.value.props,
      },
    });
    return updated?.id;
  }
  if (!new_data.value.name || !new_data.value.deployment_id) {
    return;
  }
  const resource = await store?.collections.deploymentResources.createItem({
    name: new_data.value.name,
    type_id: props.resourceTypeId,
    deployment_id: new_data.value.deployment_id,
    props: new_data.value.props,
  });
  return resource?.id;
}

const formatDeployment = computed(
  () => store?.collections.deployments.formatItem
);

defineExpose({ save });
</script>
