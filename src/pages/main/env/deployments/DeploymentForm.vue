<template>
  <div class="mb-3 form-floating" v-if="canHaveName">
    <input
      type="name"
      class="form-control"
      id="name"
      aria-describedby="nameHelp"
      v-model="new_data.name"
      required
      pattern="^[\-a-z0-9]+$"
      :maxlength="maxNameLength"
      :disabled="working"
    />
    <label for="name" class="form-label"> Deployment Name </label>
    <div id="nameHelp" class="form-text" v-if="new_data.name">
      <FaIcon icon="keyboard" class="ms-1" fixed-width />
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
        {{ chart.error ? "[BROKEN]" : "" }}
        {{ chart.image_tag }} (from {{ fromNow(chart.created_at) }})
      </option>
    </select>
    <label for="helmChartId" class="form-label">
      Version
      <span v-if="chartsLoading" class="ms-2">
        <FaIcon icon="circle-notch" fixed-width spin />
        {{ chartsLoadingPercent }}%
      </span>
    </label>
  </div>

  <ConfigInputsForm
    :envId="envId"
    :uiSchema="newUiSchema"
    v-model="new_data.config"
    :disabled="working"
  />

  <div class="small my-1 opacity-50">
    <FaIcon icon="shield-alt" fixed-width />
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

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { cloneDeep } from "lodash";
import moment from "moment";
import { type Deployment, ChartExtCardinality } from "@platzio/sdk";
import YamlInput from "@/components/inputs/YamlInput.vue";
import { useStore } from "@/store";
import { chartFeatures } from "@/store/chart-ext";
import ConfigInputsForm from "./config/ConfigInputsForm.vue";
import { isDeploymentOwner } from "@/store/permissions";

const props = defineProps<{
  envId: string;
  currentData: Partial<Deployment>;
  working: boolean;
}>();

const store = useStore();
const new_data = ref<Partial<Deployment>>({});

const isOwner = computed(
  () =>
    new_data.value.kind_id &&
    isDeploymentOwner(props.envId, new_data.value.kind_id)
);

const new_kind = computed(() =>
  new_data.value.kind_id
    ? store!.collections.deploymentKinds.getOne(new_data.value.kind_id)
    : undefined
);

// Max DNS name length, minus deployment prefix, minus the dash
const maxNameLength = computed(() => 62 - (new_kind.value?.name || "").length);

const possibleClusters = computed(() =>
  store!.collections.k8sClusters.all
    .filter((cluster) => !cluster.ignore)
    .filter((cluster) => cluster.env_id == props.envId)
);

watch(
  () => new_data.value.kind_id,
  () => {
    if (new_data.value.kind_id) {
      store!.collections.helmCharts.setFilters({
        kind_id: new_data.value.kind_id,
      });
    }
  }
);

const chartsLoading = computed(() => store!.collections.helmCharts.loading);
const chartsLoadingPercent = computed(
  () => store!.collections.helmCharts.loadingPercent
);

const filteredCharts = computed(() =>
  store!.collections.helmCharts.all.filter((chart) => {
    const registry = store!.collections.helmRegistries.getOne(
      chart.helm_registry_id
    );
    return new_data.value.kind_id === registry?.kind_id;
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
  const features = chartFeatures(newChart.value);
  if (!features) {
    return true;
  }
  return features.cardinality == ChartExtCardinality.Many;
});

const newUiSchema = computed(() => {
  if (!newChart.value) {
    return null;
  }
  return newChart.value.values_ui;
});

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
  if (
    !new_data.value.kind_id ||
    !new_data.value.cluster_id ||
    !new_data.value.helm_chart_id
  ) {
    return;
  }
  const deployment = await store!.collections.deployments.createItem({
    name: new_data.value.name,
    kind_id: new_data.value.kind_id,
    cluster_id: new_data.value.cluster_id,
    helm_chart_id: new_data.value.helm_chart_id,
    config: new_data.value.config,
    values_override: new_data.value.values_override,
  });
  return deployment.id;
}

function fromNow(ts: string) {
  return moment(ts).fromNow();
}

defineExpose({ save });
</script>
