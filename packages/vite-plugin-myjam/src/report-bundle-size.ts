import * as NodeUtil from "node:util";
import * as NodeZlib from "node:zlib";
import { type Rollup } from "vite";

const brotliCompress = NodeUtil.promisify(NodeZlib.brotliCompress);
const gzip = NodeUtil.promisify(NodeZlib.gzip);

/**
 * Formats a file size to human-readable units.
 * @param sizeInBytes the size in bytes
 * @returns the formatted size in B, KiB, or MiB
 */
function formatSize(sizeInBytes: number): string {
  if (sizeInBytes > 5e6) {
    return `${(sizeInBytes / 1e6).toFixed(2)} MiB`;
  } else if (sizeInBytes > 5e3) {
    return `${(sizeInBytes / 1e3).toFixed(2)} KiB`;
  } else {
    return `${sizeInBytes} B`;
  }
}

/**
 * Reports the total size of the generated bundle, uncompressed and compressed.
 * @param bundle the bundle
 * @returns the report
 */
export async function reportBundleSize(
  bundle: Rollup.OutputBundle,
): Promise<string> {
  let totalSize = 0;
  let gzipSize = 0;
  let brSize = 0;
  for (const item of Object.values(bundle)) {
    let data: string | Uint8Array;
    if (item.type === "chunk") {
      data = item.code;
    } else {
      data = item.source;
    }

    totalSize += data.length;
    gzipSize += (await gzip(data, { level: 9 })).length;
    brSize += (await brotliCompress(data)).length;
  }
  return [
    `Total ${formatSize(totalSize)}`,
    `gzip: ${formatSize(gzipSize)}`,
    `br: ${formatSize(brSize)}\n`,
  ].join(" | ");
}
