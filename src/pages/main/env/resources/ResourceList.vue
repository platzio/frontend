<template>
    <div v-if="isParentRoute">
        <PlatzCollection :items="allResources">
            <template #item="scope">
                <PlatzLinkedItem
                    :to="{
                        name: 'env.resources.page',
                        params: { id: scope.item.id },
                    }"
                >
                    <ResourceRow :resource="scope.item" />
                </PlatzLinkedItem>
            </template>

            <template #global-actions v-if="canEdit">
                <button
                    class="btn btn-primary"
                    @click="editResource && editResource.open()"
                >
                    <FaIcon icon="plus" fixed-width />
                    Add {{ resourceType.spec.name_singular }}
                </button>
            </template>

            <template #empty-title
                >No {{ resourceType.spec.name_plural }}</template
            >

            <template #empty-action v-if="canEdit">
                <button
                    class="btn btn-lg btn-primary"
                    @click="editResource && editResource.open()"
                >
                    <FaIcon icon="plus" fixed-width />
                    Add First {{ resourceType.spec.name_singular }}
                </button>
            </template>
        </PlatzCollection>
        <EditResource
            ref="editResource"
            :envId="envId"
            :resourceTypeId="resourceTypeId"
        />
    </div>
    <div v-else>
        <router-view :envId="envId" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@vueuse/head";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzLinkedItem from "@/components/collection/PlatzLinkedItem.vue";
import { useStore } from "@/store";
import ResourceRow from "./ResourceRow.vue";
import EditResource from "./EditResource.vue";

export default defineComponent({
    components: {
        PlatzCollection,
        PlatzLinkedItem,
        ResourceRow,
        EditResource,
    },

    props: {
        envId: {
            type: String,
            required: true,
        },
        resourceTypeId: {
            type: String,
            required: true,
        },
    },

    setup(props) {
        const store = useStore();
        const editResource = ref<typeof EditResource>();

        const route = useRoute();
        const isParentRoute = computed(
            () => Object.keys(route.params).length == Object.keys(props).length
        );

        const env = computed(() => store!.collections.envs.getOne(props.envId));

        const resourceType = computed(() =>
            store!.collections.deploymentResourceTypes.getOne(
                props.resourceTypeId
            )
        );

        // TODO: Check allowed_role
        const canEdit = computed(
            () =>
                resourceType.value.spec.lifecycle &&
                resourceType.value.spec.lifecycle.create
        );

        const allResources = computed(() =>
            store!.collections.deploymentResources.all.filter(
                (resource) => resource.type_id === props.resourceTypeId
            )
        );

        useHead({
            title: computed(
                () =>
                    `${resourceType.value.spec.name_plural} - ${env.value.name} - Platz`
            ),
        });

        return {
            isParentRoute,
            resourceType,
            canEdit,
            allResources,
            editResource,
        };
    },
});
</script>
