<template>
  <pre class="mt-0 mb-2 small text-muted" v-if="body">{{ body }}</pre>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import yaml from "js-yaml";
import { isEqual } from "lodash";
import { DeploymentInvokeActionTask } from "@/store/models/deployment-task";

export default defineComponent({
  props: {
    operation: {
      type: Object as PropType<DeploymentInvokeActionTask>,
      required: true
    }
  },

  setup(props) {
    const body = computed(() =>
      isEqual(props.operation.body, {}) ? null : yaml.dump(props.operation.body)
    );

    return {
      body
    };
  }
});
</script>
