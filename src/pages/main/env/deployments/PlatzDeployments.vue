<template>
  <div class="sidenav">
    <ul class="nav nav-pills flex-column">
      <div class="form-check form-switch">
        <input
            class="form-check-input"
            type="checkbox"
            id="showAll"
            v-model="showAll"
        />
        <label class="form-check-label" for="showAll">
            Show All
        </label>
      </div>      
      <li class="nav-item" v-for="kind in filteredDeploymentsKinds" :key="kind">
        <router-link
          class="nav-link"
          :to="{
            name: 'env.deployments.list',
            params: { kind },
          }"
        >
          {{ kind }}
        </router-link>
      </li>
    </ul>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "@/store";
import { allKinds } from "@/store/models/helm-registry";
import { useHead } from "@vueuse/head";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const showAll = ref(false);
    const env = computed(() => store!.collections.envs.getOne(props.envId));

    const filteredDeploymentsKinds = computed(() => {
        if (showAll.value) {
          return allKinds()
        }
        else {
          return allKinds().filter(
            (deploymentKind) =>
              store!.collections.deployments.allForEnv(props.envId).find(((deployment) => deployment.kind == deploymentKind && deployment.enabled))
          )
        }
      }
    );

    useHead({
      title: computed(() => `Deployments - ${env.value.name} - Platz`),
    });

    return {
      showAll,
      filteredDeploymentsKinds
    };
  },
});
</script>
