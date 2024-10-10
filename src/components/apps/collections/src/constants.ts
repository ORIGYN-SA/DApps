export const APP_MODE = import.meta.env.MODE;
export const GLD_NFT_1G_CANISTER_ID = import.meta.env.PUBLIC_GLD_NFT_1G_CANISTER_ID;
export const GLD_NFT_10G_CANISTER_ID = import.meta.env.PUBLIC_GLD_NFT_10G_CANISTER_ID;
export const GLD_NFT_100G_CANISTER_ID = import.meta.env.PUBLIC_GLD_NFT_100G_CANISTER_ID;
export const GLD_NFT_1000G_CANISTER_ID = import.meta.env.PUBLIC_GLD_NFT_1000G_CANISTER_ID;
export const OGY_LEDGER_CANISTER_ID = import.meta.env.PUBLIC_OGY_LEDGER_CANISTER_ID;
export const SWAP_CANISTER_ID = import.meta.env.PUBLIC_SWAP_CANISTER_ID;
export const GLDT_LEDGER_CANISTER_ID = import.meta.env.PUBLIC_GLDT_LEDGER_CANISTER_ID;
export const ICP_SWAP_CANISTER_ID = import.meta.env.PUBLIC_ICP_SWAP_CANISTER_ID;
export const LOGO_CANISTER_ID = import.meta.env.PUBLIC_LOGO_CANISTER_ID;
export const ICPSWAP_TOKENS_CANISTER_ID = import.meta.env.PUBLIC_ICPSWAP_TOKENS_CANISTER_ID;
export const COLLECTIONS_INDEX_CANISTER_ID = import.meta.env.PUBLIC_COLLECTIONS_INDEX;

export const API_OGY_BASE_URL = 'https://api.origyn.com';

export const OGY_TX_FEE = 200000;
export const GLDT_TX_FEE = 1000000;
export const GLDT_DECIMAL = 100000000;
export const REVERSE_GLDT_TX_FEE = 100000000;
export const GLDT_VALUE_1G_NFT = 100;

if (!(APP_MODE === 'production')) {
  console.log(`APP_MODE=${APP_MODE}`);

  if (!GLD_NFT_1G_CANISTER_ID)
    console.log(
      'No GLD_NFT_1G_CANISTER_ID environment variable. Set GLD_NFT_1G_CANISTER_ID environment variable.',
    );
  else console.log(`GLD_NFT_1G_CANISTER_ID=${GLD_NFT_1G_CANISTER_ID}`);

  if (!GLD_NFT_10G_CANISTER_ID)
    console.log(
      'No GLD_NFT_10G_CANISTER_ID environment variable. Set GLD_NFT_10G_CANISTER_ID environment variable.',
    );
  else console.log(`GLD_NFT_10G_CANISTER_ID=${GLD_NFT_10G_CANISTER_ID}`);

  if (!GLD_NFT_100G_CANISTER_ID)
    console.log(
      'No GLD_NFT_100G_CANISTER_ID environment variable. Set GLD_NFT_100G_CANISTER_ID environment variable.',
    );
  else console.log(`GLD_NFT_100G_CANISTER_ID=${GLD_NFT_100G_CANISTER_ID}`);

  if (!GLD_NFT_1000G_CANISTER_ID)
    console.log(
      'No GLD_NFT_1000G_CANISTER_ID environment variable. Set GLD_NFT_1000G_CANISTER_ID environment variable.',
    );
  else console.log(`GLD_NFT_1000G_CANISTER_ID=${GLD_NFT_1000G_CANISTER_ID}`);

  if (!OGY_LEDGER_CANISTER_ID)
    console.log(
      'No OGY_LEDGER_CANISTER_ID environment variable. Set OGY_LEDGER_CANISTER_ID environment variable.',
    );
  else console.log(`OGY_LEDGER_CANISTER_ID=${OGY_LEDGER_CANISTER_ID}`);

  if (!SWAP_CANISTER_ID)
    console.log(
      'No SWAP_CANISTER_ID environment variable. Set SWAP_CANISTER_ID environment variable.',
    );
  else console.log(`SWAP_CANISTER_ID=${SWAP_CANISTER_ID}`);

  if (!GLDT_LEDGER_CANISTER_ID)
    console.log(
      'No GLDT_LEDGER_CANISTER_ID environment variable. Set GLDT_LEDGER_CANISTER_ID environment variable.',
    );
  else console.log(`GLDT_LEDGER_CANISTER_ID=${GLDT_LEDGER_CANISTER_ID}`);

  if (!ICP_SWAP_CANISTER_ID)
    console.log(
      'No ICP_SWAP_CANISTER_ID environment variable. Set ICP_SWAP_CANISTER_ID environment variable.',
    );
  else console.log(`ICP_SWAP_CANISTER_ID=${ICP_SWAP_CANISTER_ID}`);

  if (!LOGO_CANISTER_ID)
    console.log(
      'No LOGO_CANISTER_ID environment variable. Set LOGO_CANISTER_ID environment variable.',
    );
  else console.log(`LOGO_CANISTER_ID=${LOGO_CANISTER_ID}`);
  if (!ICPSWAP_TOKENS_CANISTER_ID)
    console.log(
      'No ICPSWAP_TOKENS_CANISTER_ID environment variable. Set ICPSWAP_TOKENS_CANISTER_ID environment variable.',
    );
  else console.log(`ICPSWAP_TOKENS_CANISTER_ID=${ICPSWAP_TOKENS_CANISTER_ID}`);
}
