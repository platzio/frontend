<template>
  <div v-if="bots">
    <PlatzCollection :items="bots">
      <template #item="{ item }">
        <PlatzLinkedItem
          :to="{ name: 'admin.bot.page', params: { id: item.id } }"
        >
          <div class="my-1 fw-semibold">
            <PlatzBot :id="item.id" />
          </div>
          <div class="my-1 text-secondary font-monospace">
            <FaIcon icon="id-card" fixed-width />
            {{ item.id }}
          </div>
          <div class="my-1 small text-secondary">
            <FaIcon icon="clock" fixed-width />
            Created
            <PlatzMoment :value="item.created_at" />
          </div>
        </PlatzLinkedItem>
      </template>

      <template #globalActions>
        <div class="d-flex flex-row align-items-center justify-content-end">
          <button class="btn btn-primary" @click="createBot?.open()">
            <FaIcon icon="plus" fixed-width />
            Create Bot
          </button>
        </div>
      </template>

      <template #emptyTitle>No Bots</template>
      <template #emptyText>
        <button class="btn btn-lg btn-primary" @click="createBot?.open()">
          <FaIcon icon="plus" fixed-width />
          Create Bot
        </button>
      </template>
    </PlatzCollection>

    <CreateBot ref="createBot" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/store";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzBot from "@/components/PlatzBot.vue";
import PlatzMoment from "@/components/base/PlatzMoment.vue";
import CreateBot from "./CreateBot.vue";
import PlatzLinkedItem from "@/components/collection/PlatzLinkedItem.vue";

const createBot = ref<typeof CreateBot>();

const store = useStore();

const bots = computed(() => store?.collections.bots.all);
</script>
