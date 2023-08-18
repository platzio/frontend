<template>
    <div class="alert alert-danger" v-if="message">
        <div class="my-1 fw-bold">
            <FaIcon icon="exclamation-circle" fixed-width />
            {{ message }}
        </div>
    </div>
</template>

<script lang="ts">
import { isAxiosError } from "axios";
import { computed, defineComponent } from "vue";

export default defineComponent({
    props: {
        error: {
            required: false,
        },
    },

    setup(props) {
        const message = computed(() => {
            const { error } = props;
            if (!error) {
                return null;
            }
            if (isAxiosError(error)) {
                const { response } = error;
                if (!response) {
                    return null;
                }
                return response.data.message || response.data;
            }
            if (error instanceof Error && error.message) {
                return error.message;
            }
            return error;
        });

        return { message };
    },
});
</script>
