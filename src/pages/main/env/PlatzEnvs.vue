<template>
  <router-view v-if="ok" />
  <div v-else class="my-5 row">
    <div class="col" />
    <div class="col-lg-6 col-md-8 col-sm-10 col-xs-12">
      <div class="alert alert-warning">
        <div class="mt-2 mb-3 h5 fw-bold">
          <FaIcon icon="city" fixed-width />
          No Permissions
        </div>
        <div class="my-1">
          It looks like you have no permissions to see any env.
        </div>
        <div v-if="!curUser?.is_admin" class="my-1 fw-bold">
          Please ask an admin to grant you permissions to one of the envs.
        </div>
      </div>
      <div v-if="curUser?.is_admin" class="alert alert-primary">
        <div class="mt-2 mb-3 h5 fw-bold">
          <FaIcon icon="shield-alt" fixed-width />
          But Fear Not, You're an Admin!
        </div>
        <div class="my-1">
          You can go into the
          <router-link :to="{ name: 'admin.envs' }"
            >Envs Admin Section</router-link
          >
          to create a new env or add yourself to an existing one.
        </div>
      </div>
    </div>
    <div class="col" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import { isEnvUser } from "@/store/permissions";

const store = useStore();
const route = useRoute();
const router = useRouter();

const ok = ref(true);
const curUser = computed(() => store?.auth.curUser);

const check = () => {
  if (route.name == "envs" && store?.collections.envs.ready) {
    const possibleEnvs = store?.collections.envs.all.filter(
      (env) => curUser.value && isEnvUser(store, env.id, curUser.value)
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
watch(() => store?.collections.envs.ready, check, { immediate: true });
</script>
