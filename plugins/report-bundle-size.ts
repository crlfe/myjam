import * as NodeUtil from "node:util";
import * as NodeZlib from "node:zlib";
import { Plugin } from "vite";

const brotliCompress = NodeUtil.promisify(NodeZlib.brotliCompress);
const gzip = NodeUtil.promisify(NodeZlib.gzip);

export default (): Plugin => {
  return {
    name: "report-bundle-size",
    async writeBundle(_options, bundle) {
      let totalSize = 0;
      let gzipSize = 0;
      let brSize = 0;
      for (const item of Object.values(bundle)) {
        const data = Buffer.from(
          item.type === "chunk" ? item.code : item.source,
        );

        totalSize += data.length;
        gzipSize += (await gzip(data, { level: 9 })).length;
        brSize += (await brotliCompress(data)).length;
      }
      console.log(
        `Total ${formatSize(totalSize)}`,
        `| gzip: ${formatSize(gzipSize)}`,
        `| br: ${formatSize(brSize)}`,
      );
      console.log();
    },
  };
}

function formatSize(sizeInBytes: number): string {
  if (sizeInBytes > 5e3) {
    return (sizeInBytes / 1e3).toFixed(2) + " KiB";
  } else {
    return sizeInBytes + " B";
  }
}
