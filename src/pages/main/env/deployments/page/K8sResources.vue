<template>
    <PlatzCollection :items="resources" flush>
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
import { computed, defineComponent, PropType } from "vue";
import { Deployment, K8sResource } from "@platzio/sdk";
import { useStore } from "@/store";
import { isDeploymentMaintainer } from "@/store/permissions";

export default defineComponent({
    props: {
        envId: {
            type: String,
            required: true,
        },
        deployment: {
            type: Object as PropType<Deployment>,
            required: true,
        },
    },
    setup(props) {
        const store = useStore();

        const isMaintainer = computed(() =>
            isDeploymentMaintainer(props.envId, props.deployment.kind)
        );

        const resources = computed(() =>
            store!.collections.k8sResources.all
                .filter(
                    (resource) => resource.deployment_id == props.deployment.id
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
