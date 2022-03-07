<template>
  <CollectionItem
    class="d-flex flex-row align-items-center justify-content-between"
  >
    <div class="w-100">
      <slot name="contents" />
    </div>
    <div class="dropdown">
      <a
        class="btn btn-link no-outline"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <fa icon="ellipsis-v" fixed-width />
      </a>
      <ul class="dropdown-menu">
        <slot name="actions" />
      </ul>
    </div>
  </CollectionItem>
</template>
