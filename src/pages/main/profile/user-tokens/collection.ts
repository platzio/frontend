import { createCollection } from "@/store/models/collection";
import { CreateUserToken, CreatedUserToken, UserToken } from "@platzio/sdk";

export const userTokens = createCollection<
    UserToken,
    CreateUserToken,
    CreatedUserToken,
    void
>({
    url: "/api/v2/user-tokens",

    sortFunc(x, y) {
        return x.created_at.localeCompare(y.created_at);
    },

    formatItem: (item: UserToken) => ({
        icon: "key",
        text: item.created_at,
    }),
});
