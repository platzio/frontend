<template>
  <div v-if="resourceType && allResources">
    <PlatzCollection :items="allResources">
      <template #item="{ item }">
        <PlatzLinkedItem
          :to="{
            name: 'env.resources.page',
            params: { id: item.id },
          }"
        >
          <ResourceRow :resource="item" />
        </PlatzLinkedItem>
      </template>

      <template #globalActions v-if="canEdit">
        <button
          class="btn btn-primary"
          @click="editResource && editResource.open()"
        >
          <FaIcon icon="plus" fixed-width />
          Add {{ resourceType.spec.name_singular }}
        </button>
      </template>

      <template #emptyTitle>No {{ resourceType.spec.name_plural }}</template>

      <template #emptyAction v-if="canEdit">
        <button
          class="btn btn-lg btn-primary"
          @click="editResource && editResource.open()"
        >
          <FaIcon icon="plus" fixed-width />
          Add First {{ resourceType.spec.name_singular }}
        </button>
      </template>
    </PlatzCollection>
    <EditResource
      ref="editResource"
      :envId="envId"
      :resourceTypeId="resourceTypeId"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useHead } from "@vueuse/head";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzLinkedItem from "@/components/collection/PlatzLinkedItem.vue";
import { useStore } from "@/store";
import ResourceRow from "./ResourceRow.vue";
import EditResource from "./EditResource.vue";

const props = defineProps<{
  envId: string;
  resourceTypeId: string;
}>();

const store = useStore();
const editResource = ref<typeof EditResource>();

const env = computed(() => store?.collections.envs.getOne(props.envId));

const resourceType = computed(() =>
  store?.collections.deploymentResourceTypes.getOne(props.resourceTypeId)
);

// TODO: Check allowed_role
const canEdit = computed(
  () =>
    resourceType.value?.spec.lifecycle &&
    resourceType.value?.spec.lifecycle.create
);

const allResources = computed(() =>
  store?.collections.deploymentResources.all.filter(
    (resource) => resource.type_id === props.resourceTypeId
  )
);

useHead({
  title: computed(
    () =>
      `${resourceType.value?.spec.name_plural || "..."} - ${
        env.value?.name || "..."
      } - Platz`
  ),
});
</script>
