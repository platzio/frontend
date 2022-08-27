<template>
  <div>
    <EnvsNavbar :envId="envId" />
    <router-view :envId="envId" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EnvsNavbar from "./EnvsNavbar.vue";

export default defineComponent({
  props: {
    envId: {
      type: String,
      required: true,
    },
  },

  components: {
    EnvsNavbar,
  },
});
</script>
