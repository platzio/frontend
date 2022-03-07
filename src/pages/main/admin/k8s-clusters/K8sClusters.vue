<template>
  <div>
    <div v-if="parentRoute">
      <Collection :items="allK8sClusters">
        <template #item="scope">
          <LinkedItem
            :to="{
              name: 'admin.k8s-cluster-page',
              params: { id: scope.item.id },
            }"
          >
            <ClusterRow :cluster="scope.item" />
          </LinkedItem>
        </template>

        <template #empty-title> No Kubernetes Clusters </template>
        <template #empty-text>
          Platz scans for Kubernetes clusters automatically in the same AWS
          account where it runs.
        </template>
      </Collection>
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import ClusterRow from "./ClusterRow.vue";
import { useRoute } from "vue-router";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {
    ClusterRow,
  },

  setup(props) {
    const store = useStore();
    const allK8sClusters = computed(() => store!.collections.k8sClusters.all);

    const route = useRoute();
    const parentRoute = computed(
      () => Object.keys(route.params).length == Object.keys(props).length
    );

    useHead({
      title: "Clusters - Admin - Platz",
    });

    return {
      allK8sClusters,
      parentRoute,
    };
  },
});
</script>
