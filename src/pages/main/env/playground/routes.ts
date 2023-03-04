import { RouteRecordRaw } from "vue-router";
import PlaygroundMain from "./PlaygroundMain.vue";

const children: RouteRecordRaw[] = [];

const routes: RouteRecordRaw[] = [
    {
        name: "playground",
        path: "playground",
        component: PlaygroundMain,
        children,
    },
];

export default routes;
