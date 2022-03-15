<template>
  <div>
    <div class="d-flex flex-row justify-content-between align-items-start">
      <div class="d-flex flex-row align-items-center">
        <div class="h1 me-3" v-if="formatted">
          <fa :icon="formatted.icon" />
          {{ formatted.text }}
        </div>
        <DeploymentStatus class="me-2" :deployment="deployment" />
      </div>

      <ActionsMenu :envId="envId" :deployment="deployment" />
    </div>

    <ul class="mt-2 nav nav-tabs">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: curTab == 'overview' }"
          @click="curTab = 'overview'"
        >
          Overview
          <DeploymentWarnings :deployment="deployment" />
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: curTab == 'resources' }"
          @click="curTab = 'resources'"
        >
          Resources
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: curTab == 'history' }"
          @click="curTab = 'history'"
        >
          <span class="me-1">History</span>
          <span v-if="history">
            <fa
              v-if="history.loading"
              class="opacity-75"
              icon="circle-notch"
              fixed-width
              spin
            />
            <span v-else>({{ history.summary }})</span>
          </span>
        </a>
      </li>
    </ul>

    <div class="card border-top-0 rounded-0 rounded-bottom">
      <div class="card-body" v-show="curTab == 'overview'">
        <div class="row">
          <!-- Overview left part -->
          <div class="col-7">
            <div v-if="deployment.description_md">
              <Markdown :source="deployment.description_md" />
            </div>
            <div class="my-2 text-secondary">
              <HelmChartWithUpgrade :envId="envId" :deployment="deployment" />
            </div>

            <div class="my-2 text-secondary">
              <K8sClusterName :id="deployment.cluster_id" />
            </div>
            <div>
              <ConfigValues :envId="envId" :deployment="deployment" />
            </div>
          </div>

          <!-- Overview right part -->
          <div class="col-5">
            <Notices :deployment="deployment" />

            <div class="row justify-content-end">
              <div
                class="col-6 mb-3"
                v-for="(metric, idx) in metrics"
                :key="idx"
              >
                <div class="card">
                  <div class="card-body px-4 py-3">
                    <Metric :metric="metric" />
                  </div>
                </div>
              </div>
            </div>

            <Reason
              class="my-3 py-2 px-3 reason rounded border"
              :text="deployment.reason"
              :auto-expand="true"
              :is-bad="hasError"
            />
          </div>
        </div>
      </div>

      <div class="card-body px-0 py-1" v-show="curTab == 'resources'">
        <K8sResources :envId="envId" :deployment="deployment" />
      </div>

      <div class="card-body px-0 py-1" v-show="curTab == 'history'">
        <History :deployment="deployment" :envId="envId" ref="history" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.reason {
  background: #f9f9f9;
}
</style>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useHead } from "@vueuse/head";
import { useStore } from "@/store";
import { DeploymentStatus } from "@/store/models/deployment";
import Metric from "@/components/Metric.vue";
import ActionsMenu from "./ActionsMenu.vue";
import HelmChartWithUpgrade from "./HelmChartWithUpgrade.vue";
import Notices from "./Notices.vue";
import ConfigValues from "./config/ConfigValues.vue";
import History from "./History.vue";
import K8sResources from "./K8sResources.vue";

export default defineComponent({
  components: {
    Metric,
    ActionsMenu,
    HelmChartWithUpgrade,
    Notices,
    ConfigValues,
    History,
    K8sResources,
  },

  props: {
    envId: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const curTab = ref("overview");
    const history = ref<typeof History>();

    const env = computed(() => store!.collections.envs.getOne(props.envId));

    const deployment = computed(() =>
      store!.collections.deployments.getOne(props.id)
    );

    const formatted = computed(() =>
      store!.collections.deployments.formatItem(deployment.value)
    );

    const hasError = computed(
      () => deployment.value.status == DeploymentStatus.Error
    );

    const cluster = computed(() =>
      store!.collections.k8sClusters.getOne(deployment.value.cluster_id)
    );

    const metrics = computed(() => {
      const { reported_status } = deployment.value;
      return reported_status && reported_status.content
        ? (reported_status.content.metrics || []).concat(
            reported_status.content.primary_metric
              ? [reported_status.content.primary_metric]
              : []
          )
        : [];
    });

    onBeforeRouteUpdate((to) => {
      if (to.params.envId !== props.envId) {
        return {
          name: "env.deployments.list",
          params: {
            envId: to.params.envId,
            kind: props.kind,
          },
        };
      }
    });

    useHead({
      title: computed(() =>
        deployment.value.name
          ? `${deployment.value.name} - ${deployment.value.kind} - Deployments - ${env.value.name} - Platz`
          : `${deployment.value.kind} - Deployments - ${env.value.name} - Platz`
      ),
    });

    return {
      deployment,
      curTab,
      history,
      formatted,
      hasError,
      cluster,
      metrics,
    };
  },
});
</script>
