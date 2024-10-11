<template>
  <PlatzModal
    ref="modal"
    title="Remove User Permission"
    btn-class="btn-danger"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div v-if="state.permission" class="alert alert-danger mb-2">
      <FaIcon icon="exclamation-triangle" fixed-width />
      You are about to remove the
      <span class="mx-1 badge bg-success">{{
        state.permission.role.toUpperCase()
      }}</span>
      permission for the following user:
    </div>
    <div
      v-if="state.permission"
      class="my-3 p-3 rounded border fw-bold bg-light-subtle"
    >
      <PlatzUser :id="state.permission.user_id" :show-name="true" />
    </div>
    <div class="mt-2">Are you sure you want to continue?</div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type EnvUserPermission } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import PlatzUser from "@/components/PlatzUser.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  working: boolean;
  permission?: EnvUserPermission;
} {
  return {
    error: undefined,
    working: false,
    permission: undefined,
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open(permission: EnvUserPermission) {
  Object.assign(state, initialData());
  state.permission = permission;
  modal.value?.open();
}

function close() {
  modal.value?.close();
}

async function submit() {
  if (!state.permission) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store?.collections.envUserPermissions.deleteItem(state.permission.id);
    modal.value?.close();
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
