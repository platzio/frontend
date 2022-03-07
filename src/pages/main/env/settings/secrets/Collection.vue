<template>
  <div>
    <Collection :items="secrets">
      <template #item="scope">
        <CollectionItem>
          <div class="my-2 fw-bold">
            {{ scope.item.name }}
          </div>
          <div class="my-2 text-muted">
            <fa icon="clock" />
            Last updated <Moment :value="scope.item.updated_at" />
          </div>
        </CollectionItem>
      </template>

      <template #global-actions>
        <div class="d-flex flex-row align-items-center justify-content-between">
          <div class="h4">
            {{ collection }}
          </div>
          <div>
            <button
              class="btn btn-primary"
              @click="addSecret && addSecret.open()"
            >
              <fa icon="plus" fixed-width />
              Add Secret
            </button>
          </div>
        </div>
      </template>
    </Collection>

    <AddSecret ref="addSecret" :envId="envId" :collection="collection" />
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
    collection: {
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

    const secrets = computed(() =>
      store!.collections.secrets
        .allForEnv(props.envId)
        .filter((secret) => secret.collection === props.collection)
    );

    useHead({
      title: computed(
        () =>
          `${props.collection} - Secrets - Settings - ${env.value.name} - Platz`
      ),
    });

    return {
      addSecret,
      secrets,
    };
  },
});
</script>
