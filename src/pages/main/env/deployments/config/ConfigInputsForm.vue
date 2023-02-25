<template>
    <div v-if="uiSchema">
        <InputField
            :input="input"
            v-for="input in uiSchema.inputs"
            :key="input.id"
            v-model="allValues[input.id]"
            :envId="envId"
            :disabled="disabled"
            :allValues="allValues"
            :isNew="isNew"
        />
    </div>
</template>

<script lang="ts">
import { cloneDeep, isEqual } from "lodash";
import { defineComponent, watch, reactive, PropType } from "vue";
import { HelmChartUiSchema } from "@/store/chart-ext";

export default defineComponent({
    props: {
        envId: {
            type: String,
            required: true,
        },
        uiSchema: {
            type: Object as PropType<HelmChartUiSchema | undefined>,
            required: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: Object,
            default: () => ({}),
        },
        isNew: {
            type: Boolean,
            default: true,
        },
    },

    emits: ["update:modelValue"],

    setup(props, { emit }) {
        const allValues = reactive<Record<string, any>>({});

        watch(
            () => props.modelValue,
            (oldvalue, newvalue) => {
                if (isEqual(oldvalue, newvalue)) {
                    return;
                }
                Object.assign(allValues, cloneDeep(props.modelValue));
            },
            { immediate: true, deep: true }
        );

        watch(
            () => props.uiSchema,
            () => {
                if (!props.uiSchema) {
                    return;
                }
                for (const input of props.uiSchema.inputs) {
                    if (
                        input.initialValue !== undefined &&
                        allValues[input.id] === undefined
                    ) {
                        allValues[input.id] = input.initialValue;
                    }
                }
            },
            { immediate: true }
        );

        watch(
            allValues,
            () => {
                emit("update:modelValue", allValues);
            },
            { deep: true }
        );

        return {
            allValues,
        };
    },
});
</script>
