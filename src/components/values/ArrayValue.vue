<template>
  <div v-if="(value && value.length) || showEmpty">
    <div class="text-secondary" v-if="showLabel && input.label">
      {{ input.label }}
    </div>
    <ul class="array-value-list" v-if="value">
      <li v-for="(item, idx) in value" :key="idx">
        <ConfigValue
          :input="innerInput"
          :envId="envId"
          :value="item"
          :allValues="allValues"
        />
      </li>
    </ul>
    <span class="text-secondary fst-italic" v-else>(empty)</span>
  </div>
</template>

<style lang="scss" scoped>
ul.array-value-list {
  margin: 0;
  padding-left: 1.25rem;

  li {
    margin: 0;
    padding: 0;
  }
}
</style>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { HelmChartUiInput } from "@/store/models/helm-chart";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
    input: {
      type: Object as PropType<HelmChartUiInput>,
      required: true,
    },
    value: {
      type: Array,
    },
    allValues: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    showEmpty: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const innerInput = computed(() => ({
      ...props.input,
      type: props.input.itemType,
      label: undefined,
    }));

    return {
      innerInput,
    };
  },
});
</script>
