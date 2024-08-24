<template>
  <div>
    <PlatzCollection :items="envs">
      <template #item="{ item }">
        <PlatzLinkedItem
          :to="{
            name: 'admin.envs.page',
            params: { envId: item.id },
          }"
        >
          <div class="my-2 mx-1">
            <div>
              <PlatzEnv :id="item.id" />
            </div>
          </div>
        </PlatzLinkedItem>
      </template>

      <template #globalActions>
        <div class="d-flex flex-row align-items-center justify-content-end">
          <button
            class="btn btn-primary"
            @click="createEnv && createEnv.open()"
          >
            <FaIcon icon="plus" fixed-width />
            Create Env
          </button>
        </div>
      </template>

      <template #emptyTitle> No Envs </template>
      <template #emptyText>
        <button
          class="btn btn-lg btn-primary"
          @click="createEnv && createEnv.open()"
        >
          <FaIcon icon="plus" fixed-width />
          Create Env
        </button>
      </template>
    </PlatzCollection>

    <CreateEnv ref="createEnv" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useHead } from "@vueuse/head";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzLinkedItem from "@/components/collection/PlatzLinkedItem.vue";
import PlatzEnv from "@/components/PlatzEnv.vue";
import { useStore } from "@/store";
import CreateEnv from "./CreateEnv.vue";

const createEnv = ref<typeof CreateEnv>();
const store = useStore();

const envs = computed(() => store!.collections.envs.all);

useHead({
  title: "Envs - Admin - Platz",
});
</script>
