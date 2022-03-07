<template>
  <span class="badge" :class="klass">
    {{ name }}
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { Deployment, DeploymentStatus } from "@/store/models/deployment";

export default defineComponent({
  props: {
    deployment: {
      type: Object as PropType<Deployment>,
      required: true
    }
  },

  setup(props) {
    const name = computed(() => {
      if (
        props.deployment.status == DeploymentStatus.Running &&
        props.deployment.reported_status &&
        props.deployment.reported_status.content &&
        props.deployment.reported_status.content.status
      ) {
        return props.deployment.reported_status.content.status.name
          .replace(/([A-Z])/g, " $1")
          .toUpperCase();
      }
      return props.deployment.status.toUpperCase();
    });

    const color = computed(() => {
      if (
        props.deployment.status == DeploymentStatus.Running &&
        props.deployment.reported_status &&
        props.deployment.reported_status.content &&
        props.deployment.reported_status.content.status
      ) {
        return props.deployment.reported_status.content.status.color;
      }
      switch (props.deployment.status) {
        case DeploymentStatus.Running:
          return "success";
        case DeploymentStatus.Installing:
          return "light";
        case DeploymentStatus.Renaming:
        case DeploymentStatus.Upgrading:
          return "primary";
        case DeploymentStatus.Error:
          return "danger";
        case DeploymentStatus.Uninstalling:
        case DeploymentStatus.Deleting:
          return "warning";
      }
      return "light";
    });

    const klass = computed(() => {
      switch (color.value) {
        case "success":
          return "bg-success border border-success";
        case "light":
          return "text-secondary border";
        case "primary":
          return "bg-primary border border-primary";
        case "danger":
          return "bg-danger border border-danger";
        case "warning":
          return "bg-warning border border-warning text-dark";
      }
      return "bg-light bg-gradient text-dark border";
    });

    return {
      name,
      klass
    };
  }
});
</script>
