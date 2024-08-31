<template>
  <PlatzModal
    ref="modal"
    title="Edit Bot"
    btn-class="btn-primary"
    submit-text="Save Changes"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="mb-2">Enter a new name for the bot:</div>
    <div class="my-3">
      <input
        type="text"
        class="form-control"
        v-model="state.display_name"
        required
        placeholder="Enter a new name"
      />
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { Bot } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  working: boolean;
  id?: string;
  display_name?: string;
} {
  return {
    error: undefined,
    working: false,
    id: undefined,
    display_name: "question",
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open(bot: Bot) {
  Object.assign(state, initialData());
  state.id = bot.id;
  state.display_name = bot.display_name;
  modal.value!.open();
}

function close() {
  modal.value!.close();
}

async function submit() {
  if (!state.id) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store!.collections.bots.updateItem({
      id: state.id,
      data: {
        display_name: state.display_name,
      },
    });
    modal.value!.close();
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
