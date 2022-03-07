<template>
  <img src="@/assets/Logo.svg" :style="imgStyle" />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    size: {
      type: String,
      default: "2rem",
    },
  },

  setup(props) {
    const imgStyle = computed(() => ({
      width: props.size,
      height: props.size,
    }));

    return {
      imgStyle,
    };
  },
});
</script>
