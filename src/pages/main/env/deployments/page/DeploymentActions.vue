<template>
  <div class="dropdown">
    <a
      class="btn btn-outline-primary"
      href="#"
      role="button"
      id="actionsDropdown"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Actions
      <FaIcon icon="angle-down" fixed-width />
    </a>

    <ul class="dropdown-menu" aria-labelledby="actionsDropdown">
      <template
        v-if="isMaintainer && filteredActions && filteredActions.length > 0"
      >
        <li v-for="action in filteredActions" :key="action.id">
          <a
            class="dropdown-item"
            @click="invokeAction?.open(deployment, action)"
          >
            <FaIcon
              :icon="action.fontawesome_icon || 'flag-checkered'"
              fixed-width
            />
            {{ action.title }}
          </a>
        </li>

        <li class="dropdown-divider" />
      </template>

      <li v-if="logsUrl">
        <a class="dropdown-item" :href="logsUrl" target="_blank">
          <FaIcon icon="stream" fixed-width />
          Open logs
          <FaIcon icon="external-link-alt" fixed-width />
        </a>
      </li>

      <li v-if="isMaintainer">
        <a
          class="dropdown-item"
          @click="editDeployment?.openForEdit(deployment)"
        >
          <FaIcon icon="edit" fixed-width />
          Edit Deployment
        </a>
      </li>

      <li v-if="isMaintainer">
        <a
          class="dropdown-item"
          @click="editDeployment?.openForCloneFrom(deployment)"
        >
          <FaIcon icon="edit" fixed-width />
          Clone From Deployment
        </a>
      </li>

      <li v-if="isMaintainer">
        <a class="dropdown-item" @click="editDescription?.open(deployment)">
          <FaIcon icon="message" fixed-width />
          Edit Description
        </a>
      </li>

      <template v-if="isOwner">
        <li class="dropdown-divider" />
        <li v-if="!deployment.enabled">
          <a class="dropdown-item" @click="enableDeployment?.open(deployment)">
            <FaIcon icon="toggle-on" fixed-width />
            Enable Deployment
          </a>
        </li>

        <li v-if="deployment.enabled">
          <a class="dropdown-item" @click="disableDeployment?.open(deployment)">
            <FaIcon icon="toggle-off" fixed-width />
            Disable Deployment
          </a>
        </li>

        <li>
          <a
            class="dropdown-item"
            @click="deleteDeployment?.open(deployment.id)"
          >
            <FaIcon icon="trash" fixed-width />
            Delete Deployment
          </a>
        </li>
      </template>
    </ul>

    <InvokeAction ref="invokeAction" :envId="envId" />
    <EditDeployment ref="editDeployment" :envId="envId" />
    <EditDescription ref="editDescription" />
    <EnableDeployment ref="enableDeployment" />
    <DisableDeployment ref="disableDeployment" />
    <DeleteDeployment ref="deleteDeployment" @done="backToDeployments" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { type Deployment } from "@platzio/sdk";
import { useStore } from "@/store";
import { isDeploymentOwner, isDeploymentMaintainer } from "@/store/permissions";
import InvokeAction from "../InvokeAction.vue";
import EditDeployment from "../EditDeployment.vue";
import EditDescription from "./EditDescription.vue";
import EnableDeployment from "./EnableDeployment.vue";
import DisableDeployment from "./DisableDeployment.vue";
import DeleteDeployment from "./DeleteDeployment.vue";
import { chartActionsSchema } from "@/store/chart-ext";

const props = defineProps<{
  envId: string;
  deployment: Deployment;
}>();

const store = useStore();
const invokeAction = ref<typeof InvokeAction>();
const editDeployment = ref<typeof EditDeployment>();
const editDescription = ref<typeof EditDescription>();
const enableDeployment = ref<typeof EnableDeployment>();
const disableDeployment = ref<typeof DisableDeployment>();
const deleteDeployment = ref<typeof DeleteDeployment>();

const isOwner = computed(() =>
  isDeploymentOwner(props.envId, props.deployment.kind_id)
);

const isMaintainer = computed(() =>
  isDeploymentMaintainer(props.envId, props.deployment.kind_id)
);

const chart = computed(() =>
  store!.collections.helmCharts.getOne(props.deployment.helm_chart_id)
);

const actions = computed(() =>
  chart.value ? chartActionsSchema(chart.value) : undefined
);

const currentStatus = computed(() =>
  props.deployment.reported_status?.get_successful &&
  props.deployment.reported_status.content?.status.name
    ? props.deployment.reported_status.content.status.name
    : null
);

const filteredActions = computed(() =>
  actions.value
    ? currentStatus.value
      ? actions.value.filter((action) =>
          action.allowed_on_statuses
            ? action.allowed_on_statuses.length == 0 ||
              action.allowed_on_statuses.indexOf(currentStatus.value!) !== -1
            : true
        )
      : actions.value
    : undefined
);

const deploymentKind = computed(() =>
  store!.collections.deploymentKinds.getOne(props.deployment.kind_id)
);

const namespace = computed(() => {
  const kind = deploymentKind.value?.name.toLowerCase();
  if (!kind) {
    return undefined;
  }
  return props.deployment.name ? `${kind}-${props.deployment.name}` : kind;
});

const cluster = computed(() =>
  store!.collections.k8sClusters.getOne(props.deployment.cluster_id)
);

const logsUrl = computed(() => {
  if (!cluster.value?.grafana_url) {
    return null;
  }
  const params = new URLSearchParams();
  params.append("orgId", "1");
  params.append(
    "left",
    JSON.stringify({
      datasource: cluster.value.grafana_datasource_name || "Loki",
      queries: [
        {
          expr: `{namespace="${namespace.value}"}`,
          refId: "A",
        },
      ],
      range: { from: "now-1h", to: "now" },
    })
  );
  return `${cluster.value.grafana_url}?${params.toString()}`;
});

const router = useRouter();
function backToDeployments() {
  router.replace({
    name: "env.deployments.list",
    params: { kindId: props.deployment.kind_id },
  });
}
</script>
