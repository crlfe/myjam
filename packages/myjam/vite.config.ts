import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: "./src/index.ts",
      formats: ["cjs", "es"],
    },
  },
});
