<template>
  <div>
    <div class="d-flex flex-row justify-content-between align-items-start">
      <div>
        <div class="h4">
          <HelmRegistry :registry="registry" />
        </div>
        <div class="mt-3 mb-2 text-muted">
          <fa icon="clock" fixed-width />
          Created
          <Moment :value="registry.created_at" />
        </div>
        <div class="my-2">
          <fa icon="tag" fixed-width />
          <span v-if="registry.category" class="ms-1">
            {{ registry.category }}
          </span>
          <span v-else class="ms-1 fst-italic"> (no category) </span>
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
          <fa icon="angle-down" fixed-width />
        </a>
        <ul class="dropdown-menu" aria-labelledby="actionsDropdown">
          <li>
            <a
              class="dropdown-item"
              @click="setIcon && setIcon.open(registry.id)"
            >
              <fa icon="crow" fixed-width />
              Set Icon
            </a>
          </li>
          <li>
            <a
              class="dropdown-item"
              @click="setCategory && setCategory.open(registry.id)"
            >
              <fa icon="tag" fixed-width />
              Set Category
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="card my-3">
    <div class="card-header">Charts</div>
    <Collection :items="charts" :flush="true">
      <template #item="scope">
        <CollectionItem>
          <div class="my-1">
            <HelmChart :chart="scope.item" />
          </div>
        </CollectionItem>
      </template>

      <template #empty-title> No Helm Charts </template>
      <template #empty-text>
        Helm charts are detected automatically when pushed to an ECR repo
      </template>
    </Collection>
  </div>

  <SetHelmRegistryIcon ref="setIcon" />
  <SetHelmRegistryCategory ref="setCategory" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "@/store";
import SetHelmRegistryIcon from "./SetHelmRegistryIcon.vue";
import SetHelmRegistryCategory from "./SetHelmRegistryCategory.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  components: {
    SetHelmRegistryIcon,
    SetHelmRegistryCategory,
  },

  setup(props) {
    const store = useStore();
    const setIcon = ref<typeof SetHelmRegistryIcon>();
    const setCategory = ref<typeof SetHelmRegistryCategory>();

    const registry = computed(() =>
      store!.collections.helmRegistries.getOne(props.id)
    );

    const charts = computed(() =>
      store!.collections.helmCharts.all.filter(
        (chart) => chart.helm_registry_id == props.id
      )
    );

    useHead({
      title: computed(
        () => `${registry.value.repo_name} - Helm Registries - Admin - Platz`
      ),
    });

    return {
      registry,
      setIcon,
      setCategory,
      charts,
    };
  },
});
</script>
