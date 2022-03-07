<template>
  <div class="alert alert-danger" v-if="error">
    <div class="my-1 fw-bold">
      <fa icon="exclamation-circle" fixed-width />
      {{ error.message ? error.message : error }}
    </div>
    <div v-if="error.response && error.response.data">
      {{ error.response.data.message || error.response.data }}
    </div>
  </div>
</template>

<script lang="ts">
import { AxiosError } from "axios";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    error: {
      type: Object as PropType<undefined | Error | AxiosError>
    }
  }
});
</script>
