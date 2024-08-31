<template>
  <div v-if="formatted" class="d-flex flex-row align-items-center">
    <FaIcon :icon="formatted.icon" class="me-1" />
    {{ formatted.text }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/store";

const props = defineProps<{
  id: string;
}>();

const store = useStore();

const kind = computed(() => store!.collections.bots.getOne(props.id));

const formatted = computed(() =>
  kind.value ? store!.collections.bots.formatItem(kind.value) : undefined
);
</script>
