<template>
  <div class="sidenav">
    <ul class="nav nav-pills flex-column">
      <li class="nav-item" v-for="kind in deploymentKinds" :key="kind">
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
import { computed, defineComponent } from "vue";
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
    const deploymentKinds = computed(allKinds);
    const env = computed(() => store!.collections.envs.getOne(props.envId));

    useHead({
      title: computed(() => `Deployments - ${env.value.name} - Platz`),
    });

    return {
      deploymentKinds,
    };
  },
});
</script>
