import { type Bot, type NewBot, type UpdateBot } from "@platzio/sdk";
import { createCollection } from "./collection";

export const createBotsCollection = () =>
  createCollection<Bot, NewBot, Bot, UpdateBot>({
    url: "/api/v2/bots",

    sortFunc(x, y) {
      return x.display_name.localeCompare(y.display_name);
    },

    formatItem: (item: Bot) => ({
      inputLabel: false,
      icon: "robot",
      text: item.display_name,
    }),
  });
