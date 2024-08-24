<template>
  <div class="card">
    <PlatzPaginatedCollection :getPage="getPage">
      <template #item="{ item }">
        <PlatzCollectionItem>
          <DeploymentTask v-if="item" :task="item" :envId="envId" />
        </PlatzCollectionItem>
      </template>
    </PlatzPaginatedCollection>
  </div>
</template>

<script setup lang="ts">
import { provide } from "vue";
import PlatzPaginatedCollection from "@/components/collection/PlatzPaginatedCollection.vue";
import PlatzCollectionItem from "@/components/collection/PlatzCollectionItem.vue";
import DeploymentTask from "../tasks/DeploymentTask.vue";
import {
  createHelmChartsCollection,
  InjectedHelmChartsCollection,
} from "@/store/models/helm-chart";
import { createDeploymentTasksCollection } from "@/store/models/deployment-task";

const props = defineProps<{
  envId: string;
  id: string;
  kind?: string;
}>();

const deploymentTasksCollection = createDeploymentTasksCollection();
const helmChartsCollection = createHelmChartsCollection();

provide(InjectedHelmChartsCollection, helmChartsCollection);

const getPage = async (page: number) => {
  const tasks = await deploymentTasksCollection.fetchPage(page, {
    deployment_id: props.id,
    per_page: 10,
  });

  const helm_chart_ids = new Set<string>();
  for (const task of tasks.items) {
    if ("Install" in task.operation) {
      helm_chart_ids.add(task.operation.Install.helm_chart_id);
    } else if ("Upgrade" in task.operation) {
      helm_chart_ids.add(task.operation.Upgrade.helm_chart_id);
      if (task.operation.Upgrade.prev_helm_chart_id) {
        helm_chart_ids.add(task.operation.Upgrade.prev_helm_chart_id);
      }
    } else if ("Reinstall" in task.operation) {
      // empty
    } else if ("Recrease" in task.operation) {
      // empty
    } else if ("Uninstall" in task.operation) {
      // empty
    } else if ("InvokeAction" in task.operation) {
      helm_chart_ids.add(task.operation.InvokeAction.helm_chart_id);
    } else if ("RestartK8sResource" in task.operation) {
      // empty
    }
  }

  await Promise.all(
    Array.from(helm_chart_ids).map((id) =>
      helmChartsCollection.readItem({ id })
    )
  );

  return tasks;
};
</script>
