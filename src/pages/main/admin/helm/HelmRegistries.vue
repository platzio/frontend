<template>
  <PlatzCollection :items="allHelmRegistries">
    <template #item="{ item }">
      <PlatzLinkedItem
        :to="{
          name: 'admin.helm-registry-page',
          params: { id: item.id },
        }"
      >
        <div class="my-1">
          <PlatzHelmRegistry :registry="item" />
        </div>
      </PlatzLinkedItem>
    </template>

    <template #emptyTitle> No Helm Registries </template>
    <template #emptyText>
      Helm registries are created automatically when a new Helm chart is
      detected, there's nothing you have to do to make them appear here.
    </template>
  </PlatzCollection>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHead } from "@vueuse/head";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzLinkedItem from "@/components/collection/PlatzLinkedItem.vue";
import PlatzHelmRegistry from "@/components/PlatzHelmRegistry.vue";
import { useStore } from "@/store";

const store = useStore();

const allHelmRegistries = computed(() => store!.collections.helmRegistries.all);

useHead({
  title: "Helm Registries - Admin - Platz",
});
</script>
