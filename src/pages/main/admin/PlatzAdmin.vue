<template>
  <AdminNavbar />
  <div class="sidenav">
    <ul class="nav nav-pills flex-column">
      <li class="nav-heading">General</li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'admin.users' }"> Users </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'admin.envs' }"> Envs </router-link>
      </li>

      <li class="nav-heading">Kubernetes</li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'admin.k8s-clusters' }"> Clusters </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'admin.helm-registries' }">
          Helm Registries
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'admin.tag-formats' }">
          Tag Formats
        </router-link>
      </li>

      <li class="nav-heading">Global Resources</li>
    </ul>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { useHead } from "@vueuse/head";
import { defineComponent } from "vue";
import AdminNavbar from "./AdminNavbar.vue";

export default defineComponent({
  components: {
    AdminNavbar,
  },

  setup() {
    useHead({
      title: "Admin - Platz",
    });
  },
});
</script>
