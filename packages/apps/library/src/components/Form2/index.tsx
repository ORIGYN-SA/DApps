import React, { useState } from 'react';
import { mintNft, getNft, stageLibraryAsset, stageCollection, getNftCollectionInfo } from '@origyn-sa/mintjs';
import { OrigynClient } from '@origyn-sa/mintjs';
import JSONbig from 'json-bigint';
import { useForm } from 'react-hook-form';
import { Buffer } from 'buffer';

const TEST_IDENTITY = {
  principalId: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
  seed: 'inherit disease hill can squirrel zone science dentist sadness exist wear aim',
};
const App = () => {
  const [canisterId, setCanisterId] = useState('rubbi-ryaaa-aaaap-aajqq-cai');
  const [isProd, setIsProd] = useState(false);
  const [nfts, setNfts] = useState<any>([]);
  const [collection, setCollection] = useState<any>([]);
  const [libaryAssets, setLibraryAssets] = useState<any>([]);
  const [dapps, setDapps] = useState<any>([]);
  const [jsonView, setJsonView] = useState({});
  const [tokenId, setTokenId] = useState<string>('');
  const [nftCollection, setNftCollection] = useState<string>('');

  const { register, handleSubmit } = useForm({
    defaultValues: {
      canisterId: canisterId,
      isProduction: isProd,
      isSoulbound: true,
      collectionName: '',
      collectionId: '',
      creatorPrincipal: TEST_IDENTITY.principalId,
    },
  });

  const handleButtonClick = async (data) => {
    console.log('🚀 ~ file: App.tsx ~ line 38 ~ awaitOrigynClient.getInstance ~ isProd', isProd);
    await OrigynClient.getInstance().init(isProd, canisterId, {
      key: {
        seed: TEST_IDENTITY.seed,
      },
    });
    const { actor, principal } = OrigynClient.getInstance();

    let i = 0;
    const collectionNameSplit = data.collectionName.split(' ');
    const getStageConfig = async () => {
      return {
        environment: data.isProduction ? 'prod' : 'local',
        nftCanisterId: data.canisterId,
        collectionId: data.collectionId,
        collectionDisplayName: data.collectionName,
        tokenPrefix: `${data.collectionId}-`,
        creatorPrincipal: data.creatorPrincipal,
        namespace: collectionNameSplit.map((word) => word.toLowerCase()).join('.'),
        soulbound: data.isSoulbound,
        nftOwnerId: data.creatorPrincipal,
        collectionFiles: [
          ...(await Promise.all(
            [...collection].map(async (file) => {
              return {
                category: 'collection' as 'collection',
                filename: file.name,
                index: i++,
                path: file.path ?? `${file.size}+${file.name}`,
                size: file.size,
                type: file.type,
                rawFile: await readFileAsync(file),
              };
            }),
          )),
          ...(await Promise.all(
            [...dapps].map(async (file) => {
              return {
                category: 'dapp' as 'dapp',
                filename: file.name,
                index: i++,
                path: file.path ?? `${file.size}+${file.name}`,
                size: file.size,
                type: file.type,
                rawFile: await readFileAsync(file),
              };
            }),
          )),
        ],
        nfts: [
          ...(await Promise.all(
            [...nfts].map(async (file) => {
              return {
                quantity: 1,
                files: [
                  {
                    filename: file.name,
                    index: i++,
                    path: file.path ?? `${file.size}+${file.name}`,
                    size: file.size,
                    type: file.type,
                    rawFile: await readFileAsync(file),
                    assetType: 'preview' as 'preview', // Just make the first file of the NFT as preview asset, needs to be removed in the future
                  },
                ],
                collectionFileReferences: [collection[0].name, dapps[0].name],
              };
            }),
          )),
        ],
      };
    };

    const stageConfig = await getStageConfig();
    console.log('🚀 ~ file: TestApp.tsx ~ line 113 ~ handleButtonClick ~ stageConfig', stageConfig);
    const stageResult = await stageCollection(stageConfig);
    setTokenId(`${stageConfig.tokenPrefix}0`);
    console.log('🚀 ~ file: TestApp.tsx ~ line 79 ~ handleButtonClick ~ stageResult', stageResult);
  };

  const handleMintClick = async () => {
    await OrigynClient.getInstance().init(isProd, canisterId, {
      key: {
        seed: TEST_IDENTITY.seed,
      },
    });
    const mintResponse = await mintNft(tokenId);
    console.log('🚀 ~ file: TestApp.tsx ~ line 96 ~ handleMintClick ~ mintResponse', mintResponse);
  };

  const handleNftDataClick = async () => {
    await OrigynClient.getInstance().init(isProd, canisterId, {
      key: {
        seed: TEST_IDENTITY.seed,
      },
    });
    const nftData = await getNft(tokenId);
    setJsonView(JSON.parse(JSONbig.stringify(nftData)));
    console.log('🚀 ~ file: TestApp.tsx ~ line 107 ~ handleNftDataClick ~ nftData', nftData);
  };

  const handleNftCollectionClick = async () => {
    await OrigynClient.getInstance().init(isProd, canisterId, {
      key: {
        seed: TEST_IDENTITY.seed,
      },
    });
    const res = await getNftCollectionInfo();
    console.log('🚀 ~ file: TestApp.tsx ~ line 134 ~ handleNftCollectionClick ~ res', res);
    setJsonView(JSON.parse(JSONbig.stringify(res)));
  };

  const handleStageLibraryAssetClick = async () => {
    await OrigynClient.getInstance().init(isProd, canisterId, {
      key: {
        seed: TEST_IDENTITY.seed,
      },
    });
    let i = 0;
    const payload = {
      token_id: tokenId,
      files: [
        ...(await Promise.all(
          [...libaryAssets].map(async (file) => {
            return {
              filename: file.name,
              index: i++,
              path: file.path ?? `${file.size}+${file.name}`,
              size: file.size,
              type: file.type,
              rawFile: await readFileAsync(file),
            };
          }),
        )),
      ],
    };
    console.log('🚀 ~ file: App.tsx ~ line 179 ~ handleStageLibraryAssetClick ~ payload', payload);

    const stage = await stageLibraryAsset(payload.files, false, payload.token_id);
    console.log('🚀 ~ file: App.tsx ~ line 175 ~ handleStageLibraryAssetClick ~ stage', stage);
  };
  // Functions needed for file to Buffer
  const arrayToBuffer = (arrayBuffer) => {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  };
  const readFileAsync = (file: File): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(arrayToBuffer(reader.result));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh',
        }}
      >
        <form
          onSubmit={handleSubmit(handleButtonClick)}
          style={{
            width: '350px',
            textAlign: 'center',
            gap: 10,
          }}
        >
          <div>
            <input
              placeholder="Canister ID"
              name="CanisterId"
              onChange={(e) => setCanisterId(e.target.value)}
              {...register('canisterId')}
            />
          </div>
          <br />
          <div>
            <input placeholder="Collection Name" name="collectionName" {...register('collectionName')} />
          </div>
          <br />
          <div>
            <input placeholder="Collection ID" name="collectionId" {...register('collectionId')} />
          </div>
          <br />
          <div>
            <input placeholder="Creator Principal" name="creatorPrincipal" {...register('creatorPrincipal')} />
          </div>
          <br />
          <div>
            <input
              type="checkbox"
              placeholder="IC Main Net"
              name="IC Main Net"
              onChange={(e) => setIsProd(e.target.checked)}
              {...register('isProduction')}
            />
            <label> IC Main Net</label>
          </div>
          <div>
            <input type="checkbox" placeholder="Soulbound" name="Soulbound" {...register('isSoulbound')} />
            <label> Soulbound</label>
          </div>
          <br />
          <br />

          <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'left' }}>
            <div>
              <label htmlFor="collection">Choose collection level items:</label>
              <input type="file" name="collection" onChange={(e) => setCollection(e.target.files)} />
            </div>
            <br />
            <div>
              <label htmlFor="dapps">Choose dApps:</label>
              <input type="file" name="dapps" onChange={(e) => setDapps(e.target.files)} />
            </div>
            <br />
            <div>
              <label htmlFor="nfts">Choose NFTs:</label>
              <input type="file" name="nfts" multiple onChange={(e) => setNfts(e.target.files)} />
            </div>
          </div>
          <br />
          <br />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <button type="submit">Stage</button>
          </div>
        </form>
        <br />
        <hr
          style={{
            color: 'gray',
            backgroundColor: 'gray',
            height: 1,
            width: '500px',
          }}
        />
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'left' }}>
          <div>
            <input
              name="token_id"
              placeholder="Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <button onClick={handleMintClick}>Mint</button>
          <button onClick={handleNftDataClick}>Get NFT Data</button>
        </div>
        <hr
          style={{
            color: 'gray',
            backgroundColor: 'gray',
            height: 1,
            width: '500px',
          }}
        />
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'left' }}>
          <div>
            <input
              name="collection_name"
              placeholder="Collection ID"
              value={nftCollection}
              onChange={(e) => setNftCollection(e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <button onClick={handleNftCollectionClick}>Get Collection Data</button>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'left' }}>
          <div>
            <input type="file" onChange={(e) => setLibraryAssets(e.target.files)} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <button onClick={handleStageLibraryAssetClick}>Stage Library Asset</button>
        </div>
      </div>
    </>
  );
};

export default App;