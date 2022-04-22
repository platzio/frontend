<template>
  <div>
    <div v-if="collections.length > 0">
      <div v-for="(collection, idx) in collections" :key="collection">
        <div class="d-flex flex-row align-items-end">
          <div class="mt-0 mb-3 h4 flex-fill">
            {{ collection }}
          </div>
          <div class="float-end mb-3" v-if="idx === 0">
            <button
              class="btn btn-primary"
              @click="addSecret && addSecret.open()"
            >
              <fa icon="plus" fixed-width />
              Add Secret
            </button>
          </div>
        </div>
        <Collection :items="collectionSecrets(collection)">
          <template #item="scope">
            <CollectionItem>
              <div class="my-1">
                {{ scope.item.name }}
              </div>
              <div class="my-1 small">
                <fa icon="clock" />
                Last updated <Moment :value="scope.item.updated_at" />
              </div>
            </CollectionItem>
          </template>
        </Collection>
      </div>
    </div>

    <div v-else class="card">
      <div class="card-body text-center">
        <div class="mt-5 h2">This Env Has No Secrets</div>
        <div class="my-4 h5">
          Secrets can be used in deployments by defining them as inputs in the
          <code>values-ui.yaml</code> file
        </div>
        <div class="mb-5">
          <button
            class="btn btn-lg btn-primary"
            @click="addSecret && addSecret.open()"
          >
            <fa icon="plus" fixed-width />
            Add First Secret
          </button>
        </div>
      </div>
    </div>

    <AddSecret ref="addSecret" :envId="envId" :collections="collections" />
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { useHead } from "@vueuse/head";
import { computed, defineComponent, ref } from "vue";
import AddSecret from "./AddSecret.vue";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
  },

  components: {
    AddSecret,
  },

  setup(props) {
    const addSecret = ref<typeof AddSecret>();
    const store = useStore();

    const env = computed(() => store!.collections.envs.getOne(props.envId));

    const collections = computed(() =>
      Array.from(
        new Set(
          store!.collections.secrets
            .allForEnv(props.envId)
            .map((secret) => secret.collection)
        )
      ).sort()
    );

    const collectionSecrets = computed(
      () => (collection: string) =>
        store!.collections.secrets
          .allForEnv(props.envId)
          .filter((secret) => secret.collection === collection)
    );

    useHead({
      title: computed(() => `Secrets - Settings - ${env.value.name} - Platz`),
    });

    return {
      addSecret,
      collections,
      collectionSecrets,
    };
  },
});
</script>
