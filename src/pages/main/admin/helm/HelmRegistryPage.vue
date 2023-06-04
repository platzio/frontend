<template>
    <div>
        <div class="d-flex flex-row justify-content-between align-items-start">
            <div>
                <div class="h4">
                    <PlatzHelmRegistry :registry="registry" />
                </div>
                <div class="mt-3 mb-2 text-muted">
                    <FaIcon icon="clock" fixed-width />
                    Created
                    <PlatzMoment :value="registry.created_at" />
                </div>
            </div>

            <div class="dropdown">
                <a
                    class="btn btn-outline-primary"
                    href="#"
                    role="button"
                    id="actionsDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Actions
                    <FaIcon icon="angle-down" fixed-width />
                </a>
                <ul class="dropdown-menu" aria-labelledby="actionsDropdown">
                    <li>
                        <a
                            class="dropdown-item"
                            @click="setIcon && setIcon.open(registry.id)"
                        >
                            <FaIcon icon="crow" fixed-width />
                            Set Icon
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="card my-3">
        <div class="card-header">Charts</div>
        <div v-if="chartsLoading" class="my-3 text-center text-muted">
            <FaIcon icon="circle-notch" spin fixed-width />
            Loading charts ({{ chartsLoadingPercent }}%)
        </div>
        <PlatzCollection v-else :items="charts" :flush="true">
            <template #item="scope">
                <PlatzCollectionItem>
                    <div class="my-1">
                        <PlatzHelmChart :chart="scope.item" />
                    </div>
                </PlatzCollectionItem>
            </template>

            <template #empty-title> No Helm Charts </template>
            <template #empty-text>
                Helm charts are detected automatically when pushed to an ECR
                repo
            </template>
        </PlatzCollection>
    </div>

    <SetHelmRegistryIcon ref="setIcon" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "@/store";
import SetHelmRegistryIcon from "./SetHelmRegistryIcon.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
    props: {
        id: {
            type: String,
            required: true,
        },
    },

    components: {
        SetHelmRegistryIcon,
    },

    setup(props) {
        const store = useStore();
        const setIcon = ref<typeof SetHelmRegistryIcon>();

        onMounted(() => {
            store!.collections.helmCharts.setFilters({
                helm_registry_id: props.id,
            });
        });

        const chartsLoading = computed(
            () => store!.collections.helmCharts.loading
        );
        const chartsLoadingPercent = computed(
            () => store!.collections.helmCharts.loadingPercent
        );

        const registry = computed(() =>
            store!.collections.helmRegistries.getOne(props.id)
        );

        const charts = computed(() =>
            store!.collections.helmCharts.all.filter(
                (chart) => chart.helm_registry_id == props.id
            )
        );

        useHead({
            title: computed(
                () =>
                    `${registry.value.repo_name} - Helm Registries - Admin - Platz`
            ),
        });

        return {
            registry,
            setIcon,
            chartsLoading,
            chartsLoadingPercent,
            charts,
        };
    },
});
</script>
