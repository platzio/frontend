import { CollectionItem, createCollection } from "@/store/models/collection";

export interface UserToken extends CollectionItem {
    user_id: string;
    created_at: string;
    created_token: string;
}

export interface CreatedToken {
    created_token: string;
}

export const userTokens = createCollection<UserToken>({
    url: "/api/v2/user-tokens",

    sortFunc(x, y) {
        return x.created_at.localeCompare(y.created_at);
    },

    formatItem: (item: UserToken) => ({
        icon: "key",
        text: item.created_at,
    }),
});
