<template>
  <div v-if="config">
    <div v-if="uiSchema">
      <div v-for="input in uiSchema.inputs" :key="input.id" class="mt-2">
        <ConfigValue
          :input="input"
          :env-id="envId"
          :value="config[input.id]"
          :all-values="config"
        />
      </div>
    </div>

    <div v-else>
      <YamlContent :config="config" />
    </div>
  </div>

  <div v-if="valuesOverride && Object.keys(valuesOverride).length" class="my-3">
    <YamlContent header="Values Override" :config="valuesOverride" />
  </div>
</template>

<script setup lang="ts">
import { type UiSchema } from "@platzio/sdk";
import ConfigValue from "@/components/values/ConfigValue.vue";
import YamlContent from "./YamlContent.vue";

defineProps<{
  envId: string;
  uiSchema?: UiSchema | null;
  config: Record<string, any>;
  valuesOverride?: object;
}>();
</script>
