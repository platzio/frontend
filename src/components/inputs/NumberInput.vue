<template>
  <div class="form-floating">
    <input
      type="number"
      :step="input.step || 0.0000000000001"
      class="form-control"
      :id="input.id"
      v-model.number="inner"
      :disabled="disabled"
      :required="input.required"
      :min="input.minimum"
      :max="input.maximum"
    />
    <label class="opacity-100">
      <span class="opacity-50">{{ input.label }}</span>
      <span class="ms-2 text-danger" v-if="input.required">*</span>
    </label>
    <div class="form-text" v-if="input.helpText">
      {{ input.helpText }}
    </div>
  </div>
</template>

<script lang="ts">
import { isEqual } from "lodash";
import { defineComponent, ref, watch, watchEffect, PropType } from "vue";
import { HelmChartUiInput } from "@/store/chart-ext";

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
      (newValue) => {
        if (isEqual(newValue, inner.value)) {
          return;
        }
        inner.value = newValue;
      },
      { immediate: true, deep: true }
    );

    watchEffect(() => {
      emit("update:modelValue", inner.value);
    });

    return {
      inner,
    };
  },
});
</script>
