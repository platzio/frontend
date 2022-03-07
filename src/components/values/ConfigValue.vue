<template>
  <div v-if="shouldDisplay || showEmpty">
    <ArrayValue
      v-if="input.type === 'array'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <PlainValue
      v-else-if="input.type === 'text'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <PlainValue
      v-else-if="input.type === 'number'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <CheckboxValue
      v-else-if="input.type === 'Checkbox'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <CollectionValue
      v-else-if="input.type === 'CollectionSelect'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <RadioValue
      v-else-if="input.type === 'RadioSelect'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <DaysHourValue
      v-else-if="input.type === 'DaysAndHour'"
      :input="input"
      :value="value"
      :showLabel="showLabel"
      :showEmpty="showEmpty"
    />
    <div v-else>
      <span class="text-secondary me-2">{{ input.label }}:</span>
      <span class="text-danger">
        <fa icon="exclamation-triangle" /> I don't know how to render
        {{ input.type }}
        fields
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { HelmChartUiInput } from "@/store/models/helm-chart";

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<HelmChartUiInput>,
      required: true,
    },
    value: {
      required: true,
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
    const shouldDisplay = computed(
      () =>
        !props.input.showIfAll ||
        props.input.showIfAll.every(
          (fv) => props.allValues[fv.field] === fv.value
        )
    );
    return {
      shouldDisplay,
    };
  },
});
</script>
