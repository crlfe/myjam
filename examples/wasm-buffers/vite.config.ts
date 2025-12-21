import myjam from "myjam/vite-plugin-myjam";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [myjam()],
  base: "",
});
