<template>
  <router-view v-if="ok" />
  <div v-else class="d-flex flex-row">
    <div class="flex-fill" />
    <div class="my-5 alert alert-warning">
      <div class="mt-2 mb-3 h5 fw-bold">
        <fa icon="city" fixed-width />
        No Permissions
      </div>
      <div class="my-1">
        It looks like you have no permissions to see any env.
      </div>
      <div class="my-1 fw-bold">
        Please ask an admin to grant you permissions to one of the envs.
      </div>
    </div>
    <div class="flex-fill" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import { isEnvUser } from "@/store/permissions";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const ok = ref(true);
    const curUser = computed(() => store!.auth.curUser!);

    const check = () => {
      if (route.name == "envs" && store!.collections.envs.ready) {
        const possibleEnvs = store!.collections.envs.all.filter((env) =>
          isEnvUser(env.id, curUser.value.id)
        );
        if (possibleEnvs.length > 0) {
          ok.value = true;
          const envId = possibleEnvs[0].id;
          router.replace({ name: "envs.env", params: { envId } });
        } else {
          ok.value = false;
        }
      }
    };

    watch(() => route.name, check, { immediate: true });
    watch(() => store!.collections.envs.ready, check, { immediate: true });

    return {
      ok,
    };
  },
});
</script>
