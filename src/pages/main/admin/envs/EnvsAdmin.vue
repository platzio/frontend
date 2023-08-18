<template>
    <div>
        <div v-if="parentRoute">
            <PlatzCollection :items="envs">
                <template #item="scope">
                    <PlatzLinkedItem
                        :to="{
                            name: 'admin.envs.page',
                            params: { envId: scope.item.id },
                        }"
                    >
                        <div class="my-2 mx-1">
                            <div>
                                <PlatzEnv :id="scope.item.id" />
                            </div>
                        </div>
                    </PlatzLinkedItem>
                </template>

                <template #global-actions>
                    <div
                        class="d-flex flex-row align-items-center justify-content-end"
                    >
                        <button
                            class="btn btn-primary"
                            @click="createEnv && createEnv.open()"
                        >
                            <FaIcon icon="plus" fixed-width />
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
                        <FaIcon icon="plus" fixed-width />
                        Create Env
                    </button>
                </template>
            </PlatzCollection>

            <CreateEnv ref="createEnv" />
        </div>
        <div v-else>
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@vueuse/head";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzLinkedItem from "@/components/collection/PlatzLinkedItem.vue";
import PlatzEnv from "@/components/PlatzEnv.vue";
import { useStore } from "@/store";
import CreateEnv from "./CreateEnv.vue";

export default defineComponent({
    components: {
        PlatzCollection,
        PlatzLinkedItem,
        PlatzEnv,
        CreateEnv,
    },

    setup() {
        const createEnv = ref<typeof CreateEnv>();
        const store = useStore();

        const route = useRoute();
        const parentRoute = computed(
            () => Object.keys(route.params).length == 0
        );

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
