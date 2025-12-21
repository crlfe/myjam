import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  entry: ["src/eslint.config.ts", "src/prettier.config.ts"],
  platform: "neutral",
});
