<template>
  <PlatzModal
    ref="modal"
    title="Activate User"
    btn-class="btn-success"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div>You are about to activate this user:</div>

    <div v-if="state.user" class="my-3 p-3 rounded border">
      <PlatzUser :id="state.user.id" :show-name="true" />
    </div>

    <div>This will allow the user to login to Platz again.</div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type User } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import PlatzUser from "@/components/PlatzUser.vue";
import { useStore } from "@/store";

function initialData(): { error: any; working: boolean; user?: User } {
  return { error: undefined, working: false, user: undefined };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open(user: User) {
  Object.assign(state, initialData());
  state.user = user;
  modal.value?.open();
}

function close() {
  modal.value?.close();
}

async function submit() {
  if (!state.user) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store?.collections.users.updateItem({
      id: state.user.id,
      data: { is_active: true },
    });
    modal.value?.close();
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
