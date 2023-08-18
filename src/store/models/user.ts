import { UpdateUser, User } from "@platzio/sdk";
import { createCollection } from "./collection";

export const createUsersCollection = () =>
    createCollection<User, void, User, UpdateUser>({
        url: "/api/v2/users",

        sortFunc(x, y) {
            return x.display_name.localeCompare(y.display_name);
        },

        formatItem: (item: User) => ({
            icon: "user",
            text: item.display_name,
        }),
    });
