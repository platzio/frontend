<template>
  <div>
    <ul class="list-group">
      <li class="list-group-item bg-light-subtle">
        <div class="row">
          <div class="col-3 py-2 px-3" />
          <div
            v-for="role in UserDeploymentRole"
            :key="role"
            class="col py-2 px-3 fw-bold"
          >
            {{ role }}s
          </div>
        </div>
      </li>
      <li
        v-for="kind in deploymentKinds"
        :key="kind.id"
        class="list-group-item"
      >
        <div class="row">
          <div class="col-3 py-2 px-3 fw-bold">{{ kind.name }}</div>
          <div
            v-for="role in UserDeploymentRole"
            :key="role"
            class="col py-2 px-3"
          >
            <div
              v-for="permission in permissionsByRole(kind.id, role)"
              :key="permission.id"
              class="mb-2 d-flex flex-row align-items-end"
            >
              <PlatzUser :id="permission.user_id" :show-name="true" />
              <a
                v-if="canEdit"
                class="small ms-2"
                @click="removeUser && removeUser.open(kind, role, permission)"
              >
                remove
              </a>
            </div>
            <a
              v-if="canEdit"
              class="small"
              @click="addUser && addUser.open(kind, role)"
            >
              <FaIcon icon="plus" fixed-width />
              Add User
            </a>
          </div>
        </div>
      </li>
    </ul>

    <AddUserDeploymentPermission ref="addUser" :env-id="envId" />
    <RemoveUserDeploymentPermission ref="removeUser" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useHead } from "@vueuse/head";
import { UserDeploymentRole } from "@platzio/sdk";
import PlatzUser from "@/components/PlatzUser.vue";
import { useStore } from "@/store";
import { isEnvAdmin } from "@/store/permissions";
import AddUserDeploymentPermission from "./AddUserDeploymentPermission.vue";
import RemoveUserDeploymentPermission from "./RemoveUserDeploymentPermission.vue";

const props = defineProps<{
  envId: string;
}>();

const store = useStore();
const addUser = ref<typeof AddUserDeploymentPermission>();
const removeUser = ref<typeof RemoveUserDeploymentPermission>();

const env = computed(() => store?.collections.envs.getOne(props.envId));

const deploymentKinds = computed(() => store?.collections.deploymentKinds.all);

const permissionsByRole = computed(
  () => (kind_id: string, role: UserDeploymentRole) =>
    store?.collections.deploymentPermissions.all.filter(
      (perm) =>
        perm.env_id == props.envId &&
        perm.kind_id == kind_id &&
        perm.role == role
    )
);

const canEdit = computed(
  () =>
    store &&
    store.auth.curUser &&
    isEnvAdmin(store, props.envId, store?.auth.curUser)
);

useHead({
  title: computed(
    () =>
      `Deployments Permissions - Settings - ${env.value?.name || "..."} - Platz`
  ),
});
</script>
