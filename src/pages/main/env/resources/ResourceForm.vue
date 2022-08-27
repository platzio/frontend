<template>
  <div>
    <div class="mb-3 form-floating">
      <input
        type="text"
        class="form-control"
        id="name"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        v-model="new_data.name"
        required
        pattern="^[-A-Za-z0-9_]+$"
        :disabled="disabled"
      />
      <label for="name" class="form-label">
        <FaIcon :icon="resourceType.spec.fontawesome_icon" fixed-width />
        {{ resourceType.spec.name_singular }} Name
      </label>
    </div>

    <div class="mb-3 form-floating">
      <select
        class="form-select"
        id="deployment_id"
        v-model="new_data.deployment_id"
        :disabled="disabled || new_data.id"
        required="required"
      >
        <option
          v-for="deployment in possibleDeployments"
          :key="deployment.id"
          :value="deployment.id"
        >
          {{ formatDeployment(deployment).text }}
        </option>
      </select>
      <label class="opacity-100">
        <span class="opacity-50">Managing Deployment</span>
      </label>
      <div class="form-text" v-if="new_data.id">
        Managing deployment can't be changed for existing resources
      </div>
    </div>

    <ConfigInputsForm
      :envId="envId"
      :uiSchema="resourceType.spec.values_ui"
      :disabled="disabled"
      :isNew="isNew"
      v-model="new_data.props"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch, computed } from "vue";
import { cloneDeep } from "lodash";
import { useStore } from "@/store";
import { DeploymentResource } from "@/store/models/deployment-resource";
import ConfigInputsForm from "../deployments/config/ConfigInputsForm.vue";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
    resourceTypeId: {
      type: String,
      required: true,
    },
    currentData: {
      type: Object as PropType<DeploymentResource>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    ConfigInputsForm,
  },

  setup(props) {
    const store = useStore();

    const resourceType = computed(() =>
      store!.collections.deploymentResourceTypes.getOne(props.resourceTypeId)
    );

    const possibleDeployments = computed(() =>
      store!.collections.deployments
        .allForEnv(props.envId)
        .filter((deployment) => deployment.kind === resourceType.value.deployment_kind)
    );

    const new_data = ref<Partial<DeploymentResource>>({});

    watch(
      () => props.currentData,
      (newData) => {
        new_data.value = cloneDeep(newData);
      }
    );

    const isNew = computed(() => !!props.currentData.id);

    async function save() {
      if (isNew.value) {
        const updated = await store!.collections.deploymentResources.updateItem({
          id: props.currentData.id,
          data: {
            name: new_data.value.name,
            props: new_data.value.props,
          },
        });
        return updated.id;
      }
      const resource = await store!.collections.deploymentResources.createItem({
        type_id: props.resourceTypeId,
        ...new_data.value,
      });
      return resource.id;
    }

    const formatDeployment = computed(() => store!.collections.deployments.formatItem);

    return {
      new_data,
      possibleDeployments,
      isNew,
      save,
      resourceType,
      formatDeployment,
    };
  },
});
</script>
