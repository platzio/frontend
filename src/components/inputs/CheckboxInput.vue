<template>
  <div class="form-check form-switch">
    <input
      class="form-check-input"
      type="checkbox"
      role="switch"
      :id="input.id"
      v-model.number="inner"
      :disabled="disabled"
      :required="input.required"
    />
    <label class="form-check-label" :for="input.id">
      {{ input.label }}
    </label>
  </div>
</template>

<script lang="ts">
import { isEqual } from "lodash";
import { defineComponent, ref, watch, PropType, watchEffect } from "vue";
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
