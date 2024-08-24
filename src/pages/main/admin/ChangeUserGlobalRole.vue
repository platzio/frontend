<template>
  <PlatzModal
    ref="modal"
    title="Change Global User Role"
    btn-class="btn-primary"
    :error="state.error"
    :working="state.working"
    @submit="submit"
  >
    <div>Choose the global role for the following user:</div>

    <div class="my-3 p-3 rounded border" v-if="state.user">
      <PlatzUser :id="state.user.id" :showName="true" />
    </div>

    <div class="my-3">
      <div class="form-check my-2">
        <input
          class="form-check-input"
          type="radio"
          name="userRole"
          id="userRoleRegular"
          v-model="state.is_admin"
          :value="false"
        />
        <label class="form-check-label" for="userRoleRegular">
          <div class="">Regular User</div>
          <div class="mt-1 text-body-secondary">
            Can use the site like a normal person, can't access this admin
            section.
          </div>
        </label>
      </div>
      <div class="form-check my-3">
        <input
          class="form-check-input"
          type="radio"
          name="userRole"
          id="userRoleAdmin"
          v-model="state.is_admin"
          :value="true"
        />
        <label class="form-check-label" for="userRoleAdmin">
          <div class="">Global Admin User</div>
          <div class="mt-1 text-body-secondary">
            Can access this admin section, create envs, assign clusters to envs
            and set other users as global admins.
          </div>
        </label>
      </div>
    </div>
  </PlatzModal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { type User } from "@platzio/sdk";
import PlatzModal from "@/components/base/PlatzModal.vue";
import PlatzUser from "@/components/PlatzUser.vue";
import { useStore } from "@/store";

function initialData(): {
  error: any;
  working: boolean;
  user?: User;
  is_admin: boolean;
} {
  return {
    error: undefined,
    working: false,
    user: undefined,
    is_admin: false,
  };
}

const store = useStore();
const state = reactive({ ...initialData() });
const modal = ref<typeof PlatzModal>();

function open(user: User) {
  Object.assign(state, initialData());
  state.user = user;
  state.is_admin = user.is_admin;
  modal.value!.open();
}

function close() {
  modal.value!.close();
}

async function submit() {
  if (!state.user) {
    return;
  }
  try {
    state.working = true;
    state.error = null;
    await store!.collections.users.updateItem({
      id: state.user.id,
      data: {
        is_admin: state.is_admin,
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
