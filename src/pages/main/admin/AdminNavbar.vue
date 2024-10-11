<template>
  <nav class="navbar navbar-expand-lg navbar-platz">
    <router-link class="navbar-brand" :to="{ name: 'main' }">
      <PlatzLogo size="2.5rem" />
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

    <div id="navbarSupportedContent" class="collapse navbar-collapse">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>

      <ul class="navbar-nav mb-2 mb-lg-0">
        <li class="nav-item text-secondary">
          <UserMenu />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import PlatzLogo from "@platzio/design/components/PlatzLogo.vue";
import UserMenu from "../profile/UserMenu.vue";
</script>
