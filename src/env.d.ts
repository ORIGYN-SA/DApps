/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_NFT_CANISTER_ID: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }