<template>
  <div class="dropdown">
    <a
      class="nav-link pe-0"
      id="user-dropdown"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <div class="d-flex flex-row align-items-center" v-if="curUser">
        <PlatzUser :id="curUser.id" :show-name="true" />
        <div class="ms-2">
          <FaIcon icon="angle-down" />
        </div>
      </div>
    </a>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="user-dropdown">
      <li>
        <router-link
          :to="{ name: 'profile' }"
          class="dropdown-item"
          activeClass="no-active-class"
        >
          <FaIcon icon="user-circle" fixed-width />
          My Profile
        </router-link>
      </li>
      <li class="dropdown-divider" />
      <li>
        <router-link
          :to="{ name: 'auth.logout' }"
          class="dropdown-item"
          activeClass="no-active-class"
        >
          <FaIcon icon="sign-out-alt" fixed-width />
          Logout
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/store";
import PlatzUser from "@/components/PlatzUser.vue";

const store = useStore();
const curUser = computed(() => store?.auth.curUser);
</script>
