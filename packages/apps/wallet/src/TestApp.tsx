import React, { useState } from 'react';
import { stageNft, mintNft, getNft, getNftCollection } from '@origyn-sa/mintjs';
import { OrigynClient } from '@origyn-sa/mintjs';
import ReactJson from 'react-json-view';
import JSONbig from 'json-bigint';
import './TestApp.css';
import { useForm } from 'react-hook-form';
import { Buffer } from 'buffer';

export const TestApp = () => {
  const [canisterId, setCanisterId] = useState('2t4kb-eiaaa-aaaan-qaqfa-cai');
  const [isProd, setIsProd] = useState(true);
  const [nfts, setNfts] = useState<any>([]);
  const [collection, setCollection] = useState<any>([]);
  const [dapps, setDapps] = useState<any>([]);
  const [jsonView, setJsonView] = useState({});
  const [tokenId, setTokenId] = useState<string>('');
  const [nftCollection, setNftCollection] = useState<string>('');

  const { register, handleSubmit } = useForm({
    defaultValues: {
      canisterId: canisterId,
      isLocalEnv: !isProd,
      isSoulbound: true,
      collectionName: '',
      collectionId: '',
      creatorPrincipal: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
    },
  });

  const handleButtonClick = async (data) => {
    console.log('🚀 ~ file: TestApp.tsx ~ line 27 ~ handleButtonClick ~ data', data);
    await OrigynClient.getInstance().init(isProd, canisterId, {
      key: {
        seed: 'inherit disease hill can squirrel zone science dentist sadness exist wear aim',
      },
    });
    const { actor, principal } = OrigynClient.getInstance();
    console.log('🚀 ~ file: TestApp.tsx ~ line 15 ~ handleButtonClick ~ principal', principal);
    console.log('🚀 ~ file: TestApp.tsx ~ line 15 ~ handleButtonClick ~ actor', actor);
    console.log('🚀 ~ file: TestApp.tsx ~ line 7 ~ TestApp ~ nfts', nfts);
    // console.log('🚀 ~ file: TestApp.tsx ~ line 8 ~ TestApp ~ collection', collection);
    // console.log('🚀 ~ file: TestApp.tsx ~ line 9 ~ TestApp ~ dapps', dapps);

    let i = 0;
    const collectionNameSplit = data.collectionName.split(' ');
    const getStageConfig = async () => {
      return {
        environment: data.isLocalEnv ? 'local' : 'prod',
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
    const stageResult = await stageNft(stageConfig);
    setTokenId(`${stageConfig.tokenPrefix}0`);
    console.log('🚀 ~ file: TestApp.tsx ~ line 79 ~ handleButtonClick ~ stageResult', stageResult);
  };

  const handleMintClick = async () => {
    await OrigynClient.getInstance().init(isProd, canisterId, {
      key: {
        seed: 'inherit disease hill can squirrel zone science dentist sadness exist wear aim',
      },
    });
    const mintResponse = await mintNft(tokenId);
    console.log('🚀 ~ file: TestApp.tsx ~ line 96 ~ handleMintClick ~ mintResponse', mintResponse);
  };
  const handleNftDataClick = async () => {
    await OrigynClient.getInstance().init(isProd, canisterId, {
      key: {
        seed: 'inherit disease hill can squirrel zone science dentist sadness exist wear aim',
      },
    });
    const nftData = await getNft(tokenId);
    setJsonView(JSON.parse(JSONbig.stringify(nftData)));
    console.log('🚀 ~ file: TestApp.tsx ~ line 107 ~ handleNftDataClick ~ nftData', nftData);
  };
  const handleNftCollectionClick = async () => {
    await OrigynClient.getInstance().init(isProd, canisterId, {
      key: {
        seed: 'inherit disease hill can squirrel zone science dentist sadness exist wear aim',
      },
    });
    const res = await getNftCollection([]);
    console.log('🚀 ~ file: TestApp.tsx ~ line 134 ~ handleNftCollectionClick ~ res', res);
    setJsonView(JSON.parse(JSONbig.stringify(res)));
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
            <input
              placeholder="Collection Name"
              name="collectionName"
              {...register('collectionName')}
            />
          </div>
          <br />
          <div>
            <input placeholder="Collection ID" name="collectionId" {...register('collectionId')} />
          </div>
          <br />
          <div>
            <input
              placeholder="Creator Principal"
              name="creatorPrincipal"
              {...register('creatorPrincipal')}
            />
          </div>
          <br />
          <div>
            <input
              type="checkbox"
              placeholder="Local Environment"
              name="Local Environment"
              onChange={(e) => setIsProd(!e.target.checked)}
              {...register('isLocalEnv')}
            />
            <label> Local Environment</label>
          </div>
          <div>
            <input
              type="checkbox"
              placeholder="Soulbound"
              name="Soulbound"
              {...register('isSoulbound')}
            />
            <label> Soulbound</label>
          </div>
          <br />
          <br />

          <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'left' }}>
            <div>
              <label htmlFor="collection">Choose collection level items:</label>
              <input
                type="file"
                name="collection"
                onChange={(e) => setCollection(e.target.files)}
              />
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
      </div>
      <ReactJson src={jsonView} />
    </>
  );
};
