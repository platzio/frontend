<template>
  <MarkdownIt :source="source" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MarkdownIt from "vue3-markdown-it";

export default defineComponent({
  props: {
    source: {
      type: String,
    },
  },

  components: {
    MarkdownIt,
  },
});
</script>
