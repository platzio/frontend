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

    <EditBot ref="editBot" />
    <DeleteBot ref="deleteBot" @done="backToBots" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/store";
import PlatzBot from "@/components/PlatzBot.vue";
import EditBot from "./EditBot.vue";
import DeleteBot from "./DeleteBot.vue";
import { useRouter } from "vue-router";

const editBot = ref<typeof EditBot>();
const deleteBot = ref<typeof DeleteBot>();

const props = defineProps<{ id: string }>();

const store = useStore();

const bot = computed(() => store?.collections.bots.getOne(props.id));

const router = useRouter();
function backToBots() {
  router.replace({
    name: "admin.bots",
  });
}
</script>
