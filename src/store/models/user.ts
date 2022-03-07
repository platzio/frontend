import { CollectionItem, createCollection } from './collection'

export interface User extends CollectionItem {
    created_at: string;
    display_name: string;
    email: string;
    is_admin: boolean;
}

export const collection = createCollection<User>({
    url: '/api/v1/users',

    sortFunc(x, y) {
        return x.display_name.localeCompare(y.display_name)
    },

    formatItem: (item: User) => ({
        icon: 'user',
        text: item.display_name,
    })
})
