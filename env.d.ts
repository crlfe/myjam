/// <reference types="vite/client" />

declare module "*.module.css" {
  const names: readonly Record<string, string>;
  export default names;
}

declare module "*.glsl" {
  const content: string;
  export default content;
}

declare module "*.wat" {
  export default async function (
    imports?: Record<string, unknown>,
  ): Promise<WebAssembly.Instance>;
}
