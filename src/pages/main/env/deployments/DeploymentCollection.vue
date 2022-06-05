<template>
  <div>
    <div v-if="parentRoute">
      <Collection :items="filteredDeployments">
        <template #item="scope">
          <LinkedItem
            :to="{
              name: 'env.deployments.page',
              params: { envId, kind, id: scope.item.id },
            }"
            append
          >
            <Deployment :deployment="scope.item" :showPrimaryMetric="true" />
          </LinkedItem>
        </template>

        <template #global-actions>
          <div class="d-flex flex-row align-items-center justify-content-end">
            <div class="form-check form-switch">
              <input
                v-if="allDisabled"
                class="form-check-input"
                type="checkbox"
                id="showAll"
                :checked="true"
                :disabled="true"
              />
              <input
                v-else
                class="form-check-input"
                type="checkbox"
                id="showAll"
                v-model="showAll"
              />
              <label class="form-check-label" for="showAll"> Show All </label>
            </div>
            <button
              v-if="isOwner"
              class="ms-4 btn btn-primary"
              @click="editDeployment && editDeployment.openForCreate(kind)"
            >
              <fa icon="plus" fixed-width />
              Create Deployment
            </button>
          </div>
        </template>

        <template #empty-title> No {{ kind }} Deployments </template>

        <template #empty-action>
          <button
            v-if="isOwner"
            class="btn btn-lg btn-primary"
            @click="editDeployment && editDeployment.openForCreate(kind)"
          >
            <fa icon="plus" fixed-width />
            Create Deployment
          </button>
        </template>
      </Collection>
      <EditDeployment ref="editDeployment" :envId="envId" />
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { isDeploymentOwner } from "@/store/permissions";
import EditDeployment from "./EditDeployment.vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {
    EditDeployment,
  },

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

  setup(props) {
    const store = useStore();
    const editDeployment = ref<typeof EditDeployment>();
    const showAll = ref(false);

    const env = computed(() => store!.collections.envs.getOne(props.envId));

    const isOwner = computed(() => isDeploymentOwner(props.envId, props.kind));

    const deployments = computed(() =>
      store!.collections.deployments.all.filter(
        (deployment) =>
          deployment.kind == props.kind &&
          store!.collections.k8sClusters.getOne(deployment.cluster_id).env_id == props.envId
      )
    );

    const allDisabled = computed(
      () =>
        deployments.value.length > 0 && deployments.value.every((deployment) => !deployment.enabled)
    );

    const filteredDeployments = computed(() =>
      deployments.value.filter(
        (deployment) => deployment.enabled || showAll.value || allDisabled.value
      )
    );

    const route = useRoute();
    const parentRoute = computed(
      () => Object.keys(route.params).length == Object.keys(props).length
    );

    useHead({
      title: computed(() => `${props.kind} - Deployments - ${env.value.name} - Platz`),
    });

    return {
      editDeployment,
      showAll,
      isOwner,
      filteredDeployments,
      allDisabled,
      parentRoute,
    };
  },
});
</script>
