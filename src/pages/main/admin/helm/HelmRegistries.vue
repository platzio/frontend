<template>
  <div>
    <div v-if="parentRoute">
      <PlatzCollection :items="allHelmRegistries">
        <template #item="scope">
          <PlatzLinkedItem
            :to="{
              name: 'admin.helm-registry-page',
              params: { id: scope.item.id },
            }"
          >
            <div class="my-1">
              <PlatzHelmRegistry :registry="scope.item" :showCategory="true" />
            </div>
          </PlatzLinkedItem>
        </template>

        <template #empty-title> No Helm Registries </template>
        <template #empty-text>
          Helm registries are created automatically when a new Helm chart is detected, there's
          nothing you have to do to make them appear here.
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
import { useStore } from "@/store";
import { useHead } from "@vueuse/head";

export default defineComponent({
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const parentRoute = computed(
      () => Object.keys(route.params).length == Object.keys(props).length
    );

    const allHelmRegistries = computed(() => store!.collections.helmRegistries.all);

    useHead({
      title: "Helm Registries - Admin - Platz",
    });

    return {
      allHelmRegistries,
      parentRoute,
    };
  },
});
</script>
