<template>
  <div class="d-flex flex-row align-items-center">
    <img :src="avatarUrl" :class="imgClass" v-if="showAvatar" />
    <div v-if="showName">
      <span :class="nameClass">
        {{ user?.display_name }}
      </span>
    </div>
  </div>
  <div
    class="mt-1 small text-body-secondary"
    v-if="showEmail || showAdmin || showActive"
  >
    <span
      v-if="showActive && user?.is_active === false"
      class="badge bg-secondary me-2"
    >
      INACTIVE
    </span>
    <span v-if="showAdmin && user?.is_admin" class="badge bg-primary me-2">
      ADMIN
    </span>
    <span v-if="showEmail">
      {{ user?.email }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.avatar-lg {
  width: 4rem;
  height: 4rem;
}

.avatar-regular {
  width: 1.5rem;
  height: 1.5rem;
}

.avatar-sm {
  width: 1.25rem;
  height: 1.25rem;
}
</style>

<script setup lang="ts">
import md5 from "md5";
import { computed } from "vue";
import { useStore } from "@/store";

const props = withDefaults(
  defineProps<{
    id: string;
    size?: "normal" | "sm" | "lg";
    showAvatar?: boolean;
    showName?: boolean;
    showEmail?: boolean;
    showAdmin?: boolean;
    showActive?: boolean;
    downloadImgSize?: number;
  }>(),
  {
    size: "normal",
    showAvatar: true,
    showName: false,
    showEmail: false,
    showAdmin: false,
    showActive: false,
    downloadImgSize: 32,
  }
);

const store = useStore();
const user = computed(() => store?.collections.users.getOne(props.id));
const avatarUrl = computed(() =>
  user.value
    ? `https://www.gravatar.com/avatar/${md5(user.value.email)}?s=${
        props.downloadImgSize
      }&d=monsterid`
    : undefined
);
const imgClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "me-1 rounded-circle avatar-sm";
    case "lg":
      return "me-3 rounded-circle avatar-lg";
    default:
      return "me-2 rounded-circle avatar-regular";
  }
});
const nameClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-sm";
    case "lg":
      return "h4";
    default:
      return "";
  }
});
</script>
