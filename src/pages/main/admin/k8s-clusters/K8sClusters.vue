<template>
    <div>
        <div v-if="parentRoute">
            <PlatzCollection :items="allK8sClusters">
                <template #item="scope">
                    <PlatzLinkedItem
                        :to="{
                            name: 'admin.k8s-cluster-page',
                            params: { id: scope.item.id },
                        }"
                    >
                        <ClusterRow :cluster="scope.item" />
                    </PlatzLinkedItem>
                </template>

                <template #empty-title> No Kubernetes Clusters </template>
                <template #empty-text>
                    Platz scans for Kubernetes clusters automatically in the
                    same AWS account where it runs.
                </template>
            </PlatzCollection>
        </div>
        <div v-else>
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@vueuse/head";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzLinkedItem from "@/components/collection/PlatzLinkedItem.vue";
import { useStore } from "@/store";
import ClusterRow from "./ClusterRow.vue";

export default defineComponent({
    components: {
        PlatzCollection,
        PlatzLinkedItem,
        ClusterRow,
    },

    setup(props) {
        const store = useStore();
        const allK8sClusters = computed(
            () => store!.collections.k8sClusters.all
        );

        const route = useRoute();
        const parentRoute = computed(
            () => Object.keys(route.params).length == Object.keys(props).length
        );

        useHead({
            title: "Clusters - Admin - Platz",
        });

        return {
            allK8sClusters,
            parentRoute,
        };
    },
});
</script>
