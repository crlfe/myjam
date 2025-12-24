import { debugNotNull } from "myjam";
import summer from "./summer.wat";

const status = <div>Loading...</div>;
document.body.append(
  <a href="https://github.com/crlfe/myjam/blob/main/examples/wasm-buffers/src/main.ts">
    View Source
  </a>,
  status,
);

const main = async () => {
  status.textContent = "Loading code...";
  const memory = new WebAssembly.Memory({
    initial: 1,
    maximum: 1,
    shared: true,
  });

  const module = await summer({ env: { memory } });

  status.textContent = "Loading data...";

  const bufferLen = 4096;
  const bufferSize = 2 * bufferLen;
  const in0Addr = 0;
  const in1Addr = in0Addr + bufferSize;
  const outAddr = in1Addr + bufferSize;

  const in0 = new Uint16Array(memory.buffer, in0Addr, bufferLen);
  const in1 = new Uint16Array(memory.buffer, in1Addr, bufferLen);
  const out = new Uint16Array(memory.buffer, outAddr, bufferLen);

  for (let i = 0; i < bufferLen; i += 1) {
    in0[i] = Math.floor(Math.random() * 65536);
    in1[i] = Math.floor(Math.random() * 65536);
    out[i] = 0;
  }

  const process = module.exports["process"] as (
    in0Addr: number,
    in1Addr: number,
    outAddr: number,
    len: number,
  ) => void;
  process(in0Addr, in1Addr, outAddr, bufferLen);

  status.textContent = "Checking...";

  let errors = 0;
  for (let i = 0; i < bufferLen; i += 1) {
    const expect = Math.min(65535, debugNotNull(in0[i]) + debugNotNull(in1[i]));
    if (out[i] !== expect) {
      console.log(out[i], in0[i], in1[i]);
      errors += 1;
    }
  }

  status.textContent = `SIMD sum finished with ${errors} errors.`;
};

main().catch((err) => {
  status.textContent = String(err);
});
