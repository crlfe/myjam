import { access, opendir, readdir, readFile } from "node:fs/promises";
import NodePath from "node:path";
import myjam from "myjam/vite-plugin-myjam";
import { build, defineConfig, type Plugin } from "vite";

/**
 * Copy built examples into dist/examples.
 * @returns the plugin
 */
function copyExamples(): Plugin {
  return {
    name: "copy-examples",
    async generateBundle() {
      /* TODO: Look for a better way to collect the compiled examples.
       * Hopefully one that automatically supports `vite dev`, so we can avoid
       * writing a server middleware.
       */

      const exampleDirs = await readdir(
        NodePath.resolve(import.meta.dirname, "../examples"),
        {
          withFileTypes: true,
        },
      ).then((entries) =>
        entries.flatMap((entry) => {
          if (entry.isDirectory()) {
            return [NodePath.resolve(entry.parentPath, entry.name)];
          }
          return [];
        }),
      );

      for await (const exampleDir of exampleDirs) {
        if (
          await access(NodePath.join(exampleDir, "vite.config.ts")).then(
            () => true,
            () => false,
          )
        ) {
          await build({ root: exampleDir });

          const exampleDistDir = NodePath.join(exampleDir, "dist");
          const exampleDistEntries = await opendir(exampleDistDir, {
            recursive: true,
          });
          for await (const file of exampleDistEntries) {
            if (file.isFile()) {
              const abs = NodePath.resolve(file.parentPath, file.name);
              const rel = NodePath.relative(exampleDistDir, abs);
              this.emitFile({
                type: "asset",
                fileName: NodePath.join(
                  "examples",
                  NodePath.basename(exampleDir),
                  rel,
                ),
                source: await readFile(abs),
              });
            }
          }
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [myjam(), copyExamples()],
  appType: "mpa",
});
