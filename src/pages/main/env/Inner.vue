<template>
  <div>
    <Navbar :envId="envId" />
    <router-view :envId="envId" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "./Navbar.vue";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
  },

  components: {
    Navbar,
  },
});
</script>
