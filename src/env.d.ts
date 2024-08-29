/// <reference path="../.astro/types.d.ts" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="./client.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_NFT_CANISTER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}