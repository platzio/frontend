<template>
  <div class="dropdown">
    <a
      id="user-dropdown"
      class="nav-link pe-0"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <div v-if="curUser" class="d-flex flex-row align-items-center">
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
          active-class="no-active-class"
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
          active-class="no-active-class"
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
