<template>
  <MarkdownIt :source="source" />
</template>

<script setup lang="ts">
import MarkdownIt from "vue3-markdown-it";

defineProps<{
  source: string;
}>();
</script>
