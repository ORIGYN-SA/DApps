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

interface OffersTabProps {
  offersReceived: any[];
  collection: any;
  canisterId: string;
  handleClickOpen: (esc: any, token_id: any) => void;
  handleClickOpenRej: (esc: any) => void;
}

export const OffersReceivedTab = ({
  offersReceived: offers,
  collection,
  canisterId,
  handleClickOpen,
  handleClickOpenRej,
}: OffersTabProps) => {
  return (
    <>
      {offers.length > 0 ? (
        <div>
          <HR marginTop={16} marginBottom={16} />
          <div style={styles.gridContainer}>
            {offers.map((esc: any) => (
              <>
                <div style={styles.gridItem}>
                  <img
                    style={{ width: '42px', height: '42px', borderRadius: '12px' }}
                    src={`https://${canisterId}.raw.ic0.app/-/${esc.token_id}/preview`}
                    alt=""
                  />
                </div>
                <div style={styles.gridItem}>
                  <span>{esc.token_id}</span>
                  <br />
                  <span style={{ color: theme.colors.SECONDARY_TEXT }}>{collection.name}</span>
                </div>
                <div style={styles.gridItem}>
                  <p style={{ color: theme.colors.SECONDARY_TEXT }}>Amount</p>
                  <TokenIcon symbol={esc.token.ic.symbol} />
                  {`${toLargerUnit(Number(esc.amount), Number(esc.token.ic.decimals))}`}
                </div>
                <div style={styles.gridItem}>
                  <Button
                    btnType="filled"
                    size="small"
                    onClick={() => handleClickOpen(esc, esc.token_id)}
                  >
                    Accept
                  </Button>
                </div>
                <div style={styles.gridItem}>
                  <Button btnType="outlined" size="small" onClick={() => handleClickOpenRej(esc)}>
                    Reject
                  </Button>
                </div>
              </>
            ))}
          </div>
        </div>
      ) : (
        <>
          <HR marginTop={16} marginBottom={16} />
          <p>
            <b>No offers received yet</b>
          </p>
        </>
      )}
    </>
  );
};
