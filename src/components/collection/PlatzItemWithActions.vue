<template>
    <PlatzCollectionItem
        class="d-flex flex-row align-items-center justify-content-between"
    >
        <div class="flex-fill">
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
                <FaIcon icon="ellipsis-v" fixed-width />
            </a>
            <ul class="dropdown-menu">
                <slot name="actions" />
            </ul>
        </div>
    </PlatzCollectionItem>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PlatzCollectionItem from "./PlatzCollectionItem.vue";

export default defineComponent({
    components: {
        PlatzCollectionItem,
    },
});
</script>
