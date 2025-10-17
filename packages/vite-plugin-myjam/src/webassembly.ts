import { Rollup } from "vite";

/**
 * Loads a WebAssembly text file.
 * @param code the source wat code
 * @param id the source filename
 * @returns the minified shader code
 */
export async function loadWebAssemblyText(
  code: string,
  id: string,
): Promise<Rollup.TransformResult> {
  const wabt = await (await import("wabt")).default();

  const module = wabt.parseWat(id, code, { threads: true });
  // TOOD: Figure out why this doesn't see the threads=true: module.validate();

  const { buffer } = module.toBinary({});

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
