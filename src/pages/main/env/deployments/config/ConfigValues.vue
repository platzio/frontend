<template>
  <div v-if="chart">
    <div v-if="chart.values_ui">
      <div v-for="input in chart.values_ui.inputs" :key="input.id" class="mt-2">
        <ConfigValue
          :input="input"
          :envId="envId"
          :value="deployment.config[input.id]"
          :allValues="deployment.config"
        />
      </div>
    </div>

    <div v-else>
      <YamlContent :config="deployment.config" />
    </div>
    <div
      class="my-3"
      v-if="
        deployment.values_override &&
        Object.keys(deployment.values_override).length
      "
    >
      <YamlContent
        header="Values Override"
        :config="deployment.values_override"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { Deployment } from "@/store/models/deployment";
import YamlContent from "./YamlContent.vue";
import { useStore } from "@/store";

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
    YamlContent,
  },

  setup(props) {
    const store = useStore();

    const chart = computed(() =>
      store!.collections.helmCharts.getOne(props.deployment.helm_chart_id)
    );

    return {
      chart,
    };
  },
});
</script>
