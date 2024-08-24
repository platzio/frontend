<template>
  <PlatzModal
    ref="modal"
    title="Edit Auto Add New Users"
    btn-class="btn-primary"
    :error="state.error"
    :working="state.disabled"
    @submit="submit"
    submitText="Save Changes"
  >
    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="auto_add_new_users"
        v-model="state.auto_add_new_users"
        :disabled="state.disabled"
      />
      <label class="form-check-label" for="auto_add_new_users">
        Automatically add new users to this env
      </label>
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type Env } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  disabled: boolean;
  auto_add_new_users: boolean;
} {
  return {
    error: undefined,
    disabled: false,
    auto_add_new_users: false,
  };
}

const props = defineProps<{
  envId: string;
}>();

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open(env: Env) {
  Object.assign(state, initialData());
  state.auto_add_new_users = env.auto_add_new_users;
  modal.value!.open();
}

function close() {
  modal.value!.close();
}

async function submit() {
  try {
    state.disabled = true;
    state.error = null;
    await store!.collections.envs.updateItem({
      id: props.envId,
      data: {
        auto_add_new_users: state.auto_add_new_users,
      },
    });
    modal.value!.close();
  } catch (error) {
    state.error = error;
    state.disabled = false;
  }
}

defineExpose({ open, close });
</script>
