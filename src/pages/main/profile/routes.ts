import { RouteRecordRaw } from "vue-router";
import UserProfile from "./UserProfile.vue";
import YourProfile from "./YourProfile.vue";

const children: RouteRecordRaw[] = [
    {
        name: "profile.you",
        path: "you",
        component: YourProfile,
    },
];

const routes: RouteRecordRaw[] = [
    {
        name: "profile",
        path: "/profile",
        component: UserProfile,
        children,
        redirect: { name: children[0].name },
    },
];

export default routes;
