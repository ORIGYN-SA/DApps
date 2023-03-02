import React from 'react';
import { Button, HR, theme } from '@origyn-sa/origyn-art-ui';
import { toLargerUnit } from '@dapp/utils';
import { TokenIcon } from '@dapp/features-components';

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '42px 2fr repeat(3, 1fr)',
    gap: '8px',
    backgroundColor: 'inherit',
    color: 'inherit',
  },
  gridItem: {
    marginBottom: 'auto',
    marginTop: 'auto',
    verticalAlign: 'middle',
  },
};

interface OffersSentTabProps {
  offersSent: any[];
  collection: any;
  canisterId: string;
  withdrawEscrow: (esc: any, token_id: any) => void;
}

export const OffersSentTab = ({
  offersSent,
  collection,
  canisterId,
  withdrawEscrow,
}: OffersSentTabProps) => {
  return (
    <>
      {offersSent.length > 0 ? (
        <div>
          <HR marginTop={16} marginBottom={16} />
          <div style={styles.gridContainer}>
            {offersSent.map((esc: any, index: number) => (
              <>
                <div key={index} style={styles.gridItem}>
                  <img
                    style={{
                      width: '42px',
                      borderRadius: '12px',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                    }}
                    src={`https://${canisterId}.raw.ic0.app/-/${esc.token_id}/preview`}
                    alt=""
                  />
                </div>
                <div style={styles.gridItem}>
                  <div>
                    <p>{esc.token_id}</p>
                  </div>

                  <span style={{ color: theme.colors.SECONDARY_TEXT }}>{collection.name}</span>
                </div>
                <div style={styles.gridItem}>
                  <span style={{ color: theme.colors.SECONDARY_TEXT }}>Amount</span>
                  <br />
                  <div>
                    <TokenIcon symbol={esc.token.ic.symbol} />
                    <span>{`${toLargerUnit(
                      Number(esc.amount),
                      Number(esc.token.ic.decimals),
                    )}`}</span>
                  </div>
                </div>
                <div style={styles.gridItem}>
                  <span style={{ color: theme.colors.SECONDARY_TEXT }}>Status</span>
                  <br />
                  <span>
                    {esc.lock_to_date
                      ? Date.now() * 1e6 > parseInt(esc.lock_to_date)
                        ? 'Locked'
                        : 'Done'
                      : 'Lock date not present'}
                  </span>
                </div>
                <div style={styles.gridItem}>
                  {Date.now() * 1e6 > parseInt(esc.lock_to_date) ? (
                    <Button
                      btnType="filled"
                      size="small"
                      onClick={() => withdrawEscrow(esc, esc.token_id)}
                      disabled
                    >
                      Withdraw
                    </Button>
                  ) : (
                    <Button
                      btnType="filled"
                      size="small"
                      onClick={() => withdrawEscrow(esc, esc.token_id)}
                    >
                      Withdraw
                    </Button>
                  )}
                </div>
              </>
            ))}{' '}
          </div>
        </div>
      ) : (
        <>
          <HR marginTop={16} marginBottom={16} />
          <p>
            <b>No offers sent yet</b>
          </p>
        </>
      )}
    </>
  );
};
