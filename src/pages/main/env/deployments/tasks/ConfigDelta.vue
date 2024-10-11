<template>
  <div
    v-for="(changes, key) in delta"
    :key="key"
    class="my-1 small d-flex flex-row align-items-center justify-context-start"
  >
    <ConfigValue
      :input="inputFor(key)"
      :value="changes[0]"
      :all-values="allValues"
      :env-id="envId"
      :show-label="true"
      :show-empty="true"
    />
    <span class="mx-2 small opacity50">
      <FaIcon icon="arrow-right" />
    </span>
    <ConfigValue
      :input="inputFor(key)"
      :value="changes[1]"
      :all-values="allValues"
      :env-id="envId"
      :show-label="false"
      :show-empty="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type UiSchema } from "@platzio/sdk";
import ConfigValue from "@/components/values/ConfigValue.vue";

const props = defineProps<{
  envId: string;
  uiSchema: UiSchema;
  delta: Record<string, any[]>;
  allValues: Record<string, any[]>;
}>();

const inputFor = computed(() => (id: string) => {
  const inputs = props.uiSchema.inputs || [];
  return inputs.find((input) => input.id === id);
});
</script>
