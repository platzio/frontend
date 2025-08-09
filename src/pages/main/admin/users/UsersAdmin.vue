<template>
  <div v-if="activeUsers">
    <PlatzCollection :items="activeUsers">
      <template #item="{ item }">
        <PlatzItemWithActions>
          <template #contents>
            <div class="my-1">
              <PlatzUser
                :id="item.id"
                :show-name="true"
                :show-email="true"
                :show-admin="true"
              />
            </div>
          </template>
          <template #actions>
            <li>
              <a class="dropdown-item" @click="changeGlobalRole?.open(item)">
                <FaIcon icon="shield-alt" fixed-width />
                Change Global Role
              </a>
            </li>
            <li class="dropdown-divider" />
            <li>
              <a class="dropdown-item" @click="deactivateUser?.open(item)">
                <FaIcon icon="ban" fixed-width />
                Deactivate User
              </a>
            </li>
          </template>
        </PlatzItemWithActions>
      </template>

      <template #emptyTitle>No Users</template>
      <template #emptyText>Nobody's here</template>
    </PlatzCollection>

    <div v-if="inactiveUsers?.length">
      <div class="mt-4 mb- h5">Inactive Users</div>
      <PlatzCollection :items="inactiveUsers">
        <template #item="{ item }">
          <PlatzItemWithActions>
            <template #contents>
              <PlatzUser
                :id="item.id"
                :show-name="true"
                :show-email="true"
                :show-admin="false"
                :show-active="true"
              />
            </template>
            <template #actions>
              <li>
                <a class="dropdown-item" @click="activateUser?.open(item)">
                  <FaIcon icon="check" fixed-width />
                  Activate User
                </a>
              </li>
            </template>
          </PlatzItemWithActions>
        </template>
      </PlatzCollection>
    </div>

    <ChangeUserGlobalRole ref="changeGlobalRole" />
    <ActivateUser ref="activateUser" />
    <DeactivateUser ref="deactivateUser" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/store";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzItemWithActions from "@/components/collection/PlatzItemWithActions.vue";
import PlatzUser from "@/components/PlatzUser.vue";
import ChangeUserGlobalRole from "./ChangeUserGlobalRole.vue";
import ActivateUser from "./ActivateUser.vue";
import DeactivateUser from "./DeactivateUser.vue";
import { useHead } from "@vueuse/head";

const store = useStore();

const activeUsers = computed(() =>
  store?.collections.users.all.filter((user) => user.is_active)
);
const inactiveUsers = computed(() =>
  store?.collections.users.all.filter((user) => !user.is_active)
);

const changeGlobalRole = ref<typeof ChangeUserGlobalRole>();
const activateUser = ref<typeof ActivateUser>();
const deactivateUser = ref<typeof DeactivateUser>();

useHead({ title: "Users - Admin - Platz" });
</script>
