<template>
  <Modal
    ref="modal"
    size="lg"
    title="Bulk Upgrade/Downgrade"
    :submit-text="submitText"
    :topError="topError"
    :error="bottomError"
    :working="disabled"
    @submit="submit"
  >
    <ul class="list-group">
      <li
        class="list-group-item"
        v-for="(deployment_plan, deployment_id) in plan"
        :key="deployment_id"
      >
        <div class="d-flex flex-row align-items-center">
          <div class="form-check me-2">
            <input class="form-check-input" type="checkbox" v-model="deployment_plan.enabled" />
          </div>
          <div>
            <div class="my-1" v-if="deployment_plan.formatted">
              <fa :icon="deployment_plan.formatted.icon" />
              {{ deployment_plan.formatted.text }}
            </div>
            <div class="my-1 small d-flex flex-row">
              <span class="me-2 text-secondary">Current Version</span>
              <HelmChart
                size="sm"
                :chart="deployment_plan.currentChart"
                :color="false"
                format="git"
                :time="false"
                :digest="false"
              />
            </div>
            <div class="my-1 small d-flex flex-row">
              <span class="me-2 text-secondary">Target Version</span>
              <div class="mb-3 form-floating">
                <select
                  name="helmChartId"
                  class="form-select"
                  aria-label="Select Version"
                  v-model="deployment_plan.newChartId"
                  required
                  :disabled="disabled"
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
            </div>
          </div>
        </div>
      </li>
    </ul>
  </Modal>
</template>

<script lang="ts">
import Modal from "@/components/base/Modal.vue";
import { useStore } from "@/store";
import { chartForUpgrade, HelmChart } from "@/store/models/helm-chart";
import { computed, defineComponent, reactive, ref, toRefs } from "vue";

function initialData(): {
  topError: any;
  bottomError: any;
  disabled: boolean;
  plan: Record<
    string,
    {
      enabled: boolean;
      formatted?: {
        text: string;
        icon: string;
      };
      currentChart?: HelmChart;
      newChartId?: string;
    }
  >;
} {
  return {
    topError: null,
    bottomError: null,
    disabled: false,
    plan: {},
  };
}

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
    Modal,
  },

  setup(props) {
    const store = useStore();
    const state = reactive(initialData());
    const modal = ref<typeof Modal>();

    const deployments = computed(() =>
      store!.collections.deployments
        .allForEnv(props.envId)
        .filter((deployment) => deployment.kind === props.kind)
    );

    function open() {
      Object.assign(state, initialData());
      for (const deployment of deployments.value) {
        const formatted = store!.collections.deployments.formatItem(deployment);
        const currentChart = store!.collections.helmCharts.getOne(deployment.helm_chart_id);
        const newChart = chartForUpgrade(currentChart);
        const enabled = newChart ? newChart.id !== deployment.helm_chart_id : false;
        state.plan[deployment.id] = {
          enabled,
          formatted,
          currentChart,
          newChartId: newChart ? newChart.id : currentChart.id,
        };
      }
      modal.value!.open();
    }

    function close() {
      modal.value!.close();
    }

    const planSelected = computed(
      () => Object.values(state.plan).filter((deploymentPlan) => deploymentPlan.enabled).length
    );

    const submitText = computed(() => {
      switch (planSelected.value) {
        case 0:
          return "Nothing To Do";
        case 1:
          return "Upgrade 1 Deployment";
        default:
          return `Upgrade ${planSelected.value} Deployments`;
      }
    });

    async function submit() {
      try {
        state.disabled = true;
        state.bottomError = null;
        close();
      } catch (error) {
        state.bottomError = error;
        state.disabled = false;
      }
    }

    return {
      modal,
      deployments,
      open,
      close,
      submitText,
      submit,
      ...toRefs(state),
    };
  },
});
</script>
