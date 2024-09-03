import { Principal } from '@dfinity/principal';
import type { EscrowRecord, NFTInfoStable, PropertyShared } from '@origyn/mintjs';
import {
  DisplayProperty,
  OdcData,
  OdcDataWithSale,
  Royalty,
  RoyaltyType,
  ReceivedActiveBidsProps,
} from './interfaces';
import { toSentenceCase } from './string';
import { toBigNumber } from './number';
import * as T from '@origyn/mintjs';

export function getProperty(properties: any, propertyName: string) {
  return properties?.find(({ name }) => name === propertyName);
}

export function getTextValue(properties: PropertyShared[], propertyName: string): string {
  const p = getProperty(properties, propertyName);
  return p?.value?.Text || '';
}

const getPrincipalValue = (properties: any, propertyName: string): string => {
  const p = getProperty(properties, propertyName);
  return p?.value?.Principal?.toText() || '';
};

export function isCandyClassOrArray(candy: PropertyShared): boolean {
  return !!(candy.value?.['Class'] || candy.value?.['Array']);
}

export function candyValueToString(candy: PropertyShared) {
  if (candy.value) {
    const v = candy.value;
    return (
      v['Text'] ||
      v['Nat'] ||
      v['Nat8'] ||
      v['Nat16'] ||
      v['Nat32'] ||
      v['Nat64'] ||
      v['Int'] ||
      v['Int8'] ||
      v['Int16'] ||
      v['Int32'] ||
      v['Int64'] ||
      v['Float'] ||
      v['Bool'] ||
      v['Principal']?.toText() ||
      ''
    ).toString();
  }
  return '';
}

function initOdcData(): OdcData {
  return {
    id: '',
    ownerPrincipalId: '',
    originatorPrincipalId: '',
    nodePrincipalId: '',
    networkPrincipalId: '',

    hasPrimaryAsset: false,
    hasPreviewAsset: false,
    hasHiddenAsset: false,
    hasExperienceAsset: false,
    primaryRoyalties: [],
    secondaryRoyalties: [],

    collectionId: '',
    displayName: '',
    description: '',
    displayProperties: [],
    socialLinks: [],
  };
}

function initOdcSaleData(odc: OdcData): OdcDataWithSale {
  return {
    ...odc,
    auction: undefined,
    isDutchAuction: false,
    auctionOpen: false,
    auctionClosed: false,
    auctionNotStarted: false,
    buyNow: 0,
    minIncreaseAmount: 0n,
    minIncreasePercentage: 0,
    currentBid: 0,
    token: undefined,
    tokenSymbol: 'OGY',
    saleId: '',
    startPrice: 0,
    reserve: 0,
    decayPerHour: 0,
  };
}

function parseRoyalties(metadataClass: PropertyShared[], royaltyType: RoyaltyType): Royalty[] {
  let royalties: Royalty[] = [];

  const name =
    royaltyType === RoyaltyType.primary
      ? 'com.origyn.royalties.primary'
      : 'com.origyn.royalties.secondary';

  const systemProperties = metadataClass?.find((p) => p.name === '__system')?.value?.[
    'Class'
  ] as PropertyShared[];

  if (systemProperties) {
    const royalties = systemProperties.find((p) => p.name === name)?.value?.['Array'] as {
      Class: PropertyShared[];
    }[];
    if (royalties) {
      return royalties.map((c) => {
        const tag = (c.Class.find((p) => p.name === 'tag')?.value?.['Text'] as string) || '';
        const rate = (c.Class.find((p) => p.name === 'rate')?.value?.['Float'] as number) || 0;
        return { tag, rate };
      });
    }
  }

  return royalties;
}

function toKeysValues(
  property: PropertyShared,
  keyName: string,
  valueName: string,
): { key: string; value: string }[] {
  const keysValues: { key: string; value: string }[] = [];

  if ('Array' in (property.value ?? {})) {
    const candyArray = (property.value as { Array?: any[] })?.Array ?? [];

    candyArray.forEach((item: any) => {
      if (item.value && 'Class' in item.value) {
        const candyClass = item.value.Class as PropertyShared[];
        let key: string = '';
        let value: string = '';
        candyClass.forEach((p: PropertyShared) => {
          if (p.name === keyName) {
            key = candyValueToString(p);
          } else if (p.name === valueName) {
            value = candyValueToString(p);
          }
        });
        if (key) {
          keysValues.push({ key, value });
        }
      } else {
        const candyClass = item.Class as PropertyShared[];
        let key: string = '';
        let value: string = '';
        candyClass.forEach((p: PropertyShared) => {
          if (p.name === keyName) {
            key = candyValueToString(p);
          } else if (p.name === valueName) {
            value = candyValueToString(p);
          }
        });
        if (key) {
          keysValues.push({ key, value });
        }
      }
    });
  }

  return keysValues;
}

function parseAppData(metadataClass: PropertyShared[], odc: OdcData): void {
  const apps = getProperty(metadataClass, '__apps');
  const app = apps?.value?.Array?.find((c: any) =>
    c.Class?.find(
      (p: PropertyShared) =>
        p.name === 'app_id' && p.value?.['Text'] === 'com.origyn.metadata.general',
    ),
  );

  const appDataProperties = (app?.Class?.find((p: PropertyShared) => p.name === 'data')?.value
    ?.Class || []) as PropertyShared[];

  let displayProperties: DisplayProperty[] = [{ name: 'Token ID', value: odc.id }];

  appDataProperties.forEach((p: PropertyShared) => {
    if (!isCandyClassOrArray(p)) {
      const value = candyValueToString(p);

      if (p.name) {
        displayProperties.push({ name: toSentenceCase(p.name), value });

        switch (p.name) {
          case 'collection_id':
            odc.collectionId = value;
            break;
          case 'display_name':
            odc.displayName = value;
            break;
          case 'description':
            odc.description = value;
            break;
        }
      }
    }

    if (p.name === 'custom_properties' && p.value) {
      const customProperties = p.value['Array'] || [];
      customProperties.forEach((customProperty: PropertyShared) => {
        if (!isCandyClassOrArray(customProperty)) {
          if (customProperty.name) {
            displayProperties.push({
              name: toSentenceCase(customProperty.name),
              value: candyValueToString(customProperty),
            });
          }
        }
      });
    }

    if (p.name === 'social_links') {
      odc.socialLinks = toKeysValues(p, 'type', 'url').map((keyValue) => {
        return {
          type: keyValue.key,
          url: keyValue.value,
        };
      });
    }
  });

  displayProperties.push({ name: 'Owner', value: odc.ownerPrincipalId });
  odc.displayProperties = displayProperties;
}

export function parseMetadata(metadataClass: PropertyShared[]): OdcData {
  const odc = initOdcData();
  odc.id = getTextValue(metadataClass, 'id');

  odc.ownerPrincipalId = getPrincipalValue(metadataClass, 'owner');
  odc.originatorPrincipalId = getPrincipalValue(metadataClass, 'com.origyn.originator');
  odc.nodePrincipalId = getPrincipalValue(metadataClass, 'com.origyn.node');
  odc.networkPrincipalId = getPrincipalValue(metadataClass, 'com.origyn.network');

  odc.hasPrimaryAsset = !!metadataClass?.find((p) => ['primary_asset', 'primary'].includes(p.name));
  odc.hasPreviewAsset = !!metadataClass?.find((p) => ['preview_asset', 'preview'].includes(p.name));
  odc.hasHiddenAsset = !!metadataClass?.find((p) => ['hidden_asset', 'hidden'].includes(p.name));
  odc.hasExperienceAsset = !!metadataClass?.find((p) =>
    ['experience_asset', 'experience'].includes(p.name),
  );

  odc.primaryRoyalties = parseRoyalties(metadataClass, RoyaltyType.primary);
  odc.secondaryRoyalties = parseRoyalties(metadataClass, RoyaltyType.secondary);

  parseAppData(metadataClass, odc);
  return odc;
}

export function parseOdc(odcInfo: NFTInfoStable): OdcDataWithSale {
  const metadataClass = odcInfo?.metadata['Class'] as PropertyShared[];
  if (!metadataClass) {
    throw new Error('Metadata class not found when parsing');
  }

  let odc: any = initOdcSaleData(parseMetadata(metadataClass));
  // default to OGY token if no auction
  odc.token = {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    canister: Principal.fromText(process.env.PUBLIC_OGY_LEDGER_CANISTER_ID),
    decimals: 8n,
    fee: 200000n,
    standard: { ICRC1: null },
    symbol: 'OGY',
  };
  odc.tokenSymbol = odc.token.symbol;

  /*@ts-ignore*/
  odc.auction = odcInfo?.current_sale[0]?.sale_type?.auction;
  odc.saleId = '';
  odc.currentBid = 0;

  if (odc.auction) {
    odc.auctionOpen = 'open' in odc.auction.status;
    odc.auctionClosed = 'closed' in odc.auction.status;
    odc.auctionNotStarted = 'not_started' in odc.auction.status;

    // only assign the saleId if the auction is open
    // this ensures that sale ids from closed auctions are not
    // used to create escrows for offers or bids
    if (odc.auctionOpen) {
      odc.saleId = odcInfo.current_sale?.[0]?.sale_id ?? '';
      odc.currentBid = Number(odc.auction.current_bid_amount || 0);
    }

    if ('auction' in (odc.auction?.config ?? {})) {
      const auctionConfig = odc.auction.config.auction;
      odc.buyNow = Number(auctionConfig.buy_now?.[0] || 0);
      if ('ic' in auctionConfig.token) {
        odc.token = auctionConfig.token.ic;
        odc.tokenSymbol = auctionConfig.token.ic.symbol;
      }
      odc.minIncreaseAmount =
        'amount' in auctionConfig.min_increase ? auctionConfig.min_increase.amount : 0n;
      odc.minIncreasePercentage =
        'percentage' in auctionConfig.min_increase ? auctionConfig.min_increase.percentage : 0;
      odc.reserve = Number(auctionConfig.reserve?.[0] || 0);
      odc.startPrice = Number(auctionConfig.start_price || 0);
    }

    if ('dutch' in (odc.auction?.config ?? {})) {
      let dutchConfig = odc.auction.config.dutch;
      odc.isDutchAuction = true;
      odc.startPrice = Number(dutchConfig.start_price || 0);
      odc.reserve = Number(dutchConfig.reserve?.[0] || 0);
      odc.decayPerHour = Number(dutchConfig.decay_per_hour || 0);
    }
  }

  return odc;
}

export function parseOdcs(data: NFTInfoStable[]): OdcDataWithSale[] {
  return data.map((odc): OdcDataWithSale => {
    return parseOdc(odc);
  });
}

export function parseTokenSymbol(escrow: EscrowRecord): string {
  if ('ic' in escrow.token) {
    return escrow.token.ic.symbol;
  }
  return ''; // default to empty string
}

export const getActiveAttendedAuctions = (
  saleInfo: T.SaleInfoResponse,
  principal: Principal,
): T.AuctionStateStable[] => {
  if ('active' in saleInfo && saleInfo.active.records) {
    const activeSalesRecords = saleInfo.active.records.flatMap((record) => {
      return record[1];
    });

    const activeAuctions = activeSalesRecords
      .map((record) => {
        if ('auction' in record.sale_type) {
          return record.sale_type.auction;
        }
      })
      .filter((auction) => auction);

    if (activeAuctions.length > 0) {
      const activeAttendedAuctions = activeAuctions.filter((a) => {
        return (
          a?.current_escrow?.length &&
          a.participants.some((participant) => participant[0].toText() === principal.toText())
        );
      });
      return activeAttendedAuctions as T.AuctionStateStable[];
    }
  }

  return [];
};

export const getTxOfActiveAttendedAuctions = (
  activeAttendedAuctions: T.TransactionRecord[],
  principal: Principal,
): T.TransactionRecord[] => {
  if (activeAttendedAuctions.length > 0) {
    return activeAttendedAuctions
      .flat()
      .filter(
        (record) =>
          'auction_bid' in record.txn_type &&
          'buyer' in record.txn_type.auction_bid &&
          'principal' in record.txn_type.auction_bid.buyer &&
          record.txn_type.auction_bid.buyer.principal.toText() === principal.toText(),
      );
  }
  return [];
};

export const getHighestSentBids = (
  attendedAuctionsTx: T.TransactionRecord[],
): T.TransactionRecord[] => {
  const bidsTokenIds = new Map<string, T.TransactionRecord>();
  for (const txRecord of attendedAuctionsTx) {
    const auctionBid = 'auction_bid' in txRecord.txn_type && txRecord.txn_type.auction_bid;
    if (auctionBid) {
      const token = txRecord.token_id;
      if (!bidsTokenIds.has(token) || txRecord.timestamp > bidsTokenIds.get(token)!.timestamp) {
        bidsTokenIds.set(token, txRecord);
      }
    }
  }
  return Array.from(bidsTokenIds.values());
};

export const sortBidsReceived = (bids: ReceivedActiveBidsProps[]): ReceivedActiveBidsProps[] => {
  bids.sort((a, b) => {
    if (a.auction?.end_date && b.auction?.end_date) {
      if (a.auction.end_date < b.auction.end_date) {
        return -1;
      }
      if (a.auction.end_date > b.auction.end_date) {
        return 1;
      }
    }
    if (toBigNumber(a.amount).gt(toBigNumber(b.amount))) {
      return -1;
    }
    if (toBigNumber(a.amount).lt(toBigNumber(b.amount))) {
      return 1;
    }
    return 0; // Add this line to handle the case when all comparisons are equal
  });
  return bids;
};
