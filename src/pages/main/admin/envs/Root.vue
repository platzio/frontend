<template>
  <div>
    <div v-if="parentRoute">
      <Collection :items="envs">
        <template #item="scope">
          <LinkedItem
            :to="{
              name: 'admin.envs.page',
              params: { envId: scope.item.id },
            }"
          >
            <div class="my-2 mx-1">
              <div>
                <Env :id="scope.item.id" />
              </div>
            </div>
          </LinkedItem>
        </template>

        <template #global-actions>
          <div class="d-flex flex-row align-items-center justify-content-end">
            <button
              class="btn btn-primary"
              @click="createEnv && createEnv.open()"
            >
              <fa icon="plus" fixed-width />
              Create Env
            </button>
          </div>
        </template>

        <template #empty-title> No Envs </template>
        <template #empty-text>
          <button
            class="btn btn-lg btn-primary"
            @click="createEnv && createEnv.open()"
          >
            <fa icon="plus" fixed-width />
            Create Env
          </button>
        </template>
      </Collection>

      <CreateEnv ref="createEnv" />
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "@/store";
import CreateEnv from "./CreateEnv.vue";
import { useHead } from "@vueuse/head";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    CreateEnv,
  },

  setup() {
    const createEnv = ref<typeof CreateEnv>();
    const store = useStore();

    const route = useRoute();
    const parentRoute = computed(() => Object.keys(route.params).length == 0);

    const envs = computed(() => store!.collections.envs.all);

    useHead({
      title: "Envs - Admin - Platz",
    });

    return {
      parentRoute,
      envs,
      createEnv,
    };
  },
});
</script>
