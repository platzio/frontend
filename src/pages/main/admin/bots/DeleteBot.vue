<template>
  <PlatzModal
    ref="modal"
    title="Delete Bot"
    btn-class="btn-danger"
    :error="state.error"
    :working="state.disabled"
    @submit="submit"
  >
    <div class="my-3 alert alert-danger">
      <div class="my-2 fw-bold">
        <FaIcon icon="triangle-exclamation" fixed-width />
        Careful
      </div>
      <div class="my-2">
        You are about to delete the bot named
        <strong>{{ state.display_name }}</strong
        >.
      </div>
    </div>

    <div class="my-3">Are you sure you want to continue?</div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type Bot } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzModal from "@/components/base/PlatzModal.vue";

function initialData(): {
  error: any;
  disabled: boolean;
  id?: string;
  display_name?: string;
} {
  return {
    error: undefined,
    disabled: false,
    id: undefined,
    display_name: undefined,
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const emit = defineEmits(["done"]);
const modal = ref<typeof PlatzModal>();

function open(bot: Bot) {
  Object.assign(state, initialData());
  state.id = bot.id;
  state.display_name = bot.display_name;
  modal.value?.open();
}

function close() {
  modal.value?.close();
}

async function submit() {
  if (!state.id) {
    return;
  }
  try {
    state.disabled = true;
    state.error = null;
    await store?.collections.bots.deleteItem(state.id);
    modal.value?.close();
    emit("done");
  } catch (error) {
    state.error = error;
    state.disabled = false;
  }
}

defineExpose({ open, close });
</script>
