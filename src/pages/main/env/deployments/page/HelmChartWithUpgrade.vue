<template>
  <div class="d-flex flex-row" v-if="chart">
    <div
      class="d-flex flex-row align-items-center"
      :class="{ 'alert alert-primary py-1 px-2 m-0': newerChart }"
    >
      <div :class="{ 'text-dark': newerChart }">
        <PlatzHelmChart
          :chart="chart"
          :color="false"
          format="git"
          :time="false"
          :digest="false"
        />
      </div>
      <div v-if="newerChart" class="ms-3">
        <button
          class="btn btn-sm btn-primary"
          @click="showUpgradeModal"
          v-if="!altState"
          :disabled="disabled"
        >
          <FaIcon icon="arrow-circle-up" fixed-width />
          New Version Available
        </button>
        <button
          class="btn btn-sm btn-primary"
          @click="upgradeImmediately"
          v-if="altState"
          :disabled="disabled"
        >
          <FaIcon icon="fast-forward" fixed-width />
          Upgrade Immediately
        </button>
      </div>
    </div>
    <EditDeployment ref="editDeployment" :envId="envId" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
import { type Deployment } from "@platzio/sdk";
import { useStore } from "@/store";
import { chartForUpgrade } from "@/store/models/helm-chart";
import { isDeploymentMaintainer } from "@/store/permissions";
import PlatzHelmChart from "@/components/PlatzHelmChart.vue";
import EditDeployment from "../EditDeployment.vue";

const props = defineProps<{
  envId: string;
  deployment: Deployment;
}>();

const store = useStore();
const editDeployment = ref<typeof EditDeployment>();
const disabled = ref(false);

const altState = ref(false);
const keyUpController = new AbortController();
const keyDownController = new AbortController();

const keyHandler = (event: KeyboardEvent) => {
  altState.value = event.altKey;
};

window.addEventListener("keyup", keyHandler, {
  signal: keyUpController.signal,
});
window.addEventListener("keydown", keyHandler, {
  signal: keyDownController.signal,
});

onBeforeUnmount(() => {
  keyUpController.abort();
  keyDownController.abort();
});

const isMaintainer = computed(() =>
  isDeploymentMaintainer(props.envId, props.deployment.kind_id)
);

const chart = computed(() =>
  store?.collections.helmCharts.getOne(props.deployment.helm_chart_id)
);

const newerChart = computed(() =>
  isMaintainer.value && props.deployment.enabled && chart.value
    ? chartForUpgrade(chart.value)
    : null
);

const deploymentForUpgrade = computed(() =>
  newerChart.value
    ? Object.assign({}, props.deployment, {
        helm_chart_id: newerChart.value.id,
      })
    : props.deployment
);

const showUpgradeModal = () =>
  editDeployment.value?.openForEdit(deploymentForUpgrade.value);

const upgradeImmediately = async () => {
  if (!editDeployment.value) {
    return;
  }
  disabled.value = true;
  await editDeployment.value.submitWithoutOpening(deploymentForUpgrade.value);
  disabled.value = false;
};
</script>
