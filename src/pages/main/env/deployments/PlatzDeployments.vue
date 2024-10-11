<template>
  <div class="sidenav">
    <ul class="nav nav-pills flex-column">
      <div class="form-check form-switch">
        <input
          id="showAll"
          v-model="showAll"
          class="form-check-input"
          type="checkbox"
        />
        <label class="form-check-label" for="showAll">Show All</label>
      </div>
      <li
        v-for="kind in filteredDeploymentsKinds"
        :key="kind.id"
        class="nav-item"
      >
        <router-link
          class="nav-link"
          :to="{
            name: 'env.deployments.list',
            params: { kindId: kind.id },
          }"
        >
          {{ kind.name }}
        </router-link>
      </li>
    </ul>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/store";
import { useHead } from "@vueuse/head";

const props = defineProps<{
  envId: string;
}>();

const store = useStore();
const showAll = ref(false);
const env = computed(() => store?.collections.envs.getOne(props.envId));

const enabled_env_deployments = computed(() =>
  store?.collections.deployments
    .allForEnv(props.envId)
    .filter((deployment) => deployment.enabled)
);

const filteredDeploymentsKinds = computed(() =>
  showAll.value
    ? store?.collections.deploymentKinds.all
    : store?.collections.deploymentKinds.all.filter((kind) =>
        enabled_env_deployments.value?.find(
          (deployment) => deployment.kind_id == kind.id
        )
      )
);

useHead({
  title: computed(() => `Deployments - ${env.value?.name || "..."} - Platz`),
});
</script>
