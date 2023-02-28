import { Principal } from '@dfinity/principal';
import { NFTInfoStable, Property } from '../../common/types/src/origynNftReference';
import { DisplayProperty, OdcData, OdcDataWithSale, Royalty, RoyaltyType } from './interfaces';
import { toSentenceCase } from './string';

const OGY_LEDGER_CANISTER_ID = 'jwcfb-hyaaa-aaaaj-aac4q-cai';

export function getProperty(properties: any, propertyName: string) {
  return properties?.find(({ name }) => name === propertyName);
}

export function getTextValue(properties: Property[], propertyName: string): string {
  const p = getProperty(properties, propertyName);
  return p?.value?.Text || '';
}

const getPrincipalValue = (properties: any, propertyName: string): string => {
  const p = getProperty(properties, propertyName);
  return p?.value?.Principal?.toText() || '';
};

export function isCandyClassOrArray(candy: Property): boolean {
  return !!(candy.value?.['Class'] || candy.value?.['Array']);
}

export function candyValueToString(candy: Property) {
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

function parseRoyalties(metadataClass: Property[], royaltyType: RoyaltyType): Royalty[] {
  let royalties: Royalty[] = [];

  const name =
    royaltyType === RoyaltyType.primary
      ? 'com.origyn.royalties.primary'
      : 'com.origyn.royalties.secondary';

  const systemProperties = metadataClass?.find((p) => p.name === '__system')?.value?.[
    'Class'
  ] as Property[];

  if (systemProperties) {
    const royalties = systemProperties.find((p) => p.name === name)?.value?.['Array']?.[
      'frozen'
    ] as { Class: Property[] }[];
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
  property: Property,
  keyName: string,
  valueName: string,
): { key: string; value: string }[] {
  const keysValues: { key: string; value: string }[] = [];

  if ('Array' in property.value) {
    const candyArray = property.value.Array?.['thawed'] || property.value.Array?.['frozen'] || [];

    candyArray.forEach((item: any) => {
      if ('Class' in item.value) {
        const candyClass = item.value.Class as Property[];
        let key: string = '';
        let value: string = '';
        candyClass.forEach((p: Property) => {
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

function parseAppData(metadataClass: Property[], odc: OdcData): void {
  const apps = getProperty(metadataClass, '__apps');
  const app = apps?.value?.Array?.thawed?.find((c: any) =>
    c.Class?.find(
      (p: Property) => p.name === 'app_id' && p.value?.['Text'] === 'com.origyn.metadata.general',
    ),
  );

  const appDataProperties = app?.Class?.find((p: Property) => p.name === 'data')?.value
    ?.Class as Property[];

  let displayProperties: DisplayProperty[] = [{ name: 'Token ID', value: odc.id }];

  appDataProperties.forEach((p: Property) => {
    if (!isCandyClassOrArray(p)) {
      displayProperties.push({ name: toSentenceCase(p.name), value: candyValueToString(p) });
    }

    if (p.name === 'custom_properties' && 'Array' in p.value) {
      const customProperties = p.value.Array?.['thawed'] || p.value.Array?.['frozen'] || [];
      customProperties.forEach((customProperty: Property) => {
        if (!isCandyClassOrArray(customProperty)) {
          displayProperties.push({
            name: toSentenceCase(customProperty.name),
            value: candyValueToString(customProperty),
          });
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
  odc.collectionId = displayProperties.find((p) => p.name === 'collection_id')?.value || '';
  odc.displayName = displayProperties.find((p) => p.name === 'display_name')?.value || '';
  odc.description = displayProperties.find((p) => p.name === 'description')?.value || '';
}

export function parseMetadata(metadataClass: Property[]): OdcData {
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
  const metadataClass = odcInfo?.metadata['Class'] as Property[];
  if (!metadataClass) {
    throw new Error('Metadata class not found when parsing');
  }

  let odc = initOdcSaleData(parseMetadata(metadataClass));
  // default to OGY token if no auction
  odc.token = {
    canister: Principal.fromText(OGY_LEDGER_CANISTER_ID),
    decimals: 8n,
    fee: 200000n,
    standard: { Ledger: null },
    symbol: 'OGY',
  };
  odc.tokenSymbol = odc.token.symbol;

  odc.auction = odcInfo?.current_sale[0]?.sale_type?.auction;
  odc.saleId = odcInfo?.current_sale[0]?.sale_id || '';

  if (odc.auction) {
    odc.auctionOpen = 'open' in odc.auction.status;
    odc.auctionClosed = 'closed' in odc.auction.status;
    odc.auctionNotStarted = 'not_started' in odc.auction.status;
    odc.currentBid = Number(odc.auction.current_bid_amount || 0);

    if ('auction' in odc.auction?.config) {
      const auctionConfig = odc.auction.config.auction;
      odc.buyNow = Number(auctionConfig.buy_now?.[0] || 0);
      if ('ic' in auctionConfig.token) {
        odc.token = auctionConfig.token.ic;
        odc.tokenSymbol = odc.token.symbol;
      }
      odc.minIncreaseAmount =
        'amount' in auctionConfig.min_increase ? auctionConfig.min_increase.amount : 0n;
      odc.minIncreasePercentage =
        'percentage' in auctionConfig.min_increase ? auctionConfig.min_increase.percentage : 0;
      odc.reserve = Number(auctionConfig.reserve?.[0] || 0);
      odc.startPrice = Number(auctionConfig.start_price || 0);
    }

    if ('dutch' in odc.auction?.config) {
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
    return parseOdc(odc['ok']);
  });
}
