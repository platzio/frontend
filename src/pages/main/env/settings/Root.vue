<template>
  <div class="sidenav">
    <ul class="nav nav-pills flex-column">
      <li class="h5 ms-3">
        <Env :id="envId" :showInfo="false" />
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
      <li
        class="nav-item"
        v-for="collection in secretCollections"
        :key="collection"
      >
        <router-link
          class="nav-link"
          :to="{ name: 'env.settings.secrets', params: { collection } }"
        >
          {{ collection }}
        </router-link>
      </li>
    </ul>
    <div class="content">
      <router-view :envId="envId" />
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { useHead } from "@vueuse/head";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const env = computed(() => store!.collections.envs.getOne(props.envId));

    const secretCollections = computed(() =>
      Array.from(
        new Set(
          store!.collections.secrets.all.map((secret) => secret.collection)
        )
      ).sort()
    );

    useHead({
      title: computed(() => `Settings - ${env.value.name} - Platz`),
    });

    return {
      secretCollections,
    };
  },
});
</script>
