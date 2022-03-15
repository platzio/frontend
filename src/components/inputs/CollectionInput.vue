<template>
  <div class="form-floating">
    <template v-if="collection">
      <select
        class="form-select"
        :id="input.id"
        v-model="inner"
        :disabled="disabled"
        :required="input.required"
      >
        <option v-for="item in collectionItems" :key="item.id" :value="item.id">
          {{ collection ? collection.formatItem(item).text : item }}
        </option>
      </select>
      <label class="opacity-100">
        <span class="opacity-50">{{ input.label }}</span>
        <span class="ms-2 text-danger" v-if="input.required">*</span>
      </label>
    </template>
    <div v-else class="small alert alert-warning">
      <div class="mb-1 fw-bold">
        <fa icon="exclamation-triangle" fixed-width />
        Can't Render This Field
      </div>
      <div>
        This chart required an input from an unknown collection named "{{
          input.collection
        }}".
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { isEqual } from "lodash";
import {
  computed,
  defineComponent,
  ref,
  watch,
  watchEffect,
  PropType,
} from "vue";
import { useStore } from "@/store";
import { TableName } from "@/store/collections";
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
    const store = useStore();
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

    const collection = computed(() =>
      props.input.collection
        ? store!.tableNameToCollection(props.input.collection as TableName)
        : null
    );

    const collectionItems = computed(() => {
      if (!collection.value) {
        return [];
      }
      if (!props.input.filters) {
        return collection.value.allForEnv(props.envId);
      }
      return (collection.value.allForEnv(props.envId) as any[]).filter((item) =>
        props.input.filters!.every((fv) => item[fv.field] == fv.value)
      );
    });

    return {
      collection,
      collectionItems,
      inner,
    };
  },
});
</script>