<template>
    <div v-if="config">
        <div v-if="uiSchema">
            <div v-for="input in uiSchema.inputs" :key="input.id" class="mt-2">
                <ConfigValue
                    :input="input"
                    :envId="envId"
                    :value="config[input.id]"
                    :allValues="config"
                />
            </div>
        </div>

        <div v-else>
            <YamlContent :config="config" />
        </div>
    </div>

    <div
        class="my-3"
        v-if="valuesOverride && Object.keys(valuesOverride).length"
    >
        <YamlContent header="Values Override" :config="valuesOverride" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { HelmChartUiSchema } from "@/store/chart-ext";
import YamlContent from "./YamlContent.vue";

export default defineComponent({
    props: {
        envId: {
            type: String,
            required: true,
        },
        uiSchema: {
            type: Object as PropType<HelmChartUiSchema>,
        },
        config: {
            type: Object,
        },
        valuesOverride: {
            type: Object,
        },
    },

    components: {
        YamlContent,
    },
});
</script>
