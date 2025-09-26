import { Plugin } from "vite";

export default (): Plugin => {
  const cache = new Map<string, string>();
  return {
    name: "short-css-names",
    config() {
      return {
        css: {
          modules: {
            generateScopedName(name, filename) {
              const key = `${filename}#${name}`;
              let value = cache.get(key);
              if (!value) {
                value = makeShortName(cache.size);
                cache.set(key, value);
              }
              return value;
            },
          },
        },
      };
    },
  };
};

function makeShortName(index: number): string {
  const BASE62 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "0123456789";
  let name = "c";
  do {
    name += BASE62[index % 62];
    index = Math.floor(index / 62);
  } while (index > 0);
  return name;
}
