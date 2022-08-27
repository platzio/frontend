<template>
  <router-link
    class="list-group-item list-group-item-action d-flex flex-row align-items-center justify-content-between"
  >
    <div class="w-100">
      <slot />
    </div>
    <div class="ms-3">
      <FaIcon icon="chevron-right" fixed-width />
    </div>
  </router-link>
</template>
