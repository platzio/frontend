<template>
    <div class="d-flex flex-row align-items-center">
        <img :src="avatarUrl" :class="imgClass" v-if="showAvatar" />
        <div v-if="showName">
            <span :class="nameClass">
                {{ user.display_name }}
            </span>
        </div>
    </div>
    <div class="mt-1 small text-body-secondary" v-if="showEmail || showAdmin">
        <span v-if="showAdmin && user.is_admin" class="badge bg-primary me-2">
            ADMIN
        </span>
        <span v-if="showEmail">
            {{ user.email }}
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

<script lang="ts">
import md5 from "md5";
import { useStore } from "@/store";
import { computed, defineComponent } from "vue";

export default defineComponent({
    props: {
        id: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            default: "normal",
        },
        showAvatar: {
            type: Boolean,
            default: true,
        },
        showName: {
            type: Boolean,
            default: false,
        },
        showEmail: {
            type: Boolean,
            default: false,
        },
        showAdmin: {
            type: Boolean,
            default: false,
        },
        downloadImgSize: {
            type: Number,
            default: 32,
        },
    },

    setup(props) {
        const store = useStore();
        const user = computed(() => store!.collections.users.getOne(props.id));
        const avatarUrl = computed(
            () =>
                `https://www.gravatar.com/avatar/${md5(user.value.email)}?s=${
                    props.downloadImgSize
                }&d=monsterid`
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

        return {
            user,
            avatarUrl,
            imgClass,
            nameClass,
        };
    },
});
</script>
