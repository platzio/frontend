<template>
  <div
    class="my-1 small d-flex flex-row align-items-center justify-context-start"
    v-for="(changes, key) in delta || {}"
    :key="key"
  >
    <ConfigValue
      :input="inputFor(key)"
      :value="changes[0]"
      :allValues="allValues"
      :envId="envId"
      :showLabel="true"
      :showEmpty="true"
    />
    <span class="mx-2 small opacity50"><fa icon="arrow-right" /></span>
    <ConfigValue
      :input="inputFor(key)"
      :value="changes[1]"
      :allValues="allValues"
      :envId="envId"
      :showLabel="false"
      :showEmpty="true"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { HelmChartUiSchema } from "@/store/chart-ext";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
    uiSchema: {
      type: Object as PropType<HelmChartUiSchema>,
      required: true,
    },
    delta: {
      type: Object as PropType<Record<string, any[]>>,
      required: true,
    },
    allValues: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },

  setup(props) {
    const inputFor = computed(() => (id: string) => {
      for (const input of props.uiSchema.inputs || []) {
        if (input.id === id) {
          return input;
        }
      }
      return null;
    });

    return {
      inputFor,
    };
  },
});
</script>
