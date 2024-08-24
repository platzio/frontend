<template>
  <PlatzModal
    ref="modal"
    title="Add User Permission"
    btn-class="btn-primary"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div class="mb-2">Select a user:</div>

    <div class="my-2">
      <select class="form-select" v-model="state.user_id">
        <option v-for="user in possibleUsers" :value="user.id" :key="user.id">
          {{ user.display_name }}
        </option>
      </select>
    </div>

    <div class="mt-3 mb-2">And a role to be applied for this user:</div>

    <div class="my-3">
      <div class="form-check my-2">
        <input
          class="form-check-input"
          type="radio"
          name="userRole"
          id="userRoleRegular"
          v-model="state.role"
          :value="EnvUserRole.User"
        />
        <label class="form-check-label" for="userRoleRegular">
          <div class="">Regular User</div>
          <div class="mt-1 text-body-secondary">
            Can see and access the env, perform actions based on the permissions
            granted by other admins.
          </div>
        </label>
      </div>
      <div class="form-check my-3">
        <input
          class="form-check-input"
          type="radio"
          name="userRole"
          id="userRoleAdmin"
          v-model="state.role"
          :value="EnvUserRole.Admin"
        />
        <label class="form-check-label" for="userRoleAdmin">
          <div class="">Admin User</div>
          <div class="mt-1 text-body-secondary">
            Can perform any operation for deployments and custom resources,
            without specifically adding permissions for each operation. Also,
            can change all env settings, including adding and removing
            permissions for deployments and custom resources.
          </div>
        </label>
      </div>
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { EnvUserRole } from "@platzio/sdk";
import { useStore } from "@/store";
import PlatzModal from "@/components/base/PlatzModal.vue";

function initialData(): {
  error: any;
  working: boolean;
  role?: EnvUserRole;
  user_id?: string;
} {
  return {
    error: undefined,
    working: false,
    role: undefined,
    user_id: undefined,
  };
}

const props = defineProps<{
  envId: string;
}>();

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

const possibleUsers = computed(() =>
  store!.collections.users.all.filter((user) =>
    store!.collections.envUserPermissions.all
      .filter((permission) => permission.env_id == props.envId)
      .every((permission) => permission.user_id != user.id)
  )
);

function open() {
  Object.assign(state, initialData());
  modal.value!.open();
}

function close() {
  modal.value!.close();
}

async function submit() {
  if (!state.user_id || !state.role) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store!.collections.envUserPermissions.createItem({
      env_id: props.envId,
      user_id: state.user_id,
      role: state.role,
    });
    modal.value!.close();
  } catch (error) {
    state.error = error;
    state.working = false;
  }
}

defineExpose({ open, close });
</script>
