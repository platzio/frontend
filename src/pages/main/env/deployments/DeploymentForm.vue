<template>
  <div class="mb-3 form-floating" v-if="canHaveName">
    <input
      type="name"
      class="form-control"
      id="name"
      aria-describedby="nameHelp"
      v-model="new_data.name"
      required
      pattern="^[-a-z0-9]+$"
      :maxlength="maxNameLength"
      :disabled="working"
    />
    <label for="name" class="form-label"> Deployment Name </label>
    <div id="nameHelp" class="form-text" v-if="new_data.name">
      <fa icon="keyboard" class="ms-1" fixed-width />
      Enter a valid DNS name,
      {{ maxNameLength - new_data.name.length }} characters left
    </div>
  </div>

  <div class="mb-3 form-floating">
    <select
      name="clusterId"
      class="form-select"
      aria-label="Select Cluster"
      v-model="new_data.cluster_id"
      required
      :disabled="working"
    >
      <option
        v-for="cluster in possibleClusters"
        :key="cluster.id"
        :value="cluster.id"
      >
        {{ cluster.region_name }} / {{ cluster.name }}
      </option>
    </select>
    <label for="clusterId" class="form-label"> Cluster </label>
  </div>

  <div class="mb-3 form-floating">
    <select
      name="helmChartId"
      class="form-select"
      aria-label="Select Version"
      v-model="new_data.helm_chart_id"
      required
      :disabled="working"
    >
      <option
        v-for="chart in filteredCharts"
        :key="chart.id"
        :value="chart.id"
        :disabled="!chart.available"
      >
        {{ chart.available ? "" : "[DELETED]" }}
        {{ chart.image_tag }} (from {{ fromNow(chart.created_at) }})
      </option>
    </select>
    <label for="helmChartId" class="form-label"> Version </label>
  </div>

  <ConfigInputsForm
    :envId="envId"
    :uiSchema="newUiSchema"
    v-model="new_data.config"
    :disabled="working"
  />

  <div class="small my-1 opacity-50">
    <fa icon="shield-alt" fixed-width />
    This field is only visible to deployment owners
  </div>
  <div class="mb-3 form-floating" v-show="isOwner">
    <YamlInput
      id="valuesOverride"
      v-model="new_data.values_override"
      :disabled="working"
    />
    <label for="valuesOverride" class="form-label">
      Values Override (YAML)
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType, watch } from "vue";
import { capitalize, cloneDeep } from "lodash";
import moment from "moment";
import { useStore } from "@/store";
import { Deployment } from "@/store/models/deployment";
import { HelmChartCardinality } from "@/store/models/helm-chart";
import ConfigInputsForm from "./config/ConfigInputsForm.vue";
import { isDeploymentOwner } from "@/store/permissions";

export default defineComponent({
  components: {
    ConfigInputsForm,
  },

  props: {
    envId: {
      type: String,
      required: true,
    },
    currentData: {
      type: Object as PropType<Deployment>,
      required: true,
    },
    working: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const store = useStore();
    const new_data = ref<Partial<Deployment>>({});

    const isOwner = computed(
      () =>
        new_data.value.kind &&
        isDeploymentOwner(props.envId, new_data.value.kind)
    );

    // Max DNS name length, minus deployment prefix, minus the dash
    const maxNameLength = computed(
      () => 62 - (new_data.value.kind || "").length
    );

    const possibleClusters = computed(() =>
      store!.collections.k8sClusters.all
        .filter((cluster) => !cluster.ignore)
        .filter((cluster) => cluster.env_id == props.envId)
    );
    const filteredCharts = computed(() =>
      store!.collections.helmCharts.all.filter((chart) => {
        const registry = store!.collections.helmRegistries.getOne(
          chart.helm_registry_id
        );
        const repo = registry.repo_name.split("/").pop();
        const kind = repo!.split("-").map(capitalize).join("");
        return new_data.value.kind && kind === new_data.value.kind;
      })
    );

    const newChart = computed(
      () =>
        new_data.value &&
        new_data.value.helm_chart_id &&
        store!.collections.helmCharts.getOne(new_data.value.helm_chart_id)
    );

    const canHaveName = computed(() => {
      if (!newChart.value) {
        return false;
      }
      if (!newChart.value.features) {
        return true;
      }
      const { cardinality = HelmChartCardinality.Many } =
        newChart.value.features;
      return cardinality == HelmChartCardinality.Many;
    });

    const newUiSchema = computed(
      () => newChart.value && newChart.value.values_ui
    );

    watch(
      () => props.currentData,
      (newData) => {
        new_data.value = cloneDeep(newData);
      },
      { deep: true }
    );

    async function save() {
      if (props.currentData.id) {
        const updated = await store!.collections.deployments.updateItem({
          id: props.currentData.id,
          data: new_data.value,
        });
        return updated.id;
      }
      const deployment = await store!.collections.deployments.createItem(
        new_data.value
      );
      return deployment.id;
    }

    function fromNow(ts: string) {
      return moment(ts).fromNow();
    }

    return {
      new_data,
      possibleClusters,
      filteredCharts,
      canHaveName,
      newUiSchema,
      isOwner,
      maxNameLength,
      save,
      fromNow,
    };
  },
});
</script>
