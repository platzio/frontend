<template>
  <div v-if="bot">
    <div class="d-flex flex-row justify-content-between align-items-start">
      <div>
        <h1>
          <PlatzBot :id="id" />
        </h1>
        <div class="my-3 font-monospace">
          <FaIcon icon="id-card" fixed-width />
          {{ bot.id }}
        </div>
      </div>

      <div class="dropdown">
        <a
          id="actionsDropdown"
          class="btn btn-outline-primary"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Actions
          <FaIcon icon="angle-down" fixed-width />
        </a>
        <ul class="dropdown-menu" aria-labelledby="actionsDropdown">
          <li>
            <a class="dropdown-item" @click="newBotToken?.open(bot.id)">
              <FaIcon icon="plus" fixed-width />
              New API Token
            </a>
          </li>
          <li>
            <a class="dropdown-item" @click="editBot?.open(bot)">
              <FaIcon icon="pencil" fixed-width />
              Edit Bot
            </a>
          </li>
          <li class="dropdown-divider"></li>
          <li>
            <a class="dropdown-item" @click="deleteBot?.open(bot)">
              <FaIcon icon="trash" fixed-width />
              Delete Bot
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="botTokensReady">
      <PlatzCollection :items="allBotTokens">
        <template #item="{ item }">
          <PlatzItemWithActions>
            <template #contents>
              <div class="my-1">
                <FaIcon icon="key" fixed-width />
                <samp class="ms-1 lead">{{ item.id }}</samp>
              </div>
              <div class="my-1 small d-flex flex-row align-items-center">
                Created by
                <span class="mx-1 fw-bolder">
                  <PlatzUser
                    :id="item.created_by_user_id"
                    :show-name="true"
                    :show-avatar="false"
                  />
                </span>
                <PlatzMoment :value="item.created_at" />
              </div>
            </template>
            <template #actions>
              <li>
                <a class="dropdown-item" @click="revokeBotToken?.open(item)">
                  <FaIcon icon="xmark" fixed-width />
                  Revoke Bot Token
                </a>
              </li>
            </template>
          </PlatzItemWithActions>
        </template>

        <template #emptyTitle>This bot has no API tokens</template>
        <template #emptyText>
          <button
            class="btn btn-lg btn-primary"
            @click="newBotToken?.open(bot.id)"
          >
            <FaIcon icon="plus" fixed-width />
            New API Token
          </button>
        </template>
      </PlatzCollection>
    </div>
    <div v-else class="my-3 h2 text-center text-body-secondary">
      <FaIcon icon="circle-notch" spin fixed-width />
    </div>

    <EditBot ref="editBot" />
    <DeleteBot ref="deleteBot" @done="backToBots" />
    <NewBotToken ref="newBotToken" @submit="reload" @close="reload" />
    <RevokeBotToken ref="revokeBotToken" @submit="reload" @close="reload" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzItemWithActions from "@/components/collection/PlatzItemWithActions.vue";
import PlatzMoment from "@/components/base/PlatzMoment.vue";
import PlatzUser from "@/components/PlatzUser.vue";
import PlatzBot from "@/components/PlatzBot.vue";
import EditBot from "./EditBot.vue";
import DeleteBot from "./DeleteBot.vue";
import NewBotToken from "./NewBotToken.vue";
import RevokeBotToken from "./RevokeBotToken.vue";
import { botTokens } from "./collection";

const props = defineProps<{ id: string }>();

const botTokensReady = computed(() => botTokens.ready);

const reload = () => {
  botTokens.reset();
  botTokens.setFilters({ bot_id: props.id });
};

reload();

const allBotTokens = computed(() => botTokens.all);

const editBot = ref<typeof EditBot>();
const deleteBot = ref<typeof DeleteBot>();
const newBotToken = ref<typeof NewBotToken>();
const revokeBotToken = ref<typeof RevokeBotToken>();

const store = useStore();

const bot = computed(() => store?.collections.bots.getOne(props.id));

const router = useRouter();
function backToBots() {
  router.replace({
    name: "admin.bots",
  });
}
</script>
