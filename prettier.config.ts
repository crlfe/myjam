import { fileURLToPath } from "node:url";
import { type Config } from "prettier";

/* Hit serialization errors when specifying a plugin object. This ridiculous
 * hack allows us to pass a string while still pointing to our own dependency.
 */
const sortImports = fileURLToPath(
  import.meta
    .resolve("./node_modules/@ianvs/prettier-plugin-sort-imports/lib/src/index.js"),
);

export const defineConfig = (config: Config) => config;

export default defineConfig({
  plugins: [sortImports],
});
