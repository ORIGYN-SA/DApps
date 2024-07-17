
export const getStaticPaths = () => {
  const canister_id: string = (import.meta as any).env.NFT_CANISTER_ID;
  return [
    { params: { param1: '-', param2: canister_id, param3: '-' } }
  ];
};