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
      <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>

      <ul class="navbar-nav mb-2 mb-lg-0">
        <li class="nav-item text-secondary">
          <User :id="curUser.id" :show-name="true" />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  setup() {
    const store = useStore();
    const curUser = computed(() => store!.auth.curUser!);

    return {
      curUser,
    };
  },
});
</script>
