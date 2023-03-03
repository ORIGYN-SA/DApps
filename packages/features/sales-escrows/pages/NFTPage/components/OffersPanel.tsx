/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/dot-notation */
import { useDebug } from '@dapp/features-debug-provider';
import { AuthContext } from '@dapp/features-authentication';

import { OdcDataWithSale, toLargerUnit } from '@dapp/utils';
import React, { useContext, useEffect, useState } from 'react';
import { Flex, Button, Container, theme } from '@origyn-sa/origyn-art-ui';
import { BalanceResponse, OrigynError } from '../../../../../common/types/src/origynNftReference';

import { EscrowType } from '../../../modals/StartEscrowModal';

export interface OffersPanelProps {
  odc: OdcDataWithSale;
  onOpenEscrowModal: (escrowType: EscrowType) => void;
}

export const OffersPanel = ({ odc, onOpenEscrowModal }: OffersPanelProps) => {
  const debug = useDebug();
  const { principal, actor } = useContext(AuthContext);
  const [existingOffer, setExistingOffer] = useState<any | null>(null);

  const compareOfferSentWithSelectedToken = async () => {
    try {
      const balance = await actor?.balance_of_nft_origyn({ principal });
      if ('err' in balance) {
        const error: OrigynError = balance.err;
        debug.log('error', error);
      } else {
        const balanceResponse: BalanceResponse = balance.ok;
        const escrowsSent = balanceResponse?.escrow;
        const offersSent = escrowsSent?.filter((element) => element.sale_id.length === 0);
        debug.log('offersSent', offersSent);
        if (offersSent?.filter((offer) => offer.token_id === odc.id).length > 0) {
          setExistingOffer(existingOffer[0]);
        }
      }
    } catch (e) {
      debug.log(e);
    }
  };

  useEffect(() => {
    compareOfferSentWithSelectedToken();
  }, [odc]);

  return (
    <>
      {existingOffer ? (
        <Container padding={12}>
          <Flex flexFlow="column" gap={16}>
            <Flex>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: theme.colors.SECONDARY_TEXT,
                }}
              >
                You have made an offer of{' '}
                {toLargerUnit(
                  Number(existingOffer.amount),
                  Number(existingOffer.token?.ic?.decimals),
                )}{' '}
                {existingOffer.token.ic.symbol} which has not been accepted or declined by the
                owner. You can make a new offer by withdrawing your current offer.
              </p>
            </Flex>
          </Flex>
        </Container>
      ) : (
        <Button btnType="accent" onClick={() => onOpenEscrowModal('Offer')}>
          Make an Offer
        </Button>
      )}
    </>
  );
};
