<template>
  <ProfileNavbar />
  <div class="sidenav">
    <ul class="nav nav-pills flex-column">
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'profile.you' }">
          <FaIcon icon="child-reaching" fixed-width /> You
        </router-link>
      </li>
      <li class="nav-heading">Authentication</li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'profile.user-tokens' }">
          User Tokens
        </router-link>
      </li>
    </ul>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from "@vueuse/head";
import ProfileNavbar from "./ProfileNavbar.vue";

useHead({
  title: "Profile - Platz",
});
</script>
