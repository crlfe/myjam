import { Rollup } from "vite";

import binaryen from "binaryen";

/**
 * Loads a WebAssembly text file.
 * @param code the source wat code
 * @returns the minified shader code
 */
export async function loadWebAssemblyText(
  code: string,
): Promise<Rollup.TransformResult> {
  binaryen.setOptimizeLevel(2);
  binaryen.setShrinkLevel(1);

  const module = binaryen.parseText(code);
  module.setFeatures(binaryen.Features.Atomics | binaryen.Features.SIMD128);
  if (!module.validate()) {
    throw new Error("Failed to validate WebAssemble Text code");
  }
  module.optimize();

  const buffer = module.emitBinary();

  // TODO: Should use this.emitFile in production mode to avoid base64 overhead.
  const data = JSON.stringify(
    `data:application/wasm;base64,` + Buffer.from(buffer).toString("base64"),
  );

  return {
    code: [
      `const module = await WebAssembly.compileStreaming(fetch(${data}), {});`,
      `export default (imports) => WebAssembly.instantiate(module, imports);`,
    ].join("\n"),
  };
}
