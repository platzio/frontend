<template>
  <div>
    <PlatzCollection :items="allUsers">
      <template #item="scope">
        <PlatzItemWithActions>
          <template #contents>
            <div class="my-1">
              <PlatzUser :id="scope.item.id" :showName="true" :showEmail="true" :showAdmin="true" />
            </div>
          </template>
          <template #actions>
            <li>
              <a
                class="dropdown-item"
                @click="changeGlobalRole && changeGlobalRole.open(scope.item)"
              >
                <FaIcon icon="shield-alt" fixed-width />
                Change Global Role
              </a>
            </li>
          </template>
        </PlatzItemWithActions>
      </template>

      <template #empty-title> No Users </template>
      <template #empty-text> Nobody's here </template>
    </PlatzCollection>

    <ChangeUserGlobalRole ref="changeGlobalRole" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "@/store";
import ChangeUserGlobalRole from "./ChangeUserGlobalRole.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {
    ChangeUserGlobalRole,
  },

  setup() {
    const store = useStore();
    const allUsers = computed(() => store!.collections.users.all);
    const changeGlobalRole = ref<typeof ChangeUserGlobalRole>();

    useHead({
      title: "Users - Admin - Platz",
    });

    return {
      allUsers,
      changeGlobalRole,
    };
  },
});
</script>
