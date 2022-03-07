<template>
  <nav class="navbar navbar-expand-lg navbar-platz">
    <router-link tag="a" class="navbar-brand" :to="{ name: 'main' }">
      <Logo size="2.5rem" />
    </router-link>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'env.deployments' }">
            Deployments
          </router-link>
        </li>
      </ul>

      <ul class="navbar-nav mb-2 mb-lg-0">
        <li class="nav-item dropdown text-secondary">
          <a
            class="nav-link"
            id="env-dropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div class="d-flex flex-row align-items-center">
              <Env :id="envId" :showInfo="false" />
              <fa icon="angle-down" class="ms-2" />
            </div>
          </a>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="env-dropdown"
          >
            <li class="nav-heading mt-1 mb-2" v-if="otherEnvs.length > 0">
              Switch Env
            </li>
            <li v-for="env in otherEnvs" :key="env.id">
              <router-link
                class="dropdown-item"
                :to="{
                  params: { envId: env.id },
                }"
              >
                <Env :id="env.id" />
              </router-link>
            </li>
            <li class="dropdown-divider" v-if="otherEnvs.length > 0" />
            <li>
              <router-link
                :to="{ name: 'env.settings' }"
                class="dropdown-item"
                active-class=""
              >
                <fa icon="sliders-h" fixed-width />
                This Env's Settings
              </router-link>
            </li>
            <li v-if="curUser.is_admin">
              <router-link
                :to="{ name: 'admin' }"
                class="dropdown-item"
                active-class=""
              >
                <fa icon="cog" fixed-width />
                Global Site Settings
              </router-link>
            </li>
          </ul>
        </li>

        <li class="nav-item dropdown text-secondary">
          <a
            class="nav-link pe-0"
            id="user-dropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div class="d-flex flex-row align-items-center">
              <User :id="curUser.id" :show-name="true" />
              <div class="ms-2">
                <fa icon="angle-down" />
              </div>
            </div>
          </a>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="user-dropdown"
          >
            <li>
              <router-link :to="{ name: 'auth.logout' }" class="dropdown-item">
                <fa icon="sign-out-alt" fixed-width />
                Logout
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import { isEnvUser } from "@/store/permissions";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const curUser = computed(() => store!.auth.curUser!);
    const otherEnvs = computed(() =>
      store!.collections.envs.all.filter(
        (env) => env.id != props.envId && isEnvUser(env.id, curUser.value.id)
      )
    );

    return {
      curUser,
      otherEnvs,
    };
  },
});
</script>
