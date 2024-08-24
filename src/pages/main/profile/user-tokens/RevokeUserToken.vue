<template>
  <PlatzModal
    ref="modal"
    title="Revoke User Token"
    btn-class="btn-danger"
    :error="state.error"
    :working="state.disabled"
    @submit="submit"
  >
    <div class="my-3 alert alert-danger" v-if="state.token">
      <div class="my-2 fw-bold">
        <FaIcon icon="triangle-exclamation" fixed-width />
        Careful
      </div>
      <div class="my-2">
        You are about to revoke the user token
        <strong>{{ state.token.id }}</strong>
      </div>
    </div>

    <div class="my-3">Are you sure you want to continue?</div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type UserToken } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { userTokens } from "./collection";

function initialData(): {
  error: any;
  disabled: boolean;
  token?: UserToken;
} {
  return {
    error: undefined,
    disabled: false,
    token: undefined,
  };
}

const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open(token: UserToken) {
  Object.assign(state, initialData());
  state.token = token;
  modal.value!.open();
}

function close() {
  modal.value!.close();
}

async function submit() {
  if (!state.token) {
    return;
  }
  try {
    state.disabled = true;
    state.error = null;
    await userTokens.deleteItem(state.token.id);
    modal.value!.close();
  } catch (error) {
    state.error = error;
    state.disabled = false;
  }
}

defineExpose({ open, close });
</script>
