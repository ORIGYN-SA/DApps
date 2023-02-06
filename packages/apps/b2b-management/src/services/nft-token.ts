export const getCertificates = async (page: number) => {
  const request = await fetch(
    `https://development.canister.origyn.ch/canister/v0/nft-token?sortKey=createdAt&sortDirection=-1&skip=${
      30 * (page - 1)
    }`,
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // TODO: We will need to save the accessToken within a context that
        // wraps the whole application and have a useAuthContext() in every
        // smart-component to get the accessToken (still silly)
        'x-access-token': localStorage.getItem('apiKey'),
      },
    },
  );
  const response = await request.json();
  return response;
};

export const getCertificateMetadata = async (tokenId: string) => {
  const request = await fetch(
    `https://development.canister.origyn.ch/canister/v0/nft-token/${tokenId}/metadata`,
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-access-token': localStorage.getItem('apiKey'),
      },
    },
  );
  const response = await request.json();
  return response;
};
