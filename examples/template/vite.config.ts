import myjam from "myjam/vite-plugin-myjam";
import { defineConfig, type Plugin } from "vite";

export default defineConfig({
  base: "",
  plugins: [
    // TODO: Investigate why these Plugin types do not match.
    myjam() as unknown as Plugin,
  ],
});
