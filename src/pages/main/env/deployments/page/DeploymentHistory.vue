<template>
    <div>
        <div v-if="tasksLoading" class="my-3 text-center text-muted">
            <FaIcon icon="circle-notch" spin fixed-width />
            Loading tasks ({{ tasksLoadingPercent }}%)
        </div>

        <div v-else-if="chartsLoading" class="my-3 text-center text-muted">
            <FaIcon icon="circle-notch" spin fixed-width />
            Loading charts ({{ chartsLoadingPercent }}%)
        </div>

        <PlatzCollection v-else :items="tasks" flush>
            <template #item="scope">
                <PlatzCollectionItem>
                    <DeploymentTask :task="scope.item" :envId="envId" />
                </PlatzCollectionItem>
            </template>
        </PlatzCollection>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType } from "vue";
import { Deployment, DeploymentTaskStatus } from "@platzio/sdk";
import { useStore } from "@/store";
import DeploymentTask from "../tasks/DeploymentTask.vue";

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

    components: {
        DeploymentTask,
    },

    setup(props) {
        const store = useStore();

        onMounted(() => {
            store!.collections.deploymentTasks.setFilters({
                deployment_id: props.deployment.id,
            });
            store!.collections.helmCharts.setFilters({
                kind: props.deployment.kind,
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
                (task) => task.deployment_id == props.deployment.id
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
