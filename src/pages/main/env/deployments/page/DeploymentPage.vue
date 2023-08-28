<template>
    <div>
        <div class="d-flex flex-row justify-content-between align-items-start">
            <div class="d-flex flex-row align-items-center">
                <div class="h1 me-3" v-if="formatted">
                    <FaIcon :icon="formatted.icon" />
                    {{ formatted.text }}
                </div>
                <PlatzDeploymentStatus class="me-2" :deployment="deployment" />
            </div>

            <DeploymentActions :envId="envId" :deployment="deployment" />
        </div>

        <PlatzReason
            title="Last Deployment Error Log"
            :text="deployment.reason"
            :allow-expand="true"
            :is-bad="hasError"
        />

        <ul class="my-3 lh-sm nav nav-pills">
            <li class="nav-item">
                <router-link
                    class="nav-link"
                    :to="{ name: 'env.deployments.page' }"
                    exact-active-class="active"
                >
                    Overview
                    <PlatzDeploymentWarnings :deployment="deployment" />
                </router-link>
            </li>
            <li class="nav-item">
                <router-link
                    class="nav-link"
                    :to="{ name: 'env.deployments.page.resources' }"
                >
                    Resources
                </router-link>
            </li>
            <li class="nav-item">
                <router-link
                    class="nav-link"
                    :to="{ name: 'env.deployments.page.history' }"
                >
                    History
                </router-link>
            </li>
        </ul>

        <DeploymentOverview
            v-if="parentRoute"
            :envId="envId"
            :deployment="deployment"
        />
        <router-view v-else />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { useHead } from "@vueuse/head";
import { useStore } from "@/store";
import PlatzReason from "@/components/base/PlatzReason.vue";
import PlatzDeploymentStatus from "@/components/PlatzDeploymentStatus.vue";
import PlatzDeploymentWarnings from "@/components/PlatzDeploymentWarnings.vue";
import DeploymentActions from "./DeploymentActions.vue";
import DeploymentOverview from "./DeploymentOverview.vue";
import { DeploymentStatus } from "@platzio/sdk";

export default defineComponent({
    components: {
        PlatzReason,
        PlatzDeploymentStatus,
        PlatzDeploymentWarnings,
        DeploymentActions,
        DeploymentOverview,
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
            required: true,
        },
    },

    setup(props) {
        const store = useStore();

        const route = useRoute();
        const parentRoute = computed(
            () => route.name == "env.deployments.page"
        );

        const env = computed(() => store!.collections.envs.getOne(props.envId));

        const deployment = computed(() =>
            store!.collections.deployments.getOne(props.id)
        );

        const hasError = computed(
            () => deployment.value.status == DeploymentStatus.Error
        );

        const formatted = computed(() =>
            store!.collections.deployments.formatItem(deployment.value)
        );

        onBeforeRouteUpdate((to) => {
            if (to.params.envId !== props.envId) {
                return {
                    name: "env.deployments.list",
                    params: {
                        envId: to.params.envId,
                        kind: props.kind,
                    },
                };
            }
        });

        useHead({
            title: computed(() =>
                deployment.value.name
                    ? `${deployment.value.name} - ${deployment.value.kind} - Deployments - ${env.value.name} - Platz`
                    : `${deployment.value.kind} - Deployments - ${env.value.name} - Platz`
            ),
        });

        return {
            parentRoute,
            deployment,
            hasError,
            formatted,
        };
    },
});
</script>
