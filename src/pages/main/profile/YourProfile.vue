<template>
    <div>
        <div class="mb-4">
            <div class="d-flex flex-row align-items-center">
                <PlatzUser
                    :id="user.id"
                    :show-name="false"
                    size="lg"
                    :download-img-size="128"
                />
                <div class="flex-fill">
                    <div class="my-0 h3 fw-bold">
                        {{ user.display_name }}
                    </div>
                    <div class="mt-1">
                        {{ user.email }}
                    </div>
                </div>
            </div>
        </div>
        <div class="my-2">
            <FaIcon :icon="['far', 'id-card']" fixed-width />
            <samp class="ms-1">{{ user.id }}</samp>
        </div>
        <div class="my-2">Joined <PlatzMoment :value="user.created_at" /></div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import PlatzMoment from "@/components/base/PlatzMoment.vue";
import PlatzUser from "@/components/PlatzUser.vue";

export default defineComponent({
    components: {
        PlatzMoment,
        PlatzUser,
    },

    props: {
        userId: {
            type: String,
            required: false,
        },
    },

    setup(props) {
        const store = useStore();
        const curUser = computed(() => store!.auth.curUser!);
        const user = computed(() =>
            props.userId
                ? store!.collections.users.getOne(props.userId)
                : curUser.value
        );

        return {
            user,
            curUser,
        };
    },
});
</script>
