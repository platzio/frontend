<template>
  <div v-if="visible" class="mb-3">
    <ArrayInput
      v-if="input.type === 'array'"
      :input="input"
      v-model="inner"
      :envId="envId"
      :disabled="disabled"
      :allValues="allValues"
    />
    <CheckboxInput
      v-else-if="input.type === 'Checkbox'"
      :input="input"
      v-model="inner"
      :envId="envId"
      :disabled="disabled"
      :allValues="allValues"
    />
    <CollectionInput
      v-else-if="input.type === 'CollectionSelect'"
      :input="input"
      v-model="inner"
      :envId="envId"
      :disabled="disabled"
      :allValues="allValues"
    />
    <DaysHourInput
      v-else-if="input.type === 'DaysAndHour'"
      :input="input"
      v-model="inner"
      :envId="envId"
      :disabled="disabled"
      :allValues="allValues"
    />
    <NumberInput
      v-else-if="input.type === 'number'"
      :input="input"
      v-model="inner"
      :envId="envId"
      :disabled="disabled"
      :allValues="allValues"
    />
    <RadioInput
      v-else-if="input.type === 'RadioSelect'"
      :input="input"
      v-model="inner"
      :envId="envId"
      :disabled="disabled"
      :allValues="allValues"
    />
    <TextInput
      v-else-if="input.type === 'text'"
      :input="input"
      v-model="inner"
      :envId="envId"
      :disabled="disabled"
      :allValues="allValues"
    />
    <div class="alert alert-warning mb-3" v-else>
      Oh no, I don't know how to render this: {{ input }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType, watch } from "vue";
import { HelmChartUiInput } from "@/store/models/helm-chart";
import { isEqual } from "lodash";

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
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {},
    allValues: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const inner = ref();

    watch(
      () => props.modelValue,
      (newvalue, oldvalue) => {
        if (isEqual(newvalue, oldvalue)) {
          return;
        }
        inner.value = newvalue;
      },
      { immediate: true, deep: true }
    );

    watch(
      () => inner,
      () => {
        emit("update:modelValue", inner.value);
      },
      { deep: true }
    );

    const visible = computed(
      () =>
        !props.input.showIfAll ||
        props.input.showIfAll.every(
          (fv) => props.allValues[fv.field] === fv.value
        )
    );

    return {
      visible,
      inner,
    };
  },
});
</script>
