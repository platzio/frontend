<template>
    <div>
        <div v-if="parentRoute">
            <PlatzCollection :items="filteredDeployments">
                <template #item="scope">
                    <PlatzLinkedItem
                        :to="{
                            name: 'env.deployments.page',
                            params: { envId, kind, id: scope.item.id },
                        }"
                        append
                    >
                        <PlatzDeployment
                            :deployment="scope.item"
                            :showPrimaryMetric="true"
                        />
                    </PlatzLinkedItem>
                </template>

                <template #global-actions>
                    <div
                        class="d-flex flex-row align-items-center justify-content-end"
                    >
                        <div class="form-check form-switch">
                            <input
                                v-if="allDisabled"
                                class="form-check-input"
                                type="checkbox"
                                id="showAll"
                                :checked="true"
                                :disabled="true"
                            />
                            <input
                                v-else
                                class="form-check-input"
                                type="checkbox"
                                id="showAll"
                                v-model="showAll"
                            />
                            <label class="form-check-label" for="showAll">
                                Show All
                            </label>
                        </div>
                        <DeploymentCollectionActions
                            :envId="envId"
                            :kind="kind"
                        />
                    </div>
                </template>

                <template #empty-title> No {{ kind }} Deployments </template>

                <template #empty-action>
                    <button
                        v-if="isOwner"
                        class="btn btn-lg btn-primary"
                        @click="
                            editDeployment && editDeployment.openForCreate(kind)
                        "
                    >
                        <FaIcon icon="plus" fixed-width />
                        Create Deployment
                    </button>
                </template>
            </PlatzCollection>
            <EditDeployment ref="editDeployment" :envId="envId" />
        </div>
        <div v-else>
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@vueuse/head";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzLinkedItem from "@/components/collection/PlatzLinkedItem.vue";
import PlatzDeployment from "@/components/PlatzDeployment.vue";
import { useStore } from "@/store";
import { isDeploymentOwner } from "@/store/permissions";
import DeploymentCollectionActions from "./DeploymentCollectionActions.vue";
import EditDeployment from "./EditDeployment.vue";

export default defineComponent({
    components: {
        PlatzCollection,
        PlatzLinkedItem,
        PlatzDeployment,
        DeploymentCollectionActions,
        EditDeployment,
    },

    props: {
        envId: {
            type: String,
            required: true,
        },
        kind: {
            type: String,
            required: true,
        },
    },

    setup(props) {
        const store = useStore();
        const editDeployment = ref<typeof EditDeployment>();
        const showAll = ref(false);

        const env = computed(() => store!.collections.envs.getOne(props.envId));

        const isOwner = computed(() =>
            isDeploymentOwner(props.envId, props.kind)
        );

        const deployments = computed(() =>
            store!.collections.deployments.all.filter(
                (deployment) =>
                    deployment.kind == props.kind &&
                    store!.collections.k8sClusters.getOne(deployment.cluster_id)
                        .env_id == props.envId
            )
        );

        const allDisabled = computed(
            () =>
                deployments.value.length > 0 &&
                deployments.value.every((deployment) => !deployment.enabled)
        );

        const filteredDeployments = computed(() =>
            deployments.value.filter(
                (deployment) =>
                    deployment.enabled || showAll.value || allDisabled.value
            )
        );

        const route = useRoute();
        const parentRoute = computed(
            () => Object.keys(route.params).length == Object.keys(props).length
        );

        useHead({
            title: computed(
                () => `${props.kind} - Deployments - ${env.value.name} - Platz`
            ),
        });

        return {
            editDeployment,
            showAll,
            isOwner,
            filteredDeployments,
            allDisabled,
            parentRoute,
        };
    },
});
</script>
