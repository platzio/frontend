<template>
  <PlatzCollection :items="allK8sClusters">
    <template #item="{ item }">
      <PlatzLinkedItem
        :to="{
          name: 'admin.k8s-cluster-page',
          params: { id: item.id },
        }"
      >
        <ClusterRow :cluster="item" />
      </PlatzLinkedItem>
    </template>

    <template #emptyTitle> No Kubernetes Clusters </template>
    <template #emptyText>
      Platz scans for Kubernetes clusters automatically in the same AWS account
      where it runs.
    </template>
  </PlatzCollection>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHead } from "@vueuse/head";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzLinkedItem from "@/components/collection/PlatzLinkedItem.vue";
import { useStore } from "@/store";
import ClusterRow from "./ClusterRow.vue";

const store = useStore();
const allK8sClusters = computed(() => store!.collections.k8sClusters.all);

useHead({
  title: "Clusters - Admin - Platz",
});
</script>
