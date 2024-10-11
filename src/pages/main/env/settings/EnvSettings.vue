<template>
  <div class="sidenav">
    <ul class="nav nav-pills flex-column">
      <li class="h5 ms-3">
        <PlatzEnv :id="envId" :show-info="false" />
      </li>
      <li class="nav-heading">Permissions</li>
      <li class="nav-item">
        <router-link
          class="nav-link"
          :to="{ name: 'env.settings.deployment-permissions' }"
        >
          Deployments
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'env.settings.user-roles' }">
          Users
        </router-link>
      </li>
      <li class="nav-heading">Secrets</li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'env.settings.secrets' }">
          Manage Secrets
        </router-link>
      </li>
    </ul>
    <div class="content">
      <router-view :env-id="envId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHead } from "@vueuse/head";
import { useStore } from "@/store";
import PlatzEnv from "@/components/PlatzEnv.vue";

const props = defineProps<{
  envId: string;
}>();

const store = useStore();
const env = computed(() => store?.collections.envs.getOne(props.envId));

useHead({
  title: computed(() => `Settings - ${env.value?.name || "..."} - Platz`),
});
</script>
