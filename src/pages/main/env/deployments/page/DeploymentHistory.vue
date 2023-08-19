<template>
    <div>
        <div v-if="tasksLoading" class="my-3 text-center text-body-secondary">
            <FaIcon icon="circle-notch" spin fixed-width />
            Loading tasks ({{ tasksLoadingPercent }}%)
        </div>

        <div
            v-else-if="chartsLoading"
            class="my-3 text-center text-body-secondary"
        >
            <FaIcon icon="circle-notch" spin fixed-width />
            Loading charts ({{ chartsLoadingPercent }}%)
        </div>

        <PlatzCollection v-else :items="tasks">
            <template #item="scope">
                <PlatzCollectionItem>
                    <DeploymentTask :task="scope.item" :envId="envId" />
                </PlatzCollectionItem>
            </template>
        </PlatzCollection>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { DeploymentTaskStatus } from "@platzio/sdk";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzCollectionItem from "@/components/collection/PlatzCollectionItem.vue";
import { useStore } from "@/store";
import DeploymentTask from "../tasks/DeploymentTask.vue";

export default defineComponent({
    components: {
        PlatzCollection,
        PlatzCollectionItem,
        DeploymentTask,
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

        onMounted(() => {
            store!.collections.deploymentTasks.setFilters({
                deployment_id: deployment.value.id,
            });
            store!.collections.helmCharts.setFilters({
                kind: deployment.value.kind,
            });
        });

        const tasksLoading = computed(
            () => store!.collections.deploymentTasks.loading
        );
        const tasksLoadingPercent = computed(
            () => store!.collections.deploymentTasks.loadingPercent
        );
        const chartsLoading = computed(
            () => store!.collections.helmCharts.loading
        );
        const chartsLoadingPercent = computed(
            () => store!.collections.helmCharts.loadingPercent
        );

        const tasks = computed(() =>
            store!.collections.deploymentTasks.all.filter(
                (task) => task.deployment_id == deployment.value.id
            )
        );

        const numPending = computed(() =>
            tasksLoading.value
                ? 0
                : tasks.value.filter(
                      (task) => task.status == DeploymentTaskStatus.Pending
                  ).length
        );

        const numRunning = computed(() =>
            tasksLoading.value
                ? 0
                : tasks.value.filter(
                      (task) => task.status == DeploymentTaskStatus.Started
                  ).length
        );

        const numFinished = computed(() =>
            tasksLoading.value
                ? 0
                : tasks.value.length - numPending.value - numRunning.value
        );

        const summary = computed(() => {
            if (tasksLoading.value) {
                return "";
            }
            let result = `${numFinished.value}`;
            if (numRunning.value) {
                result = `${result} + ${numRunning.value} running`;
            }
            if (numPending.value) {
                result = `${result} + ${numPending.value} pending`;
            }
            return result;
        });

        return {
            deployment,
            tasksLoading,
            tasksLoadingPercent,
            chartsLoading,
            chartsLoadingPercent,
            tasks,
            numPending,
            numRunning,
            numFinished,
            summary,
        };
    },
});
</script>
