<template>
    <div class="container-fluid">
        <div class="h3 fw-bold">Chart Extensions</div>
        <div class="mt-3 mb-4">
            Enter the chart extensions you'd like to add to the
            <samp>platz/</samp> directory of your chart. Then use the generated
            form to see what values would be generated for the chart.
        </div>
        <div class="row">
            <div class="col">
                <div class="form-floating">
                    <YamlInput id="uiSchema" v-model="ui_schema" />
                    <label for="uiSchema" class="form-label">
                        UI Schema (YAML)
                    </label>
                </div>
            </div>
            <div class="col">
                <div class="form-floating">
                    <input
                        id="kind"
                        class="mb-3 form-control"
                        type="text"
                        v-model="kind"
                        required
                    />
                    <label for="kind" class="form-label">
                        Deployment Kind
                    </label>
                </div>
                <div class="form-floating">
                    <YamlInput id="features" v-model="features" />
                    <label for="features" class="form-label">
                        Features (YAML)
                    </label>
                </div>
            </div>
        </div>

        <div class="mt-4 h3 fw-bold">New Deployment Form</div>
        <div class="mt-3 mb-4">
            Here you can see how the input form would behave in a new deployment
            and how the inputs are rendered to raw values before rendering
            outputs.
        </div>
        <div class="row">
            <div class="col">
                <ConfigInputsForm
                    :envId="envId"
                    :uiSchema="ui_schema"
                    v-model="rendered_inputs_new"
                    :disabled="false"
                />
            </div>
            <div class="col">
                <ConfigValues
                    :envId="envId"
                    :uiSchema="ui_schema"
                    :config="rendered_inputs_new"
                />
            </div>
        </div>

        <div class="mt-4 h3 fw-bold">Edit Deployment Form</div>
        <div class="mt-3 mb-4">
            This form is rendered based on the rendered inputs above. The
            resulting form and rendered values should be identical to the
            original form.
        </div>
        <div class="row">
            <div class="col">
                <ConfigInputsForm
                    :envId="envId"
                    :uiSchema="ui_schema"
                    v-model="rendered_inputs_edit"
                    :disabled="true"
                />
            </div>
            <div class="col">
                <ConfigValues
                    :envId="envId"
                    :uiSchema="ui_schema"
                    :config="rendered_inputs_edit"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useHead } from "@vueuse/head";
import { useStore } from "@/store";
import ConfigValues from "../deployments/config/ConfigValues.vue";
import ConfigInputsForm from "../deployments/config/ConfigInputsForm.vue";
import {
    ChartExtCardinality,
    ChartExtFeaturesV1Beta2,
    ChartExtIngressHostnameFormat,
    UiSchema,
} from "@platzio/sdk";

export default defineComponent({
    components: {
        ConfigValues,
        ConfigInputsForm,
    },

    props: {
        envId: {
            type: String,
            required: true,
        },
    },

    setup(props) {
        const store = useStore();
        const env = computed(() => store!.collections.envs.getOne(props.envId));

        useHead({
            title: computed(() => `Playground - ${env.value.name} - Platz`),
        });

        const kind = ref<string>("shop");

        const ui_schema = ref<UiSchema>({
            apiVersion: "platz.io/v1beta1",
            kind: "ValuesUi",
            inputs: [
                {
                    id: "required_num",
                    type: "number",
                    label: "Required num",
                    minimum: "0",
                    required: true,
                    initialValue: 600,
                },
                {
                    id: "required_bool",
                    type: "Checkbox",
                    label: "Required bool",
                    initialValue: true,
                },
                {
                    id: "optional_bool",
                    type: "Checkbox",
                    label: "Optional bool",
                },
                {
                    id: "required_text",
                    type: "text",
                    label: "Required text",
                    required: true,
                    initialValue: "Hello 👋",
                },
                {
                    id: "array_of_text",
                    type: "array",
                    itemType: "text",
                    label: "Array of text",
                },
                {
                    id: "optional_text",
                    type: "text",
                    label: "Optional text",
                },
                {
                    id: "optional_deployment",
                    label: "Optional Deployment",
                    type: "CollectionSelect",
                    collection: "deployments",
                },
                {
                    id: "required_deployment",
                    label: "Required Deployment",
                    type: "CollectionSelect",
                    collection: "deployments",
                    required: true,
                },
                {
                    id: "optional_secret",
                    label: "Optional Secret",
                    type: "CollectionSelect",
                    collection: "secrets",
                },
                {
                    id: "required_secret",
                    label: "Required Secret",
                    type: "CollectionSelect",
                    collection: "secrets",
                    required: true,
                },
            ],
            outputs: {
                values: [
                    {
                        path: ["config", "required_num"],
                        value: {
                            FieldValue: {
                                input: "required_num",
                            },
                        },
                    },
                    {
                        path: ["config", "required_bool"],
                        value: {
                            FieldValue: {
                                input: "required_bool",
                            },
                        },
                    },
                    {
                        path: ["config", "required_text"],
                        value: {
                            FieldValue: {
                                input: "required_text",
                            },
                        },
                    },
                    {
                        path: ["config", "array_of_text"],
                        value: {
                            FieldValue: {
                                input: "array_of_text",
                            },
                        },
                    },
                    {
                        path: ["config", "optional_bool"],
                        value: {
                            FieldValue: {
                                input: "optional_bool",
                            },
                        },
                    },
                    {
                        path: ["config", "optional_deployment", "name"],
                        value: {
                            FieldProperty: {
                                input: "optional_deployment",
                                property: "name",
                            },
                        },
                    },
                    {
                        path: ["config", "required_deployment", "name"],
                        value: {
                            FieldProperty: {
                                input: "required_deployment",
                                property: "name",
                            },
                        },
                    },
                    {
                        path: ["config", "optional_secret", "contents"],
                        value: {
                            FieldProperty: {
                                input: "optional_secret",
                                property: "contents",
                            },
                        },
                    },
                    {
                        path: ["config", "required_secret", "contents"],
                        value: {
                            FieldProperty: {
                                input: "required_secret",
                                property: "contents",
                            },
                        },
                    },
                ],
                secrets: {},
            },
        });

        const features = ref<ChartExtFeaturesV1Beta2>({
            apiVersion: "platz.io/v1beta2",
            kind: "Features",
            spec: {
                ingress: {
                    enabled: true,
                    hostname_format: ChartExtIngressHostnameFormat.KindAndName,
                },
                cardinality: ChartExtCardinality.Many,
                reinstall_dependencies: false,
                node_selector_paths: [],
                tolerations_paths: [],
                display: {
                    icon: {
                        font_awesome: "shop",
                    },
                },
            },
        });

        const rendered_inputs_new = ref({});
        const rendered_inputs_edit = ref({});

        watch(
            rendered_inputs_new,
            () => {
                rendered_inputs_edit.value = rendered_inputs_new.value;
            },
            { immediate: true, deep: true }
        );

        return {
            kind,
            ui_schema,
            features,
            rendered_inputs_new,
            rendered_inputs_edit,
        };
    },
});
</script>
