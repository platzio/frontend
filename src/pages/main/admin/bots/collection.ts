import { createCollection } from "@/store/models/collection";
import {
  type CreateBotToken,
  type CreatedBotToken,
  type BotToken,
} from "@platzio/sdk";

export const botTokens = createCollection<
  BotToken,
  CreateBotToken,
  CreatedBotToken,
  void
>({
  url: "/api/v2/bot-tokens",

  sortFunc(x, y) {
    return x.created_at.localeCompare(y.created_at);
  },

  formatItem: (item: BotToken) => ({
    inputLabel: false,
    icon: "key",
    text: item.created_at,
  }),
});
