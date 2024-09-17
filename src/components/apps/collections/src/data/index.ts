import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './canisters/gold/did';
import { Principal } from '@dfinity/principal';
import { _SERVICE } from '../data/canisters/gold/interfaces/gld_nft';

export interface Collection {
  name: string;
  checked: boolean;
  image: string;
  creator: string;
  nftCount: number;
}

export interface BackendResponse {
  collections: Collection[];
  totalPages: number;
}

export const fetchCollectionsFromBackend = async (
  page: number,
  itemsPerPage: number,
): Promise<BackendResponse> => {
  try {
    const agent = new HttpAgent({ host: 'https://ic0.app' });
    const canisterId = 'io7gn-vyaaa-aaaak-qcbiq-cai';
    const actor = Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId,
    });

    const logoResult = await actor.icrc7_logo();
    console.log('logoResult', logoResult);

    const collectionResult = await actor.collection_nft_origyn([]);
    if (!('ok' in collectionResult)) {
      throw new Error(
        `Erreur lors de la récupération de la collection : ${collectionResult.err.text}`,
      );
    }
    const collectionInfo = collectionResult.ok;

    if (!collectionInfo.token_ids || collectionInfo.token_ids.length === 0) {
      return { collections: [], totalPages: 0 };
    }

    const tokenIds = collectionInfo.token_ids[0];

    const nftResults = await actor.nft_batch_origyn(tokenIds);

    const collections: Collection[] = nftResults
      .map((nftResult, index) => {
        if ('ok' in nftResult) {
          const metadata = nftResult.ok.metadata;
          const name = extractName(metadata);
          const creator = extractCreator(metadata);
          const nftCount = 1; // TODO
          return {
            name,
            checked: true,
            image: logoResult ? logoResult : '',
            creator,
            nftCount,
          };
        } else {
          console.error(`Erreur pour le token ${tokenIds[index]}: ${nftResult.err.text}`);
          return undefined;
        }
      })
      .filter((item): item is Collection => item !== undefined);

    const totalPages = Math.ceil(collections.length / itemsPerPage);

    console.log('collections', collections);

    return {
      collections,
      totalPages,
    };
  } catch (error) {
    console.error('Erreur dans fetchCollectionsFromBackend:', error);
    return { collections: [], totalPages: 0 };
  }
};

const extractName = (metadata: any): string => {
  if ('Class' in metadata) {
    const properties = metadata.Class;

    const appsProp = properties.find((prop: any) => prop.name === '__apps');
    if (appsProp && 'Array' in appsProp.value) {
      const appsArray = appsProp.value.Array;

      for (const app of appsArray) {
        if ('Class' in app) {
          const appProps = app.Class;

          const appIdProp = appProps.find(
            (prop: any) =>
              prop.name === 'app_id' && prop.value.Text === 'com.origyn.metadata.general',
          );

          if (appIdProp) {
            const dataProp = appProps.find(
              (prop: any) => prop.name === 'data' && 'Class' in prop.value,
            );
            if (dataProp) {
              const dataProps = dataProp.value.Class;

              const displayNameProp = dataProps.find(
                (prop: any) => prop.name === 'display_name' && 'Text' in prop.value,
              );

              if (displayNameProp) {
                return displayNameProp.value.Text;
              }
            }
          }
        }
      }
    }
  }
  return 'Nom inconnu';
};

const extractCreator = (metadata: any): string => {
  if ('Class' in metadata) {
    const properties = metadata.Class;

    const ownerProp = properties.find(
      (prop: any) => prop.name === 'owner' && prop.value && prop.value.Principal,
    );

    if (ownerProp) {
      const principalValue = ownerProp.value.Principal;

      if (principalValue && typeof principalValue.toText === 'function') {
        return principalValue.toText();
      } else if (principalValue._arr) {
        const arrUnknown = Object.values(principalValue._arr);

        const arr = arrUnknown.map((item: unknown) => {
          if (typeof item === 'number') {
            return item;
          } else {
            return 0;
          }
        });

        const uint8Array = new Uint8Array(arr);
        const principal = Principal.fromUint8Array(uint8Array);
        return principal.toText();
      }
    }
  }
  return 'Créateur inconnu';
};
