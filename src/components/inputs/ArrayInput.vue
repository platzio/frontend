<template>
  <div
    v-for="(item, idx) in inner"
    :key="idx"
    class="d-flex flex-row justify-content-between align-items-center mb-n2"
  >
    <InputField
      class="flex-fill"
      :input="itemInput(idx)"
      v-model="inner[idx]"
      :envId="envId"
      :disabled="disabled"
      :allValues="allValues"
    />
    <div class="ps-2 mb-3">
      <a class="text-secondary" @click="removeFromArray(idx)">
        <fa icon="times-circle" fixed-width />
      </a>
    </div>
  </div>
  <div class="small mb-4">
    <a class="text-primary" @click="addToArray">
      <fa icon="plus-circle" fixed-width />
      Add {{ input.label }}
    </a>
  </div>
</template>

<script lang="ts">
import { isEqual } from "lodash";
import { computed, defineComponent, ref, watch, PropType } from "vue";
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
    const inner = ref<any[]>([]);

    watch(
      () => props.modelValue,
      (newValue) => {
        if (!newValue) {
          inner.value = [];
          return;
        }
        if (isEqual(newValue, inner.value)) {
          return;
        }
        if (typeof newValue === 'string' || typeof newValue === 'number') {
          newValue = [newValue]
        }
        inner.value = newValue as any[];
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

    const addToArray = () => {
      inner.value.push({});
    };

    const removeFromArray = (idx: number) => {
      inner.value.splice(idx, 1);
    };

    const itemInput = computed(() => (idx: number) => ({
      ...props.input,
      id: `${props.input.id}-${idx}`,
      type: props.input.itemType,
    }));

    return {
      inner,
      itemInput,
      addToArray,
      removeFromArray,
    };
  },
});
</script>
