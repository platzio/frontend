<template>
  <div v-if="registry">
    <div class="d-flex flex-row justify-content-between align-items-start">
      <div>
        <div class="h4">
          <PlatzHelmRegistry :registry="registry" />
        </div>
        <div class="mt-3 mb-2 text-body-secondary">
          <FaIcon icon="clock" fixed-width />
          Created
          <PlatzMoment :value="registry.created_at" />
        </div>
      </div>

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
          <li>
            <a
              class="dropdown-item"
              @click="setIcon && setIcon.open(registry.id)"
            >
              <FaIcon icon="crow" fixed-width />
              Set Icon
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="card my-3">
    <div class="pt-3 pb-0 h5 card-header border-bottom-0">Helm Charts</div>
    <PlatzPaginatedCollection :getPage="getPage">
      <template #item="{ item }">
        <PlatzCollectionItem>
          <div class="my-1" v-if="item">
            <PlatzHelmChart :chart="item" />
          </div>
        </PlatzCollectionItem>
      </template>

      <template #emptyTitle>No Helm Charts</template>
      <template #emptyText>
        Helm charts are detected automatically when pushed to an ECR repo
      </template>
    </PlatzPaginatedCollection>
  </div>

  <SetHelmRegistryIcon ref="setIcon" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useHead } from "@vueuse/head";
import PlatzMoment from "@/components/base/PlatzMoment.vue";
import PlatzPaginatedCollection from "@/components/collection/PlatzPaginatedCollection.vue";
import PlatzCollectionItem from "@/components/collection/PlatzCollectionItem.vue";
import PlatzHelmRegistry from "@/components/PlatzHelmRegistry.vue";
import PlatzHelmChart from "@/components/PlatzHelmChart.vue";
import { useStore } from "@/store";
import SetHelmRegistryIcon from "./SetHelmRegistryIcon.vue";
import { createHelmChartsCollection } from "@/store/models/helm-chart";

const props = defineProps<{
  id: string;
}>();

const store = useStore();
const setIcon = ref<typeof SetHelmRegistryIcon>();
const helmChartsCollection = createHelmChartsCollection();

const registry = computed(() =>
  store!.collections.helmRegistries.getOne(props.id)
);

const getPage = async (page: number) =>
  await helmChartsCollection.fetchPage(page, {
    helm_registry_id: props.id,
  });

useHead({
  title: computed(
    () =>
      `${registry.value?.repo_name || "..."} - Helm Registries - Admin - Platz`
  ),
});
</script>
