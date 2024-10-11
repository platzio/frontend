<template>
  <div>
    <div v-if="collections.length > 0">
      <div
        v-for="(collection, idx) in collections"
        :key="collection"
        class="mb-5"
      >
        <div class="d-flex flex-row align-items-end">
          <div class="mt-0 mb-3 h4 flex-fill">
            {{ collection }}
          </div>
          <div v-if="idx === 0" class="float-end mb-4">
            <button
              class="btn btn-primary"
              @click="addSecret && addSecret.open()"
            >
              <FaIcon icon="plus" fixed-width />
              Add Secret
            </button>
          </div>
        </div>

        <PlatzCollection :items="collectionSecrets(collection)">
          <template #item="{ item }">
            <PlatzItemWithActions>
              <template #contents>
                <div class="my-1">
                  {{ item.name }}
                </div>
                <div class="my-1 small">
                  <FaIcon icon="clock" />
                  Last updated
                  <PlatzMoment :value="item.updated_at" />
                </div>
              </template>
              <template #actions>
                <li>
                  <a class="dropdown-item" @click="renameSecret?.open(item)">
                    <FaIcon icon="id-card" fixed-width />
                    Rename Secret
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    @click="changeSecretContents?.open(item)"
                  >
                    <FaIcon icon="pencil" fixed-width />
                    Change Secret Contents
                  </a>
                </li>
                <li class="dropdown-divider" />
                <li>
                  <a class="dropdown-item" @click="deleteSecret?.open(item)">
                    <FaIcon icon="trash-can" fixed-width />
                    Delete Secret
                  </a>
                </li>
              </template>
            </PlatzItemWithActions>
          </template>
        </PlatzCollection>
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
            <FaIcon icon="plus" fixed-width />
            Add First Secret
          </button>
        </div>
      </div>
    </div>

    <AddSecret ref="addSecret" :env-id="envId" :collections="collections" />
    <RenameSecret ref="renameSecret" :env-id="envId" />
    <ChangeSecretContents ref="changeSecretContents" :env-id="envId" />
    <DeleteSecret ref="deleteSecret" :env-id="envId" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useHead } from "@vueuse/head";
import PlatzMoment from "@/components/base/PlatzMoment.vue";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzItemWithActions from "@/components/collection/PlatzItemWithActions.vue";
import { useStore } from "@/store";
import AddSecret from "./AddSecret.vue";
import RenameSecret from "./RenameSecret.vue";
import ChangeSecretContents from "./ChangeSecretContents.vue";
import DeleteSecret from "./DeleteSecret.vue";

const props = defineProps<{
  envId: string;
}>();

const addSecret = ref<typeof AddSecret>();
const renameSecret = ref<typeof RenameSecret>();
const changeSecretContents = ref<typeof ChangeSecretContents>();
const deleteSecret = ref<typeof DeleteSecret>();
const store = useStore();

const env = computed(() => store?.collections.envs.getOne(props.envId));

const collections = computed(() =>
  Array.from(
    new Set(
      store?.collections.secrets
        .allForEnv(props.envId)
        .map((secret) => secret.collection)
    )
  ).sort()
);

const collectionSecrets = computed(
  () => (collection: string) =>
    store?.collections.secrets
      .allForEnv(props.envId)
      .filter((secret) => secret.collection === collection) || []
);

useHead({
  title: computed(
    () => `Secrets - Settings - ${env.value?.name || "..."} - Platz`
  ),
});
</script>
