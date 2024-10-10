<template>
  <div v-if="allPermissions">
    <PlatzCollection :items="allPermissions">
      <template #item="{ item }">
        <PlatzItemWithActions>
          <template #contents>
            <div class="mt-2 mb-1 d-flex flex-row align-items-center">
              <PlatzUser :id="item.user_id" :showName="true" />
              <span class="ms-2 badge bg-success">{{
                item.role.toUpperCase()
              }}</span>
            </div>
            <div class="small mb-1">
              Added
              <PlatzMoment :value="item.created_at" />
            </div>
          </template>
          <template #actions>
            <li>
              <a
                class="dropdown-item"
                @click="removeUserPermission && removeUserPermission.open(item)"
              >
                <FaIcon icon="trash-alt" fixed-width />
                Remove Permission
              </a>
            </li>
          </template>
        </PlatzItemWithActions>
      </template>

      <template #globalActions>
        <div>
          <div>
            <button
              v-if="canEdit"
              class="btn btn-primary"
              @click="addUserPermission && addUserPermission.open()"
            >
              <FaIcon icon="plus" fixed-width />
              Add User Permission
            </button>
          </div>
          <div class="my-3 text-body-secondary text-start">
            <FaIcon icon="info-circle" fixed-width />
            Users listed here can see the env and everything in it (deployments
            and custom resources). Admin users can perform any operation and
            control permissions for all other users.
          </div>
        </div>
      </template>

      <template #emptyTitle> No User Permissions </template>

      <template #emptyAction>
        <div class="my-2">
          There are no user permissions defined for this env, let's create the
          first one:
        </div>
        <div class="my-4">
          <button
            v-if="canEdit"
            class="btn btn-lg btn-primary"
            @click="addUserPermission && addUserPermission.open()"
          >
            <FaIcon icon="plus" fixed-width />
            Add User Permission
          </button>
        </div>
      </template>
    </PlatzCollection>

    <AddUserPermission ref="addUserPermission" :envId="envId" />
    <RemoveUserPermission ref="removeUserPermission" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useHead } from "@vueuse/head";
import PlatzMoment from "@/components/base/PlatzMoment.vue";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzItemWithActions from "@/components/collection/PlatzItemWithActions.vue";
import PlatzUser from "@/components/PlatzUser.vue";
import { useStore } from "@/store";
import AddUserPermission from "./AddUserEnvPermission.vue";
import RemoveUserPermission from "./RemoveUserEnvPermission.vue";
import { isEnvAdmin } from "@/store/permissions";

const props = defineProps<{
  envId: string;
}>();

const store = useStore();
const addUserPermission = ref<typeof AddUserPermission>();
const removeUserPermission = ref<typeof RemoveUserPermission>();

const env = computed(() => store?.collections.envs.getOne(props.envId));

const allPermissions = computed(() =>
  store?.collections.envUserPermissions.all.filter(
    (permission) => permission.env_id == props.envId
  )
);

const curUser = computed(() => store?.auth.curUser);

const canEdit = computed(
  () =>
    curUser.value &&
    (curUser.value.is_admin || isEnvAdmin(props.envId, curUser.value))
);

useHead({
  title: computed(
    () => `User Roles - Settings - ${env.value?.name || "..."} - Platz`
  ),
});
</script>
