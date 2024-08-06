import { useDebug } from '@dapp/features-debug-provider';
import { AuthContext } from '@dapp/features-authentication';
import { OdcDataWithSale, toLargerUnit } from '@dapp/utils';
import React, { useContext, useEffect, useState } from 'react';
import { Flex, Button, Container, theme } from '@origyn/origyn-art-ui';
import { BalanceResponse, OrigynError } from '@origyn/mintjs';
import { EscrowType } from '../../../modals/StartEscrowModal';

export interface OffersPanelProps {
  odc: OdcDataWithSale;
  onOpenEscrowModal: (escrowType: EscrowType) => void;
  inProcess: boolean;
}

export const OffersPanel = ({ odc, onOpenEscrowModal, inProcess }: OffersPanelProps) => {
  const debug = useDebug();
  const { principal, actor } = useContext(AuthContext);
  const [existingOffer, setExistingOffer] = useState<any | null | undefined>(undefined);

  const compareOfferSentWithSelectedToken = async () => {
    if (!principal) {
      debug.log('No principal');
      return;
    }

    try {
      const balance = await actor?.balance_of_nft_origyn({ principal });
      if (!balance){
        debug.log('Balance is undefined');
        return;
      }
      if ('err' in balance) {
        const error: OrigynError = balance.err;
        debug.log('error', error);
      } else {
        const balanceResponse: BalanceResponse = balance.ok;
        const escrowsSent = balanceResponse?.escrow;
        const offersSent = escrowsSent?.filter((element) => element.sale_id.length === 0);
        debug.log('offersSent', offersSent);

        const existingOffer = offersSent?.filter((offer) => offer.token_id === odc.id);
        if (existingOffer.length > 0) {
          setExistingOffer(existingOffer[0]);
        } else {
          setExistingOffer(null);
        }
      }
    } catch (e) {
      debug.log(e);
    }
  };

  const getOfferAmount = (offer) => {
    return `${toLargerUnit(offer.amount.toString(), offer.token.ic.decimals).toFixed()} ${
      offer.token.ic.symbol
    }`;
  };

  useEffect(() => {
    compareOfferSentWithSelectedToken();
  }, [odc]);

  return (
    <>
      {existingOffer ? (
        <Container padding='12'>
          <Flex flexFlow="column" gap={16}>
            <Flex>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: theme.colors.SECONDARY_TEXT,
                }}
              >
                You have made an offer of {getOfferAmount(existingOffer)} which has not been
                accepted or declined by the owner. You can make a new offer by withdrawing your
                current offer.
              </p>
            </Flex>
          </Flex>
        </Container>
      ) : (
        <>
          {existingOffer === null && (
            <Button
              onClick={() => onOpenEscrowModal('Offer')}
              disabled={inProcess}
            >
              Make an Offer
            </Button>
          )}
        </>
      )}
    </>
  );
};
