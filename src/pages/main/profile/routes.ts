import { type RouteRecordRaw } from "vue-router";
import UserProfile from "./UserProfile.vue";
import YourProfile from "./YourProfile.vue";
import UserTokens from "./user-tokens/UserTokens.vue";

const children: RouteRecordRaw[] = [
  {
    name: "profile.you",
    path: "you",
    component: YourProfile,
  },
  {
    name: "profile.user-tokens",
    path: "user-tokens",
    component: UserTokens,
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
