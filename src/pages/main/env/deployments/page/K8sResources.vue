<template>
    <PlatzCollection :items="resources">
        <template #item="scope">
            <PlatzItemWithActions>
                <template #contents>
                    <div
                        class="my-1 fw-bold d-flex flex-row align-items-baseline"
                    >
                        <PlatzResourceStatus :id="scope.item.id" class="me-2" />
                        <div>{{ scope.item.name }}</div>
                    </div>
                    <div class="my-1 small text-secondary">
                        Kubernetes {{ scope.item.kind }} ({{
                            scope.item.api_version
                        }})
                    </div>
                </template>
                <template #actions>
                    <li>
                        <a
                            class="dropdown-item"
                            @click="restartResource(scope.item)"
                            :class="{ disabled: !isMaintainer }"
                        >
                            <FaIcon icon="sync" fixed-width />
                            Restart {{ scope.item.kind }}
                        </a>
                    </li>
                </template>
            </PlatzItemWithActions>
        </template>
    </PlatzCollection>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { K8sResource } from "@platzio/sdk";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzItemWithActions from "@/components/collection/PlatzItemWithActions.vue";
import PlatzResourceStatus from "@/components/PlatzResourceStatus.vue";
import { useStore } from "@/store";
import { isDeploymentMaintainer } from "@/store/permissions";

export default defineComponent({
    components: {
        PlatzCollection,
        PlatzItemWithActions,
        PlatzResourceStatus,
    },

    props: {
        envId: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        kind: {
            type: String,
            required: false,
        },
    },

    setup(props) {
        const store = useStore();
        const deployment = computed(() =>
            store!.collections.deployments.getOne(props.id)
        );

        const isMaintainer = computed(() =>
            isDeploymentMaintainer(props.envId, deployment.value.kind)
        );

        const resources = computed(() =>
            store!.collections.k8sResources.all
                .filter(
                    (resource) => resource.deployment_id == deployment.value.id
                )
                .filter((resource) => resource.kind != "Job")
        );

        const restartResource = async (resource: K8sResource) => {
            await store!.collections.deploymentTasks.createItem({
                deployment_id: resource.deployment_id,
                operation: {
                    RestartK8sResource: {
                        resource_id: resource.id,
                        resource_name: resource.name,
                    },
                },
            });
        };

        return {
            isMaintainer,
            resources,
            restartResource,
        };
    },
});
</script>
