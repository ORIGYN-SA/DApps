import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, useRoute } from '@dapp/features-authentication'

const NFTPage = () => {
  const { loggedIn, principal, actor, activeWalletProvider, handleLogOut } = useContext(AuthContext);

  useEffect(() => {
    console.log(actor);
    actor?.nft_origyn("637e521bb0fac01c08d5aca8").then(console.log)
  }, [loggedIn, actor])


  return (
    <div></div>
  );
};

export default NFTPage;
