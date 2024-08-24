<template>
  <div>
    <PlatzCollection :items="allUsers">
      <template #item="{ item }">
        <PlatzItemWithActions>
          <template #contents>
            <div class="my-1">
              <PlatzUser
                :id="item.id"
                :showName="true"
                :showEmail="true"
                :showAdmin="true"
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
          </template>
        </PlatzItemWithActions>
      </template>

      <template #emptyTitle>No Users</template>
      <template #emptyText>Nobody's here</template>
    </PlatzCollection>

    <ChangeUserGlobalRole ref="changeGlobalRole" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/store";
import PlatzCollection from "@/components/collection/PlatzCollection.vue";
import PlatzItemWithActions from "@/components/collection/PlatzItemWithActions.vue";
import PlatzUser from "@/components/PlatzUser.vue";
import ChangeUserGlobalRole from "./ChangeUserGlobalRole.vue";
import { useHead } from "@vueuse/head";

const store = useStore();
const allUsers = computed(() => store!.collections.users.all);
const changeGlobalRole = ref<typeof ChangeUserGlobalRole>();

useHead({
  title: "Users - Admin - Platz",
});
</script>
