import process from "process";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const { PLATZ_BACKEND = "http://127.0.0.1:3000" } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  server: {
    host: "127.0.0.1",
    proxy: {
      "^/api": {
        target: PLATZ_BACKEND,
        ws: true,
        headers: {
          host: new URL(PLATZ_BACKEND).host,
        },
      },
    },
  },
});
